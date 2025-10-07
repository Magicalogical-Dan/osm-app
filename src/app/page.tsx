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
  Route
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)

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

  useEffect(() => {
    if (user) {
      loadUserRole()
    }
  }, [user, loadUserRole])

  if (!user) {
    return (
      <div className="relative">
        {/* Cycling background with colors */}
        <CyclingBackground />
        
        {/* Single large letter in background - will be handled by CyclingBackground */}
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6">
          <div className="w-full max-w-md">
            {/* OSM Logo */}
            <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-center">
              <Image
                src="/images/OSM_White.png"
                alt="OSM Logo"
                width={300}
                height={100}
                className="h-10 sm:h-12 lg:h-16 w-auto drop-shadow-lg"
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
      { name: 'News', href: '/news', icon: Newspaper, color: 'osm-blue', description: 'Stay updated with the latest sports news' },
    ]

    // Check if user is admin by role or by email (fallback)
    const isAdmin = user?.email === 'dan@magicalogical.co.uk' || userRole === 'admin'
    
    if (isAdmin) {
      return [
        { name: 'Players', href: '/players', icon: Users, color: 'osm-green', description: 'Manage player profiles and social media' },
        ...baseLinks,
      ]
    } else {
      return [
        { name: 'Social', href: '/social', icon: Users, color: 'osm-green', description: 'Manage your social media presence' },
        ...baseLinks,
        { name: 'Support', href: '/support', icon: HelpCircle, color: 'osm-red', description: 'Get help from your agent and support team' },
        { name: 'Routes', href: 'https://learner.routes-app.com', icon: Route, color: 'osm-blue', description: 'Access your learning routes and training' },
      ]
    }
  }

  return (
    <div className="relative">
      {/* Cycling background with colors */}
      <CyclingBackground />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6 lg:py-8 homepage-large-desktop-center">
        <div className="w-full max-w-6xl homepage-large-desktop-content">
          {/* Welcome Message */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 animate-fade-in drop-shadow-lg">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 animate-slide-up drop-shadow-md">
              Your sports management dashboard is ready
            </p>
          </div>

          {/* Welcome Tiles with 20% opacity background - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 max-w-6xl mx-auto">
            {getQuickLinks().map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="group bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] flex flex-col justify-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
                    <div className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
                      <link.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 lg:mb-3 group-hover:text-white/90 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-relaxed">
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
