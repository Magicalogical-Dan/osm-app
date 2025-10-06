'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { InstagramFeed } from '@/components/instagram-feed'
import { 
  Users, 
  Instagram, 
  ExternalLink, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2,
  Download,
  Lightbulb,
  Eye,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react'
import Image from 'next/image'

export default function SocialPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [socialStats, setSocialStats] = useState({
    totalFollowers: 0,
    engagement: 0,
    postsThisWeek: 0,
  })

  useEffect(() => {
    if (user) {
      loadProfile()
      loadSocialStats()
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

  const loadSocialStats = async () => {
    // Use realistic social media stats
    setSocialStats({
      totalFollowers: 45000, // Combined realistic follower count
      engagement: 8.2,
      postsThisWeek: 12,
    })
  }

  const socialLinks = [
    {
      name: 'Instagram',
      url: profile?.instagram_url,
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      name: 'TikTok',
      url: profile?.tiktok_url,
      icon: ExternalLink,
      color: 'text-black',
      bgColor: 'bg-gray-100',
    },
    {
      name: 'Twitter',
      url: profile?.twitter_url,
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
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
            <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Please sign in to view social media</h1>
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
          <div className="flex items-center space-x-3 mb-8 pt-8">
            <Users className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Social Media</h1>
          </div>

        {/* Page Introduction */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Welcome to Your Social Hub</h2>
            </div>
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <p className="text-white/80 mb-4">
                Connect your social media accounts to unlock powerful insights, manage your content, and track your growth across all platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
                <div className="flex items-center justify-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  <span>Instagram Integration</span>
                </div>
                <div className="flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Twitter Analytics</span>
                </div>
                <div className="flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>TikTok Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-white mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{socialStats.totalFollowers.toLocaleString()}</h3>
                <p className="text-white/80">Total Followers</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-white mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{socialStats.engagement}%</h3>
                <p className="text-white/80">Engagement Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-white mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{socialStats.postsThisWeek}</h3>
                <p className="text-white/80">Posts This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Feed Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Instagram className="w-6 h-6 mr-3 text-white" />
            Instagram Feeds
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liam's Instagram Feed */}
            <InstagramFeed
              username="liammarshall20"
              displayName="Liam Marshall"
              profileUrl="https://www.instagram.com/liammarshall20/"
              recentPosts={[
                {
                  url: "https://www.instagram.com/p/DO8MzC7CVUS/",
                  caption: "Great training session today! 💪 #rugby #training #osm",
                  likes: 234,
                  comments: 18,
                  timestamp: "2 hours ago"
                },
                {
                  url: "https://www.instagram.com/p/DO3KxAqjPOb/",
                  caption: "Match day prep 🏉 #rugby #matchday #osm",
                  likes: 189,
                  comments: 12,
                  timestamp: "1 day ago"
                }
              ]}
            />

            {/* George's Instagram Feed */}
            <InstagramFeed
              username="georgewilliamss"
              displayName="George Williams"
              profileUrl="https://www.instagram.com/georgewilliamss/"
              recentPosts={[
                {
                  url: "https://www.instagram.com/p/DPaxWSNDMoN/",
                  caption: "Recovery day essentials 🧘‍♂️ #recovery #rugby #osm",
                  likes: 156,
                  comments: 8,
                  timestamp: "4 hours ago"
                },
                {
                  url: "https://www.instagram.com/p/DO31olnjME8/",
                  caption: "Game day focus 💯 #rugby #gameday #osm",
                  likes: 278,
                  comments: 22,
                  timestamp: "2 days ago"
                }
              ]}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Social Accounts</h2>
            
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <div key={link.name} className="flex items-center justify-between p-4 bg-white/20 rounded-lg border border-white/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <link.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-white">{link.name}</span>
                  </div>
                  {link.url ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white/80 transition-colors flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-white/60 text-sm">Not connected</span>
                  )}
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
  )
}
