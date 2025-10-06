#!/usr/bin/env node

/**
 * Script to create test user account for OSM
 * Run this script to create a test user account: test@osm.com
 * 
 * Usage: node create-test-user.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('Make sure your .env.local file contains these variables.')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  const email = 'test@osm.com'
  const password = 'password123'
  const userId = '00000000-0000-0000-0000-000000000002'

  try {
    console.log('Creating test user account...')
    
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'user'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError.message)
      return
    }

    console.log('Auth user created successfully')
    console.log('   User ID:', authData.user.id)
    console.log('   Email:', authData.user.email)

    // Update the users table with user role
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: email,
        role: 'user'
      })

    if (userError) {
      console.error('Error updating users table:', userError.message)
      return
    }

    console.log('User record updated with user role')

    // Create test profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        club: 'Test Rugby Club',
        position: 'Fullback',
        bio: 'Test user profile for development',
        sport: 'rugby_union',
        tooltips_enabled: true
      })

    if (profileError) {
      console.error('Error creating profile:', profileError.message)
      return
    }

    console.log('Test profile created successfully')

    console.log('')
    console.log('Test user account created successfully!')
    console.log('')
    console.log('Login credentials:')
    console.log('   Email: test@osm.com')
    console.log('   Password: password123')
    console.log('   Role: user')
    console.log('')
    console.log('You can now sign in to test the OSM platform.')

  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

// Run the script
createTestUser()
