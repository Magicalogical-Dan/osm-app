'use client'

import { useAuth } from '@/components/providers'
import { CyclingBackground } from '@/components/cycling-background'
import { SimpleLoginForm } from '@/components/simple-login-form'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  Newspaper, 
  Users, 
  HelpCircle, 
  User
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)

  useEffect(() => {
    if (user) {
      loadUserRole()
    }
  }, [user])

  const loadUserRole = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()
      
      if (data) {
        setUserRole(data.role)
      }
    } catch (error) {
      console.error('Error loading user role:', error)
    }
  }

  if (!user) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {/* Cycling background with colors */}
        <CyclingBackground />
        
        {/* Single large letter in background - will be handled by CyclingBackground */}
        
        {/* Content */}
        <div className="relative z-10 h-screen flex items-center justify-center px-4 overflow-hidden">
          <div className="w-full max-w-md">
            {/* OSM Logo */}
            <div className="mb-8 sm:mb-10 lg:mb-12 flex justify-center">
              <Image
                src="/images/OSM_White.png"
                alt="OSM Logo"
                width={300}
                height={100}
                className="h-16 sm:h-18 lg:h-20 w-auto drop-shadow-lg"
              />
            </div>
            
            {/* Login Form */}
            <SimpleLoginForm />
          </div>
        </div>
      </div>
    )
  }

  const getQuickLinks = () => {
    const baseLinks = [
      { name: 'News', href: '/news', icon: Newspaper, color: 'osm-blue', description: 'Stay updated with the latest rugby news' },
      { name: 'Support', href: '/support', icon: HelpCircle, color: 'osm-red', description: 'Get help from your agent and support team' },
      { name: 'Profile', href: '/profile', icon: User, color: 'osm-blue', description: 'Update your player profile and preferences' },
    ]

    // Check if user is admin by role or by email (fallback)
    const isAdmin = user?.email === 'dan@magicalogical.co.uk' || userRole === 'admin'
    
    if (isAdmin) {
      return [
        ...baseLinks,
        { name: 'Players', href: '/players', icon: Users, color: 'osm-green', description: 'Manage player profiles and social media' },
      ]
    } else {
      return [
        ...baseLinks,
        { name: 'Social', href: '/social', icon: Users, color: 'osm-green', description: 'Manage your social media presence' },
      ]
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Cycling background with colors */}
      <CyclingBackground />
      
      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-4xl">
          {/* Welcome Message */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in drop-shadow-lg">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 animate-slide-up drop-shadow-md">
              Your rugby management dashboard is ready
            </p>
          </div>

          {/* Welcome Tiles with 20% opacity background - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {getQuickLinks().map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="group bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] flex flex-col justify-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-center">
                    <div className="p-3 sm:p-4 lg:p-6 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
                      <link.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-white/90 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
