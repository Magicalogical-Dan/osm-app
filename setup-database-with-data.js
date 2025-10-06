const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabaseWithData() {
  try {
    console.log('Setting up database with George Williams data...')

    // First, let's check if the players table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('players')
      .select('*')
      .limit(1)

    if (tableError && tableError.message.includes('relation "public.players" does not exist')) {
      console.log('❌ Players table does not exist.')
      console.log('📋 Please run the following steps:')
      console.log('1. Go to your Supabase Dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and paste the content from quick-schema.sql')
      console.log('4. Run the SQL script')
      console.log('5. Then run this script again')
      return
    }

    console.log('✅ Players table exists')

    // Check if George Williams already exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('slug', 'george-williams')
      .single()

    if (existingPlayer) {
      console.log('✅ George Williams already exists in players table')
      console.log('Player data:', {
        name: existingPlayer.full_name,
        email: existingPlayer.email,
        age: existingPlayer.age,
        nationality: existingPlayer.nationality,
        club: existingPlayer.club,
        position: existingPlayer.position
      })
    } else {
      console.log('❌ George Williams not found. Inserting...')
      
      // Insert George Williams
      const { data, error } = await supabase
        .from('players')
        .insert({
          first_name: 'George',
          last_name: 'Williams',
          slug: 'george-williams',
          club: 'Warrington',
          position: 'Stand Off',
          nationality: 'English',
          age: 30,
          email: 'george@osm-ltd.com',
          sport: 'rugby_league',
          instagram_url: 'https://www.instagram.com/georgewilliamss/',
          tiktok_url: 'https://www.tiktok.com/@georgewilliams',
          twitter_url: 'https://x.com/george7williams?lang=en'
        })
        .select()

      if (error) {
        console.error('❌ Error inserting George Williams:', error)
        return
      }

      console.log('✅ George Williams inserted successfully!')
      console.log('Player data:', data[0])
    }

    // Test the players page data
    const { data: allPlayers, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('❌ Error fetching players:', fetchError)
      return
    }

    console.log(`✅ Found ${allPlayers.length} players in database:`)
    allPlayers.forEach(player => {
      console.log(`  - ${player.full_name} (${player.club}, ${player.position})`)
    })

  } catch (error) {
    console.error('❌ Error setting up database:', error)
  }
}

setupDatabaseWithData()

