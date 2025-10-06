-- Create the news_articles table first
-- Run this script in your Supabase SQL editor

-- First, let's check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%news%';

-- Create the news_articles table if it doesn't exist
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

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read access (drop first if exists)
DROP POLICY IF EXISTS "Anyone can view news articles" ON news_articles;
CREATE POLICY "Anyone can view news articles" ON news_articles
FOR SELECT USING (true);

-- Check the table structure after creation
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;
