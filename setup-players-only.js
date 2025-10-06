const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupPlayersOnly() {
  try {
    console.log('🔧 Setting up Players Table Only')
    console.log('================================')
    
    // Check if players table exists
    console.log('📋 Checking if players table exists...')
    const { data: playersCheck, error: playersError } = await supabase
      .from('players')
      .select('*')
      .limit(1)

    if (playersError && playersError.message.includes('relation "public.players" does not exist')) {
      console.log('❌ Players table does not exist')
      console.log('\n📝 You need to run this SQL in your Supabase SQL Editor:')
      console.log('=======================================================')
      console.log(`
-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  slug TEXT UNIQUE NOT NULL,
  club TEXT,
  position TEXT,
  nationality TEXT,
  age INTEGER,
  email TEXT,
  bio TEXT,
  sport TEXT CHECK (sport IN ('rugby_league', 'rugby_union')),
  instagram_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Players policies (admin only access)
CREATE POLICY "Admins can view all players" ON players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert players" ON players
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update players" ON players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete players" ON players
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for players updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert George Williams
INSERT INTO players (first_name, last_name, slug, club, position, nationality, age, email, sport, instagram_url, tiktok_url, twitter_url) VALUES
('George', 'Williams', 'george-williams', 'Warrington', 'Stand Off', 'English', 30, 'george@osm-ltd.com', 'rugby_league', 'https://www.instagram.com/georgewilliamss/', 'https://www.tiktok.com/@georgewilliams', 'https://x.com/george7williams?lang=en');
      `)
      console.log('\n📋 Instructions:')
      console.log('1. Copy the SQL above')
      console.log('2. Go to Supabase Dashboard > SQL Editor')
      console.log('3. Paste and run the SQL')
      console.log('4. Run this script again')
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

    console.log('\n🎉 Players setup complete!')
    console.log('🌐 You can now visit /players to see the players page')
    console.log('👤 George Williams profile: /players/george-williams')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

setupPlayersOnly()

