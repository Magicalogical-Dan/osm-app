'use client'

import { CyclingBackground } from '@/components/cycling-background'
import { AnimatedLetters } from '@/components/animated-letters'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cycling background with colors */}
      <CyclingBackground />
      
      {/* Animated OSM letters */}
      <AnimatedLetters />
      
      {/* Login form */}
      <LoginForm />
    </div>
  )
}
