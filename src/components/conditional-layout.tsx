'use client'

import { useAuth } from './providers'
import { Navigation } from './navigation'
import { DynamicFooter } from './dynamic-footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative z-10">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <DynamicFooter />
      </div>
    )
  }

  // If user is logged in, show full layout with navigation and footer
  if (user) {
    return (
      <div className="min-h-screen flex flex-col relative z-10">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <DynamicFooter />
      </div>
    )
  }

  // If user is not logged in, show only the content without navigation and footer
  return (
    <div className="min-h-screen relative z-10">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}

