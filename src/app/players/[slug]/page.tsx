'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Instagram, 
  ExternalLink, 
  MessageCircle, 
  Calendar,
  ArrowLeft,
  Mail,
  MapPin,
  Flag,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Player {
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
  bio?: string
  sport: string
  instagram_url?: string
  tiktok_url?: string
  twitter_url?: string
  created_at: string
}

export default function PlayerProfilePage() {
  const { user } = useAuth()
  const params = useParams()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPlayer = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error) {
        console.error('Error loading player:', error)
        return
      }

      setPlayer(data)
    } catch (error) {
      console.error('Error loading player:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && params.slug) {
      loadPlayer()
    }
  }, [user, params.slug, loadPlayer])

  const socialLinks = [
    {
      name: 'Instagram',
      url: player?.instagram_url,
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      followers: '38k',
      connected: !!player?.instagram_url
    },
    {
      name: 'Twitter/X',
      url: player?.twitter_url,
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      followers: '18k',
      connected: !!player?.twitter_url
    },
    {
      name: 'TikTok',
      url: player?.tiktok_url,
      icon: ExternalLink,
      color: 'text-black',
      bgColor: 'bg-gray-100',
      followers: '2.3k',
      connected: !!player?.tiktok_url
    },
  ].filter(link => link.connected)


  if (!user) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(101, 165, 44)' }}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/S.png"
            alt="S"
            width={2000}
            height={2000}
            className="opacity-8"
            style={{
              width: '150vh',
              height: '150vh',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)'
            }}
            priority
          />
        </div>
        <div className="relative z-10 h-screen flex items-center justify-center px-4 overflow-hidden">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Please sign in to view player profile</h1>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(101, 165, 44)' }}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/S.png"
            alt="S"
            width={2000}
            height={2000}
            className="opacity-8"
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
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(101, 165, 44)' }}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/S.png"
            alt="S"
            width={2000}
            height={2000}
            className="opacity-8"
            style={{
              width: '150vh',
              height: '150vh',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)'
            }}
            priority
          />
        </div>
        <div className="relative z-10 h-screen flex items-center justify-center px-4 overflow-hidden">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Player not found</h1>
            <Link href="/players" className="text-white/80 hover:text-white transition-colors">
              ← Back to Players
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(101, 165, 44)' }}>
      {/* Background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/S.png"
          alt="S"
          width={2000}
          height={2000}
          className="opacity-8"
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
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-32">
          {/* Back Button */}
          <div className="mb-6 pt-8">
            <Link 
              href="/players" 
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Players</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 mb-8">
            <Users className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{player.full_name}</h1>
          </div>

          {/* Player Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Player Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Position: {player.position}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Club: {player.club}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Flag className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Nationality: {player.nationality}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Age: {player.age}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white/60" />
                    <span className="text-white/80">Email: {player.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Social Media Stats</h2>
                <div className="grid grid-cols-1 gap-4 text-sm text-white/60">
                  <div className="flex items-center justify-center">
                    <Instagram className="w-4 h-4 mr-2" />
                    <span>38k Instagram Followers</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>18k Twitter Followers</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>2.3k TikTok Followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
                <h2 className="text-2xl font-bold text-white mb-6">Connected Social Accounts</h2>
                
                <div className="space-y-4">
                  {socialLinks.map((link) => (
                    <div key={link.name} className="flex items-center justify-between p-4 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/20">
                          <link.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-white">{link.name}</span>
                          <div className="text-sm text-white/80">{link.followers} followers</div>
                        </div>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80 transition-colors flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
