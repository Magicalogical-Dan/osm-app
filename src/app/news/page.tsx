'use client'

import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { 
  Newspaper, 
  TrendingUp,
  User,
  Clock
} from 'lucide-react'
import Image from 'next/image'

export default function NewsPage() {
  const { user } = useAuth()

  return (
    <AuthGuard>
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(40, 88, 200)' }}>
        {/* Background letter */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/O.png"
            alt="O"
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
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8 pt-8">
              <Newspaper className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">News</h1>
            </div>

            {/* Newsnow Integration */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Newspaper className="w-8 h-8 text-white mr-3" />
                  <h2 className="text-2xl font-bold text-white">Latest Sports News & Updates</h2>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-white/80 mb-6">
                    Stay informed with the latest sports news, player transfers, match results, and exclusive insights from the OSM team.
                  </p>
                  
                  {/* Newsnow Link */}
                  <div className="bg-white/20 rounded-lg p-6 border border-white/30 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Comprehensive Sports News</h3>
                    <p className="text-white/80 mb-4">
                      For the most comprehensive and up-to-date sports news from around the world, visit Newsnow.
                    </p>
                    <a 
                      href="https://newsnow.co.uk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                    >
                      <span>Visit Newsnow.co.uk</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Daily Updates</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Expert Analysis</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Real-time News</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
