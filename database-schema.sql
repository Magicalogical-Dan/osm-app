-- OSM Database Schema
-- This file contains the SQL schema for the OSM application

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

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('rugby_league', 'rugby_union', 'both')),
  league TEXT,
  club TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
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

-- News articles policies (public read access)
CREATE POLICY "Anyone can view news articles" ON news_articles
  FOR SELECT USING (true);

-- Support messages policies
CREATE POLICY "Users can view their own support messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support messages" ON support_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

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

-- Sample data for testing
INSERT INTO news_articles (title, content, sport, league, club) VALUES
('Rugby League Grand Final Preview', 'The NRL Grand Final promises to be an exciting match between the top two teams this season. Both teams have shown exceptional form throughout the playoffs.', 'rugby_league', 'NRL', 'Sydney Roosters'),
('Super Rugby Championship Updates', 'The Super Rugby season continues with several key matches this weekend. Teams are fighting for playoff positions as the season reaches its climax.', 'rugby_union', 'Super Rugby', 'Crusaders'),
('Player Transfer News', 'Several high-profile players have announced their moves to new clubs for the upcoming season. This includes both domestic and international transfers.', 'both', 'Various', 'Multiple'),
('Training Camp Updates', 'Teams across both codes are preparing for the upcoming season with intensive training camps. New coaching staff and strategies are being implemented.', 'both', 'Various', 'Multiple'),
('Injury Updates', 'Medical teams are working around the clock to get injured players back on the field. Several key players are expected to return this weekend.', 'both', 'Various', 'Multiple');

-- Note: User accounts should be created through Supabase Auth API or Dashboard
-- The following are placeholder records that will be populated when users are created through the auth system

-- Admin user record (will be created when dan@magicalogical.co.uk signs up)
INSERT INTO users (id, email, role) VALUES
('00000000-0000-0000-0000-000000000001', 'dan@magicalogical.co.uk', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Admin profile
INSERT INTO profiles (user_id, club, position, bio, sport, tooltips_enabled) VALUES
('00000000-0000-0000-0000-000000000001', 'OSM Admin', 'Administrator', 'System administrator for OSM platform', 'rugby_union', true)
ON CONFLICT DO NOTHING;

-- Test user record (will be created when test@osm.com signs up)
INSERT INTO users (id, email, role) VALUES
('00000000-0000-0000-0000-000000000002', 'test@osm.com', 'user')
ON CONFLICT (id) DO NOTHING;

-- Test profile
INSERT INTO profiles (user_id, club, position, bio, sport, tooltips_enabled) VALUES
('00000000-0000-0000-0000-000000000002', 'Test Rugby Club', 'Fullback', 'Test user profile for development', 'rugby_union', true)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
