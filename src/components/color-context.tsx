'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface ColorContextType {
  currentColor: string
  currentColorIndex: number
  isCycling: boolean
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

const colors = [
  'rgb(40, 88, 200)',   // Blue
  'rgb(101, 165, 44)',  // Green  
  'rgb(234, 54, 36)'    // Red
]

// Page-specific colors
const pageColors: Record<string, string> = {
  '/': 'cycling', // Homepage cycles
  '/news': 'rgb(40, 88, 200)', // Blue
  '/social': 'rgb(101, 165, 44)', // Green
  '/players': 'rgb(101, 165, 44)', // Green
  '/support': 'rgb(234, 54, 36)', // Red
  '/settings': 'rgb(0, 0, 0)', // Black
  '/profile': 'rgb(0, 0, 0)', // Black
}

// Helper function to check if a path starts with a specific route
const getPageColor = (pathname: string) => {
  // Check for exact matches first
  if (pageColors[pathname]) {
    return pageColors[pathname]
  }
  
  // Check for dynamic routes (e.g., /players/[slug])
  if (pathname.startsWith('/players/')) {
    return 'rgb(101, 165, 44)' // Green for individual player pages
  }
  
  return colors[0] // Default to blue if page not found
}

export function ColorProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  
  // Check if current page should cycle colors
  const isCycling = pageColors[pathname] === 'cycling'
  
  // Get the appropriate color for the current page
  const getCurrentPageColor = () => {
    const pageColor = getPageColor(pathname)
    if (pageColor === 'cycling') {
      return colors[currentColorIndex]
    }
    return pageColor
  }
  
  const currentColor = getCurrentPageColor()

  useEffect(() => {
    if (isCycling) {
      const interval = setInterval(() => {
        setCurrentColorIndex((prev) => (prev + 1) % colors.length)
      }, 5000) // Change every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isCycling])

  return (
    <ColorContext.Provider value={{ currentColor, currentColorIndex, isCycling }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor() {
  const context = useContext(ColorContext)
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider')
  }
  return context
}
