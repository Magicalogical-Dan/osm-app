import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupPlayersTable() {
  try {
    console.log('Setting up players table...')

    // Create players table
    const { error: tableError } = await supabase
      .from('players')
      .select('*')
      .limit(1)

    if (tableError && tableError.message.includes('relation "public.players" does not exist')) {
      console.log('Players table does not exist. Please run the database schema first.')
      console.log('You can copy the quick-schema.sql content and run it in your Supabase SQL Editor.')
      return
    }

    console.log('Players table exists, checking for George Williams...')

    // Check if George Williams already exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('slug', 'george-williams')
      .single()

    if (existingPlayer) {
      console.log('George Williams already exists in players table')
      console.log('Player data:', existingPlayer)
    } else {
      console.log('George Williams not found in players table')
      console.log('Please run the quick-schema.sql in your Supabase SQL Editor first')
    }

  } catch (error) {
    console.error('Error setting up players table:', error)
  }
}

setupPlayersTable()
