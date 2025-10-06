const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAdminUser() {
  try {
    console.log('Checking admin user...')

    // Check if dan@magicalogical.co.uk exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'dan@magicalogical.co.uk')
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return
    }

    console.log('User found:', userData)

    if (userData.role !== 'admin') {
      console.log('Updating user role to admin...')
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('email', 'dan@magicalogical.co.uk')

      if (updateError) {
        console.error('Error updating user role:', updateError)
      } else {
        console.log('✅ User role updated to admin')
      }
    } else {
      console.log('✅ User is already admin')
    }

  } catch (error) {
    console.error('Error checking admin user:', error)
  }
}

checkAdminUser()

