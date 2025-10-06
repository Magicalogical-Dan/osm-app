'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function SimpleLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentColor, setCurrentColor] = useState(0)
  const router = useRouter()

  const colors = [
    { bg: 'rgb(40, 88, 200)', name: 'blue' },
    { bg: 'rgb(101, 165, 44)', name: 'green' },
    { bg: 'rgb(234, 54, 36)', name: 'red' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % colors.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentColorData = colors[currentColor]

  return (
    <div 
      className="backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/20 p-6 sm:p-8 transition-all duration-1000"
      style={{ 
        backgroundColor: `${currentColorData.bg}20` // 20% opacity of current color
      }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg" style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}>
        Login
      </h1>
      
      <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-400/50 text-red-100 px-3 sm:px-4 py-2 sm:py-3 rounded-xl backdrop-blur-sm text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2 drop-shadow-md" style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-lg text-base"
            style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}
            placeholder="Enter your email"
          />
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-white mb-2 drop-shadow-md" style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-lg text-base"
            style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}
            placeholder="Enter your password"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button 
            type="button"
            className="text-sm text-white/80 hover:text-white font-medium transition-colors duration-200 drop-shadow-md"
          >
            Forgot your password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
            className="w-full bg-white text-gray-900 font-bold py-3 sm:py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-base sm:text-lg"
            style={{ fontFamily: '"space-grotesk-variable", sans-serif', fontVariationSettings: '"wght" 300' }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-900 mr-2"></div>
              <span className="text-sm sm:text-base">Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  )
}
