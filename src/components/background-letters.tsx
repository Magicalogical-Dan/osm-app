'use client'

import Image from 'next/image'

export function BackgroundLetters() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* O Letter */}
      <div className="absolute top-1/4 left-1/4 opacity-5 animate-float">
        <Image
          src="/images/O.png"
          alt="O"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>
      
      {/* S Letter */}
      <div className="absolute top-1/2 right-1/4 opacity-5 animate-float" style={{ animationDelay: '2s' }}>
        <Image
          src="/images/S.png"
          alt="S"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>
      
      {/* M Letter */}
      <div className="absolute bottom-1/4 left-1/3 opacity-5 animate-float" style={{ animationDelay: '4s' }}>
        <Image
          src="/images/M.png"
          alt="M"
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </div>

      {/* Additional scattered letters for more depth */}
      <div className="absolute top-1/6 right-1/6 opacity-3 animate-float" style={{ animationDelay: '1s' }}>
        <Image
          src="/images/O.png"
          alt="O"
          width={150}
          height={150}
          className="w-20 h-20 md:w-32 md:h-32"
        />
      </div>
      
      <div className="absolute bottom-1/3 right-1/3 opacity-3 animate-float" style={{ animationDelay: '3s' }}>
        <Image
          src="/images/S.png"
          alt="S"
          width={150}
          height={150}
          className="w-20 h-20 md:w-32 md:h-32"
        />
      </div>
      
      <div className="absolute top-2/3 left-1/6 opacity-3 animate-float" style={{ animationDelay: '5s' }}>
        <Image
          src="/images/M.png"
          alt="M"
          width={150}
          height={150}
          className="w-20 h-20 md:w-32 md:h-32"
        />
      </div>

      {/* Even smaller letters for subtle texture */}
      <div className="absolute top-1/12 left-1/2 opacity-2 animate-float" style={{ animationDelay: '1.5s' }}>
        <Image
          src="/images/O.png"
          alt="O"
          width={100}
          height={100}
          className="w-12 h-12 md:w-16 md:h-16"
        />
      </div>
      
      <div className="absolute bottom-1/6 right-1/6 opacity-2 animate-float" style={{ animationDelay: '3.5s' }}>
        <Image
          src="/images/S.png"
          alt="S"
          width={100}
          height={100}
          className="w-12 h-12 md:w-16 md:h-16"
        />
      </div>
      
      <div className="absolute top-1/2 left-1/12 opacity-2 animate-float" style={{ animationDelay: '5.5s' }}>
        <Image
          src="/images/M.png"
          alt="M"
          width={100}
          height={100}
          className="w-12 h-12 md:w-16 md:h-16"
        />
      </div>
    </div>
  )
}
