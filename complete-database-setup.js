const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function completeDatabaseSetup() {
  try {
    console.log('🔧 OSM Database Setup')
    console.log('====================')
    
    // Check if we can connect to Supabase
    console.log('📡 Testing Supabase connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('❌ Cannot connect to Supabase:', connectionError.message)
      console.log('🔧 Please check your environment variables in .env.local')
      return
    }

    console.log('✅ Connected to Supabase successfully!')

    // Check if players table exists
    console.log('\n📋 Checking players table...')
    const { data: playersCheck, error: playersError } = await supabase
      .from('players')
      .select('*')
      .limit(1)

    if (playersError && playersError.message.includes('relation "public.players" does not exist')) {
      console.log('❌ Players table does not exist')
      console.log('\n📝 NEXT STEPS:')
      console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
      console.log('2. Select your project')
      console.log('3. Go to SQL Editor')
      console.log('4. Copy the entire content from quick-schema.sql file')
      console.log('5. Paste it into the SQL Editor')
      console.log('6. Click "Run" to execute the schema')
      console.log('7. Come back and run this script again')
      console.log('\n📄 The quick-schema.sql file contains:')
      console.log('   - Players table with all required fields')
      console.log('   - George Williams sample data')
      console.log('   - Proper RLS policies')
      console.log('   - All necessary indexes and triggers')
      return
    }

    if (playersError) {
      console.log('❌ Error checking players table:', playersError.message)
      return
    }

    console.log('✅ Players table exists!')

    // Check for George Williams
    console.log('\n👤 Checking for George Williams...')
    const { data: georgeData, error: georgeError } = await supabase
      .from('players')
      .select('*')
      .eq('slug', 'george-williams')
      .single()

    if (georgeError && georgeError.code === 'PGRST116') {
      console.log('❌ George Williams not found. Inserting...')
      
      const { data: insertData, error: insertError } = await supabase
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

      if (insertError) {
        console.log('❌ Error inserting George Williams:', insertError.message)
        return
      }

      console.log('✅ George Williams inserted successfully!')
    } else if (georgeError) {
      console.log('❌ Error checking for George Williams:', georgeError.message)
      return
    } else {
      console.log('✅ George Williams already exists!')
    }

    // Final verification
    console.log('\n🔍 Final verification...')
    const { data: allPlayers, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.log('❌ Error fetching players:', fetchError.message)
      return
    }

    console.log(`✅ Found ${allPlayers.length} players in database:`)
    allPlayers.forEach(player => {
      console.log(`   - ${player.full_name} (${player.club}, ${player.position})`)
    })

    console.log('\n🎉 Database setup complete!')
    console.log('🌐 You can now visit /players to see the players page')
    console.log('👤 George Williams profile: /players/george-williams')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

completeDatabaseSetup()

