-- Quick OSM Database Schema Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club TEXT,
  position TEXT,
  bio TEXT,
  sport TEXT CHECK (sport IN ('rugby_league', 'rugby_union')),
  instagram_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  tooltips_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table for admin view
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

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  sport TEXT NOT NULL DEFAULT 'rugby_league' CHECK (sport IN ('rugby_league', 'rugby_union', 'both')),
  league TEXT,
  club TEXT,
  competition TEXT,
  tags TEXT[],
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(url, source)
);

-- News tags table for better filtering
CREATE TABLE IF NOT EXISTS news_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('league', 'club', 'competition', 'topic')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Scraping logs table
CREATE TABLE IF NOT EXISTS scraping_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  articles_scraped INTEGER DEFAULT 0,
  errors TEXT[],
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Players policies
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

-- News articles policies (public read access)
CREATE POLICY "Anyone can view news articles" ON news_articles
  FOR SELECT USING (true);

-- News tags policies (public read access)
CREATE POLICY "Anyone can view news tags" ON news_tags
  FOR SELECT USING (true);

-- Article tags policies (public read access)
CREATE POLICY "Anyone can view article tags" ON article_tags
  FOR SELECT USING (true);

-- Scraping logs policies (admin only)
CREATE POLICY "Admins can view scraping logs" ON scraping_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Support messages policies
CREATE POLICY "Users can view their own support messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support messages" ON support_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_messages_updated_at BEFORE UPDATE ON support_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sample tags for rugby league
INSERT INTO news_tags (name, category) VALUES
('NRL', 'league'),
('Super League', 'league'),
('Championship', 'league'),
('Women''s Super League', 'league'),
('International', 'competition'),
('State of Origin', 'competition'),
('Challenge Cup', 'competition'),
('World Cup', 'competition'),
('Wigan Warriors', 'club'),
('St Helens', 'club'),
('Leeds Rhinos', 'club'),
('Hull KR', 'club'),
('Hull FC', 'club'),
('Warrington Wolves', 'club'),
('Catalans Dragons', 'club'),
('Leigh Leopards', 'club'),
('Sydney Roosters', 'club'),
('Melbourne Storm', 'club'),
('Brisbane Broncos', 'club'),
('Penrith Panthers', 'club'),
('Transfer News', 'topic'),
('Injury Updates', 'topic'),
('Match Reports', 'topic'),
('Player Interviews', 'topic'),
('Coaching Changes', 'topic');

-- Sample rugby league articles
INSERT INTO news_articles (title, content, excerpt, url, source, sport, league, club, competition, tags, published_at) VALUES
('Wigan Warriors Win Grand Final', 'Wigan Warriors secured their 14th Grand Final victory with a dominant performance against St Helens. The match showcased exceptional skill and determination from both teams.', 'Wigan Warriors clinch their 14th Grand Final title with a commanding victory over St Helens in a thrilling encounter.', 'https://example.com/wigan-grand-final', 'BBC Sport', 'rugby_league', 'Super League', 'Wigan Warriors', 'Grand Final', ARRAY['Wigan Warriors', 'St Helens', 'Grand Final', 'Super League'], NOW() - INTERVAL '2 hours'),
('NRL Grand Final Preview', 'The NRL Grand Final promises to be an exciting match between the top two teams this season. Both teams have shown exceptional form throughout the playoffs.', 'A comprehensive preview of the upcoming NRL Grand Final with analysis of both teams'' strengths and key players to watch.', 'https://example.com/nrl-grand-final', 'NRL.com', 'rugby_league', 'NRL', 'Multiple', 'Grand Final', ARRAY['NRL', 'Grand Final', 'Preview'], NOW() - INTERVAL '4 hours'),
('Leigh Leopards Sign New Hooker', 'Leigh Leopards have announced the signing of a new hooker to strengthen their squad for the upcoming season. The player brings valuable experience from the Championship.', 'Leigh Leopards bolster their squad with the acquisition of a new hooker ahead of the new season.', 'https://example.com/leigh-signing', 'TotalRL', 'rugby_league', 'Super League', 'Leigh Leopards', 'Transfer', ARRAY['Leigh Leopards', 'Transfer News', 'Super League'], NOW() - INTERVAL '6 hours'),
('Hull KR Reach Grand Final', 'Hull KR secured their place in the Grand Final with a hard-fought victory over St Helens. The match was a showcase of determination and skill.', 'Hull KR book their place in the Grand Final after defeating St Helens in a closely contested semi-final.', 'https://example.com/hull-kr-final', 'Sky Sports', 'rugby_league', 'Super League', 'Hull KR', 'Semi-Final', ARRAY['Hull KR', 'St Helens', 'Semi-Final', 'Super League'], NOW() - INTERVAL '1 day'),
('Women''s Super League Updates', 'The Women''s Super League continues to grow in popularity with record attendance figures and increased media coverage. Several clubs are investing heavily in their women''s programs.', 'The Women''s Super League sees continued growth with record attendances and increased investment from clubs.', 'https://example.com/womens-super-league', 'Rugby League.com', 'rugby_league', 'Women''s Super League', 'Multiple', 'League', ARRAY['Women''s Super League', 'Growth', 'Investment'], NOW() - INTERVAL '2 days');

-- Instagram data table for demo accounts
CREATE TABLE instagram_data (
  id TEXT PRIMARY KEY DEFAULT 'demo_data',
  liam_data JSONB,
  george_data JSONB,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample player data
INSERT INTO players (first_name, last_name, slug, club, position, nationality, age, email, sport, instagram_url, tiktok_url, twitter_url) VALUES
('George', 'Williams', 'george-williams', 'Warrington', 'Stand Off', 'English', 30, 'george@osm-ltd.com', 'rugby_league', 'https://www.instagram.com/georgewilliamss/', 'https://www.tiktok.com/@georgewilliams', 'https://x.com/george7williams?lang=en');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
