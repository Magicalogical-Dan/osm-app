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
      <div className="relative z-10">
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 lg:pt-20 xl:pt-20 pb-16 sm:pb-20 lg:pb-24">
          {children}
        </main>
        <DynamicFooter />
      </div>
    )
  }

  // If user is logged in, show full layout with navigation and footer
  if (user) {
    return (
      <div className="relative z-10">
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 lg:pt-20 xl:pt-20 pb-16 sm:pb-20 lg:pb-24">
          {children}
        </main>
        <DynamicFooter />
      </div>
    )
  }

  // If user is not logged in, show only the content without navigation and footer
  return (
    <div className="relative z-10">
      <main>
        {children}
      </main>
    </div>
  )
}

