'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { 
  Users, 
  Instagram, 
  ExternalLink, 
  MessageCircle, 
  Share2,
  Download,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react'
import Image from 'next/image'

export default function SocialPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

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

  // George Williams' social media profiles with hardcoded data
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/georgewilliamss/',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      followers: '38k',
      connected: true
    },
    {
      name: 'Twitter/X',
      url: 'https://x.com/george7williams?lang=en',
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      followers: '18k',
      connected: true
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@georgewilliams',
      icon: ExternalLink,
      color: 'text-black',
      bgColor: 'bg-gray-100',
      followers: '2.3k',
      connected: true
    },
  ]

  const downloadGuides = [
    {
      title: 'Social Media Best Practices Guide',
      description: 'Complete guide to building your social media presence as a rugby player',
      icon: FileText,
      downloadUrl: '#',
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      title: 'Content Calendar Template',
      description: 'Plan your posts with our professional content calendar template',
      icon: Calendar,
      downloadUrl: '#',
      size: '1.2 MB',
      type: 'Excel'
    },
    {
      title: 'Hashtag Research Guide',
      description: 'Find the best hashtags for rugby and sports content',
      icon: Share2,
      downloadUrl: '#',
      size: '850 KB',
      type: 'PDF'
    },
    {
      title: 'Engagement Analytics Template',
      description: 'Track your social media performance with our analytics template',
      icon: BarChart3,
      downloadUrl: '#',
      size: '1.8 MB',
      type: 'Excel'
    }
  ]

  const downloadGuide = (guide: { title: string; description: string }) => {
    // In a real app, this would trigger the actual download
    alert(`Downloading ${guide.title}...`)
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

  return (
    <AuthGuard>
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
          <div className="flex items-center space-x-3 mb-8 pt-8">
            <Users className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Social Media</h1>
          </div>

        {/* Page Introduction */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Welcome to Your Social Hub{profile?.club ? `, ${profile.club} Player` : ''}</h2>
            </div>
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <p className="text-white/80 mb-4">
                Manage your social media presence across all platforms. Track your growth, engage with your audience, and optimize your content strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
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

        {/* Download Guide Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Download className="w-6 h-6 mr-3 text-white" />
            Download Guides & Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloadGuides.map((guide, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <guide.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{guide.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <span>{guide.type}</span>
                        <span>•</span>
                        <span>{guide.size}</span>
                      </div>
                      <button
                        onClick={() => downloadGuide(guide)}
                        className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center space-x-2 border border-white/30"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
