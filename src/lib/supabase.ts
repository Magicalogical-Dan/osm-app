import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client for use in components
export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  club?: string
  position?: string
  bio?: string
  sport?: 'football' | 'basketball' | 'tennis' | 'athletics'
  instagram_url?: string
  tiktok_url?: string
  twitter_url?: string
  tooltips_enabled: boolean
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt?: string
  url: string
  source: string
  sport: 'football' | 'basketball' | 'tennis' | 'athletics' | 'all'
  league?: string
  club?: string
  competition?: string
  tags?: string[]
  image_url?: string
  published_at: string
  scraped_at: string
  created_at: string
}

export interface SupportMessage {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  updated_at: string
}
