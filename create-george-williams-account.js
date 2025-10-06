import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createGeorgeWilliamsAccount() {
  try {
    console.log('Setting up George Williams account...')

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'george@osm-ltd.com')
      .single()

    let userId
    if (existingUser) {
      console.log('User already exists:', existingUser.id)
      userId = existingUser.id
    } else {
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'george@osm-ltd.com',
        password: 'password123',
        email_confirm: true
      })

      if (authError) {
        console.error('Error creating auth user:', authError)
        return
      }

      console.log('Auth user created:', authData.user.id)
      userId = authData.user.id

      // Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: 'george@osm-ltd.com',
          role: 'user'
        })

      if (userError) {
        console.error('Error creating user record:', userError)
        return
      }

      console.log('User record created')
    }

    // Update the existing player record to link to the user
    const { error: playerError } = await supabase
      .from('players')
      .update({ user_id: userId })
      .eq('slug', 'george-williams')

    if (playerError) {
      console.error('Error updating player record:', playerError)
      return
    }

    console.log('Player record updated with user_id')

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!existingProfile) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          club: 'Warrington',
          position: 'Scrum Half',
          sport: 'rugby_league',
          instagram_url: 'https://www.instagram.com/georgewilliamss/',
          tiktok_url: 'https://www.tiktok.com/@georgewilliams',
          twitter_url: 'https://x.com/george7williams?lang=en'
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        return
      }

      console.log('Profile created')
    } else {
      console.log('Profile already exists')
    }

    console.log('✅ George Williams account setup complete!')
    console.log('Email: george@osm-ltd.com')
    console.log('Password: password123')
    console.log('User ID:', userId)

  } catch (error) {
    console.error('Error creating George Williams account:', error)
  }
}

createGeorgeWilliamsAccount()
