'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { createClientSupabase } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { 
  Settings, 
  Bell, 
  Save, 
  User, 
  Shield,
  Palette
} from 'lucide-react'
import Image from 'next/image'

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Partial<Profile>>({
    tooltips_enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      news: true,
      social: false,
    },
    appearance: {
      theme: 'auto',
      colorScheme: 'osm-blue',
    },
    privacy: {
      profileVisible: true,
      showContactInfo: false,
    },
  })
  const supabase = createClientSupabase()

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setProfile(data)
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

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        setMessage('Error saving settings: ' + error.message)
      } else {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch {
      setMessage('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }


  if (loading) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/S.png"
            alt="S"
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
      <div className="bg-black">
      {/* Background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/S.png"
          alt="S"
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
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
          <div className="flex items-center space-x-3 mb-8">
            <Settings className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
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

        {/* App Preferences */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-3 text-white" />
            App Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Enable Tooltips</h3>
                <p className="text-sm text-white/80">Show helpful hints throughout the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.tooltips_enabled}
                  onChange={(e) => setProfile({ ...profile, tooltips_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-white" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Email Notifications</h3>
                <p className="text-sm text-white/80">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Push Notifications</h3>
                <p className="text-sm text-white/80">Receive push notifications on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">News Updates</h3>
                <p className="text-sm text-white/80">Get notified about new sports news</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.news}
                  onChange={(e) => handleNotificationChange('news', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Social Media Updates</h3>
                <p className="text-sm text-white/80">Get notified about social media activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.social}
                  onChange={(e) => handleNotificationChange('social', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-white" />
            Privacy Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Profile Visibility</h3>
                <p className="text-sm text-white/80">Make your profile visible to other users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Show Contact Information</h3>
                <p className="text-sm text-white/80">Display your contact information on your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showContactInfo}
                  onChange={(e) => handlePrivacyChange('showContactInfo', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-3 text-white" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-white mb-2">
                Theme
              </label>
              <select
                id="theme"
                value={settings.appearance.theme}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, theme: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              >
                <option value="auto" className="text-gray-900">Auto (System)</option>
                <option value="light" className="text-gray-900">Light</option>
                <option value="dark" className="text-gray-900">Dark</option>
              </select>
            </div>

            <div>
              <label htmlFor="colorScheme" className="block text-sm font-medium text-white mb-2">
                Color Scheme
              </label>
              <select
                id="colorScheme"
                value={settings.appearance.colorScheme}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, colorScheme: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              >
                <option value="osm-blue" className="text-gray-900">OSM Blue</option>
                <option value="osm-green" className="text-gray-900">OSM Green</option>
                <option value="osm-red" className="text-gray-900">OSM Red</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-white/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
