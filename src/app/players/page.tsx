'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  UserPlus, 
  ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Player {
  id: string
  first_name: string
  last_name: string
  full_name: string
  slug: string
  club: string
  position: string
  nationality: string
  age: number
  email: string
  sport: string
  instagram_url?: string
  tiktok_url?: string
  twitter_url?: string
  created_at: string
}

export default function PlayersPage() {
  const { user } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPlayers()
    }
  }, [user])

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading players:', error)
        return
      }

      setPlayers(data || [])
    } catch (error) {
      console.error('Error loading players:', error)
    } finally {
      setLoading(false)
    }
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
    <AuthGuard>
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
          <div className="flex items-center justify-between mb-8 pt-8">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Players</h1>
            </div>
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center space-x-2 border border-white/30">
              <UserPlus className="w-4 h-4" />
              <span>Add Player</span>
            </button>
          </div>


          {/* Players Table */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Player</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Club</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Position</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Nationality</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Age</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">View Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-t border-white/20 hover:bg-white/10">
                      <td className="px-6 py-4">
                        <Link href={`/players/${player.slug}`} className="flex items-center space-x-3 hover:text-white/80">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium">{player.full_name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-white/80">{player.club}</td>
                      <td className="px-6 py-4 text-white/80">{player.position}</td>
                      <td className="px-6 py-4 text-white/80">{player.nationality}</td>
                      <td className="px-6 py-4 text-white/80">{player.age}</td>
                      <td className="px-6 py-4 text-white/80">{player.email}</td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/players/${player.slug}`}
                          className="text-white/60 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          <span>View</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {players.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No players found</h3>
              <p className="text-white/60">No players have been added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
