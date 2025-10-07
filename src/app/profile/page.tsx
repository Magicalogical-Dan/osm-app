'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { createClientSupabase } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { Save, User, MapPin, Briefcase, Trophy, Mail, Calendar, Flag } from 'lucide-react'
import Image from 'next/image'

interface PlayerData {
  id: string
  first_name: string
  last_name: string
  full_name: string
  slug: string
  club: string
  position: string
  nationality: string
  age: number
  email: string
  sport: string
  instagram_url?: string
  tiktok_url?: string
  twitter_url?: string
  created_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Partial<Profile>>({
    club: '',
    position: '',
    bio: '',
    sport: undefined,
    instagram_url: '',
    tiktok_url: '',
    twitter_url: '',
    tooltips_enabled: true,
  })
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientSupabase()

  const loadProfile = async () => {
    try {
      // Load profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load player data if it exists
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (playerData) {
        setPlayerData(playerData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user, loadProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        setMessage('Error saving profile: ' + profileError.message)
        return
      }

      // Update player data if it exists
      if (playerData) {
        const { error: playerError } = await supabase
          .from('players')
          .update({
            first_name: playerData.first_name,
            last_name: playerData.last_name,
            club: playerData.club,
            position: playerData.position,
            nationality: playerData.nationality,
            age: playerData.age,
            email: playerData.email,
            sport: playerData.sport,
            instagram_url: playerData.instagram_url,
            tiktok_url: playerData.tiktok_url,
            twitter_url: playerData.twitter_url,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)

        if (playerError) {
          setMessage('Error saving player data: ' + playerError.message)
          return
        }
      }

      setMessage('Profile saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/O.png"
            alt="O"
            width={2000}
            height={2000}
            className="opacity-5"
            style={{
              width: '150vh',
              height: '150vh',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)'
            }}
            priority
          />
        </div>
        <div className="relative z-10 h-screen overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 pt-8 pb-32">
            <div className="h-8 bg-white/20 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/O.png"
          alt="O"
          width={2000}
          height={2000}
          className="opacity-5"
          style={{
            width: '150vh',
            height: '150vh',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)'
          }}
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-32">
          <div className="flex items-center space-x-3 mb-8">
            <User className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Player Profile</h1>
          </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-osm-red-light border border-osm-red text-osm-red' 
              : 'bg-osm-green-light border border-osm-green text-osm-green'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Player Information */}
          {playerData && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-white" />
                Player Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={playerData.first_name || ''}
                    onChange={(e) => setPlayerData({ ...playerData, first_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={playerData.last_name || ''}
                    onChange={(e) => setPlayerData({ ...playerData, last_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={playerData.email || ''}
                    onChange={(e) => setPlayerData({ ...playerData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={playerData.age || ''}
                    onChange={(e) => setPlayerData({ ...playerData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="Enter your age"
                    min="16"
                    max="50"
                  />
                </div>

                <div>
                  <label htmlFor="club" className="block text-sm font-medium text-white mb-2">
                    Club
                  </label>
                  <input
                    type="text"
                    id="club"
                    value={playerData.club || ''}
                    onChange={(e) => setPlayerData({ ...playerData, club: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="Enter your club name"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-white mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={playerData.position || ''}
                    onChange={(e) => setPlayerData({ ...playerData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="e.g., Fly-half, Prop, Hooker"
                  />
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Flag className="w-4 h-4 mr-2" />
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    value={playerData.nationality || ''}
                    onChange={(e) => setPlayerData({ ...playerData, nationality: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    placeholder="e.g., English, Australian, Welsh"
                  />
                </div>

                <div>
                  <label htmlFor="sport" className="block text-sm font-medium text-white mb-2">
                    Sport
                  </label>
                  <select
                    id="sport"
                    value={playerData.sport || ''}
                    onChange={(e) => setPlayerData({ ...playerData, sport: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  >
                    <option value="" className="text-gray-900">Select your sport</option>
                    <option value="football" className="text-gray-900">Football</option>
                    <option value="basketball" className="text-gray-900">Basketball</option>
                    <option value="tennis" className="text-gray-900">Tennis</option>
                    <option value="athletics" className="text-gray-900">Athletics</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-white" />
              Additional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="profile_club" className="block text-sm font-medium text-white mb-2">
                  Club (Profile)
                </label>
                <input
                  type="text"
                  id="profile_club"
                  value={profile.club || ''}
                  onChange={(e) => setProfile({ ...profile, club: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="Enter your club name"
                />
              </div>

              <div>
                <label htmlFor="profile_position" className="block text-sm font-medium text-white mb-2">
                  Position (Profile)
                </label>
                <input
                  type="text"
                  id="profile_position"
                  value={profile.position || ''}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="e.g., Fly-half, Prop, Hooker"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="profile_sport" className="block text-sm font-medium text-white mb-2">
                  Sport (Profile)
                </label>
                <select
                  id="profile_sport"
                  value={profile.sport || ''}
                  onChange={(e) => setProfile({ ...profile, sport: e.target.value as 'football' | 'basketball' | 'tennis' | 'athletics' })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                >
                  <option value="" className="text-gray-900">Select your sport</option>
                  <option value="football" className="text-gray-900">Football</option>
                  <option value="basketball" className="text-gray-900">Basketball</option>
                  <option value="tennis" className="text-gray-900">Tennis</option>
                  <option value="athletics" className="text-gray-900">Athletics</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-white" />
              Social Media
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-white mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagram"
                  value={profile.instagram_url || ''}
                  onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-white mb-2">
                  TikTok URL
                </label>
                <input
                  type="url"
                  id="tiktok"
                  value={profile.tiktok_url || ''}
                  onChange={(e) => setProfile({ ...profile, tiktok_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="https://tiktok.com/@yourusername"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-white mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="twitter"
                  value={profile.twitter_url || ''}
                  onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-3 text-white" />
              Preferences
            </h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tooltips"
                checked={profile.tooltips_enabled}
                onChange={(e) => setProfile({ ...profile, tooltips_enabled: e.target.checked })}
                className="h-4 w-4 text-white focus:ring-white/50 border-white/30 rounded bg-white/20"
              />
              <label htmlFor="tooltips" className="ml-2 block text-sm text-white">
                Enable tooltips to help guide you through the app
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-white/30"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
