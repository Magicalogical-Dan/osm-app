'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useColor } from './color-context'
import { useAuth } from './providers'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { 
  Newspaper, 
  Users, 
  HelpCircle,
  Route
} from 'lucide-react'

export function DynamicFooter() {
  const { currentColor } = useColor()
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

  const getBottomNavItems = () => {
    const baseItems = [
      { name: 'News', href: '/news', icon: Newspaper },
    ]

    // Check if user is admin by role or by email (fallback)
    const isAdmin = user?.email === 'dan@magicalogical.co.uk' || userRole === 'admin'
    
    if (isAdmin) {
      return [
        { name: 'Players', href: '/players', icon: Users },
        ...baseItems,
        { name: 'Routes', href: 'https://learner.routes-app.com', icon: Route },
      ]
    } else {
      return [
        { name: 'Social', href: '/social', icon: Users },
        ...baseItems,
        { name: 'Support', href: '/support', icon: HelpCircle },
        { name: 'Routes', href: 'https://learner.routes-app.com', icon: Route },
      ]
    }
  }
  
  // Determine if we should use white or dark text based on background color
  const isWhiteBackground = currentColor === 'rgb(255, 255, 255)'
  const textColor = isWhiteBackground ? 'text-gray-900' : 'text-white'
  const borderColor = isWhiteBackground ? 'border-gray-300' : 'border-white'
  const logoSrc = isWhiteBackground ? '/images/OSM_Black.png' : '/images/OSM_White.png'

  return (
    <footer className={`border-t-4 ${borderColor} py-8 relative z-50 transition-colors duration-1000`} style={{ backgroundColor: currentColor }}>
      <div className="container mx-auto px-4">
        {/* Navigation Icons - Spaced across full width */}
        <div className="flex items-center justify-between w-full">
          {getBottomNavItems().map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-2 ${textColor} hover:opacity-80 transition-colors group`}
            >
              <item.icon size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">{item.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Logo and Copyright - Absolute bottom right */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
          <Image
            src={logoSrc}
            alt="OSM Logo"
            width={120}
            height={40}
            className="h-6 w-auto"
          />
          <p className={`${textColor}/80 text-sm`}>&copy; 2025 OSM Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
