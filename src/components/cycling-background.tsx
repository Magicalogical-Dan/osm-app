'use client'

import Image from 'next/image'
import { useColor } from './color-context'

export function CyclingBackground() {
  const { currentColorIndex } = useColor()
  
  const colors = [
    { bg: 'rgb(40, 88, 200)', image: '/images/O.png', name: 'blue' },
    { bg: 'rgb(101, 165, 44)', image: '/images/S.png', name: 'green' },
    { bg: 'rgb(234, 54, 36)', image: '/images/M.png', name: 'red' }
  ]

  const currentColorData = colors[currentColorIndex]

  return (
    <div 
      className="fixed inset-0 transition-all duration-1000 ease-in-out"
      style={{ backgroundColor: currentColorData.bg }}
    >
      {/* Huge OSM letter image - much larger than viewport */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src={currentColorData.image}
          alt={currentColorData.name}
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
    </div>
  )
}
