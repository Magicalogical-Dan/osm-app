-- Add the url column to existing news_articles table
-- Run this in your Supabase SQL editor

-- Check current table structure first
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;

-- Add the url column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Add the source column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS source TEXT;

-- Add the sport column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS sport TEXT DEFAULT 'rugby_league';

-- Add the league column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS league TEXT;

-- Add the club column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS club TEXT;

-- Add the competition column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS competition TEXT;

-- Add the tags column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add the published_at column if it doesn't exist
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Check the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;
