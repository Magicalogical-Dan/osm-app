-- Check what columns actually exist in your news_articles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;
