-- Create messaging and team management tables for OSM app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('rugby_league', 'rugby_union')),
  league TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team memberships table (many-to-many relationship between users and teams)
CREATE TABLE IF NOT EXISTS team_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('captain', 'vice_captain', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team messages table (for team-wide communications)
CREATE TABLE IF NOT EXISTS team_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they belong to" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_memberships 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all teams" ON teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Team memberships policies
CREATE POLICY "Users can view their own memberships" ON team_memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view team memberships for teams they belong to" ON team_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_memberships tm2 
      WHERE tm2.team_id = team_memberships.team_id AND tm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all memberships" ON team_memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete messages they sent" ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- Team messages policies
CREATE POLICY "Users can view team messages for teams they belong to" ON team_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_memberships 
      WHERE team_id = team_messages.team_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send team messages to teams they belong to" ON team_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM team_memberships 
      WHERE team_id = team_messages.team_id AND user_id = auth.uid()
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

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_messages_updated_at BEFORE UPDATE ON team_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample teams
INSERT INTO teams (name, sport, league) VALUES
('Warrington Wolves', 'rugby_league', 'Super League'),
('Leeds Rhinos', 'rugby_league', 'Super League'),
('Wigan Warriors', 'rugby_league', 'Super League'),
('Leicester Tigers', 'rugby_union', 'Premiership'),
('Saracens', 'rugby_union', 'Premiership'),
('Bath Rugby', 'rugby_union', 'Premiership');

-- Insert George Williams into Warrington Wolves
INSERT INTO team_memberships (user_id, team_id, role) 
SELECT 
  u.id,
  t.id,
  'captain'
FROM users u, teams t 
WHERE u.email = 'george@osm-ltd.com' 
AND t.name = 'Warrington Wolves';
