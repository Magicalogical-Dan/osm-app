'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from './providers'
import { useColor } from './color-context'
import { supabase } from '@/lib/supabase'
import { 
  User, 
  Settings,
  Menu,
  X,
  LogOut,
  Users
} from 'lucide-react'

export function Navigation() {
  const { user, loading, signOut } = useAuth()
  const { currentColor } = useColor()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const loadUserRole = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setRoleLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setUserRole(data.role)
      }
    } catch {
      console.error('Error loading user role')
    } finally {
      setRoleLoading(false)
    }
  }, [user?.id])

  // Load user role when user changes
  useEffect(() => {
    if (user) {
      loadUserRole()
    } else {
      setUserRole(null)
      setRoleLoading(false)
    }
  }, [user, loadUserRole])

  // Scroll behavior for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        // Always show header at the top
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsHeaderVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Settings', href: '/settings', icon: Settings },
    ]

    // Check if user is admin by role or by email (fallback)
    // For now, prioritize email check to ensure admin users get correct menu
    const isAdmin = user?.email === 'dan@magicalogical.co.uk' || userRole === 'admin'
    
    if (isAdmin) {
      return [
        { name: 'Players', href: '/players', icon: Users },
        ...baseItems,
      ]
    } else {
      return [
        { name: 'Profile', href: '/profile', icon: User },
        ...baseItems,
      ]
    }
  }
  
  // Determine if we should use white or dark text based on background color
  const isWhiteBackground = currentColor === 'rgb(255, 255, 255)'
  const textColor = isWhiteBackground ? 'text-gray-900' : 'text-white'
  const borderColor = isWhiteBackground ? 'border-gray-300' : 'border-white'

  if (loading) {
    return (
      <>
        {/* Solid Header */}
        <nav className={`border-b-4 ${borderColor} absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ backgroundColor: currentColor }}>
          <div className="container mx-auto px-4 py-1.5 sm:py-2 lg:py-3">
            <div className="flex items-center justify-between">
              <div className={`text-lg sm:text-xl font-bold ${textColor}`}>OSM</div>
              <div className={`animate-pulse ${isWhiteBackground ? 'bg-gray-300' : 'bg-white/20'} h-5 w-5 sm:h-6 sm:w-6 rounded`}></div>
            </div>
          </div>
        </nav>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      {/* Solid Header */}
      <nav className={`border-b-4 ${borderColor} absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ backgroundColor: currentColor }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-1.5 sm:py-2 lg:py-3">
            <Link href="/" className={`flex items-center space-x-2 ${textColor}`}>
              <Image
                src="/images/OSM_White.png"
                alt="OSM Logo"
                width={120}
                height={40}
                className="h-4 sm:h-5 lg:h-6 w-auto"
              />
            </Link>

            {/* Burger Menu Button */}
            <button
              className={`${textColor} hover:opacity-80 transition-colors relative p-2 -m-2 touch-manipulation`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={3} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" /> : <Menu size={20} strokeWidth={3} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />}
            </button>
          </div>

          {/* Burger Menu Dropdown */}
          {mobileMenuOpen && (
            <div className={`absolute top-full right-0 left-0 sm:left-auto sm:min-w-[200px] ${isWhiteBackground ? 'bg-gray-100 border-gray-300' : 'bg-white border-white/20'} rounded-lg shadow-xl border py-4 mx-4 sm:mx-0`}>
              <div className="flex flex-col space-y-1">
                {roleLoading ? (
                  <div className={`px-4 py-3 text-center ${isWhiteBackground ? 'text-gray-600' : 'text-gray-600'}`}>
                    <div className="animate-pulse">Loading...</div>
                  </div>
                ) : (
                  getMenuItems().map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 ${isWhiteBackground ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-osm-blue'} transition-colors px-4 py-3 hover:bg-white/50 touch-manipulation`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span className="text-base">{item.name}</span>
                    </Link>
                  ))
                )}
                <div className={`border-t ${isWhiteBackground ? 'border-gray-200' : 'border-gray-200'} my-2`}></div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center space-x-3 ${isWhiteBackground ? 'text-gray-700 hover:text-red-600' : 'text-gray-700 hover:text-osm-red'} transition-colors px-4 py-3 hover:bg-white/50 touch-manipulation`}
                >
                  <LogOut size={20} />
                  <span className="text-base">Sign Out</span>
                </button>
                
                {/* Logo and Copyright */}
                <div className={`border-t ${isWhiteBackground ? 'border-gray-200' : 'border-gray-200'} my-2`}></div>
                <div className="px-4 py-3 text-center">
                  <Image
                    src={isWhiteBackground ? '/images/OSM_Black.png' : '/images/OSM_White.png'}
                    alt="OSM Logo"
                    width={80}
                    height={26}
                    className="h-5 w-auto mx-auto mb-2"
                  />
                  <p className={`${isWhiteBackground ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                    &copy; 2025 OSM Ltd. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

    </>
  )
}
