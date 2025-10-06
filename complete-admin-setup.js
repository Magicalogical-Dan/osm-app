#!/usr/bin/env node

/**
 * Script to complete admin account setup
 * This will add the existing auth user to the users table and create the profile
 * 
 * Usage: node complete-admin-setup.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function completeAdminSetup() {
  const email = 'dan@magicalogical.co.uk'
  const userId = '73039254-1858-462c-80ff-56aac1de20e1' // The user ID from your first attempt

  try {
    console.log('Completing admin account setup...')
    console.log('   Email:', email)
    console.log('   User ID:', userId)
    
    // Add user to users table with admin role
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        role: 'admin'
      })

    if (userError) {
      console.error('Error updating users table:', userError.message)
      return
    }

    console.log('User record updated with admin role')

    // Create admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        club: 'OSM Admin',
        position: 'Administrator',
        bio: 'System administrator for OSM platform',
        sport: 'rugby_union',
        tooltips_enabled: true
      })

    if (profileError) {
      console.error('Error creating profile:', profileError.message)
      return
    }

    console.log('Admin profile created successfully')

    console.log('')
    console.log('Admin account setup completed!')
    console.log('')
    console.log('Login credentials:')
    console.log('   Email: dan@magicalogical.co.uk')
    console.log('   Password: admin123')
    console.log('   Role: admin')
    console.log('')
    console.log('You can now sign in to the OSM platform!')

  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

// Run the script
completeAdminSetup()
