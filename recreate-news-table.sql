-- Drop and recreate news_articles table with correct structure
-- Run this in your Supabase SQL editor

-- Drop the existing table (this will delete all data)
DROP TABLE IF EXISTS news_articles CASCADE;

-- Create the news_articles table with all correct columns
CREATE TABLE news_articles (
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

-- Create policy for public read access
CREATE POLICY "Anyone can view news articles" ON news_articles
FOR SELECT USING (true);

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;

-- Show that the table is ready for data
SELECT 'Table created successfully with url column!' as status;
