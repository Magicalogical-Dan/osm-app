'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function AnimatedLetters() {
  const [currentColor, setCurrentColor] = useState(0)
  
  const colors = [
    { letter: 'O', image: '/images/O.png', name: 'blue' },
    { letter: 'S', image: '/images/S.png', name: 'green' },
    { letter: 'M', image: '/images/M.png', name: 'red' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % colors.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [colors.length])

  const currentLetter = colors[currentColor]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large main animated letter in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Image
            src={currentLetter.image}
            alt={currentLetter.letter}
            width={800}
            height={800}
            className="w-96 h-96 md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] opacity-30 animate-pulse"
            style={{ filter: 'brightness(0) invert(1)' }}
            priority
          />
        </div>
      </div>

      {/* Additional scattered letters for depth */}
      <div className="absolute top-1/4 left-1/4 opacity-5 animate-float">
        <Image
          src="/images/O.png"
          alt="O"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>
      
      <div className="absolute top-1/2 right-1/4 opacity-5 animate-float" style={{ animationDelay: '2s' }}>
        <Image
          src="/images/S.png"
          alt="S"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>
      
      <div className="absolute bottom-1/4 left-1/3 opacity-5 animate-float" style={{ animationDelay: '4s' }}>
        <Image
          src="/images/M.png"
          alt="M"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>
    </div>
  )
}
