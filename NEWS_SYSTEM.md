# Rugby League News System

This system automatically scrapes rugby league news from multiple sources and provides a filtered news feed for users.

## Features

- **Automated Scraping**: Scrapes news from 6 major rugby league sources
- **Smart Tagging**: Automatically tags articles with teams, leagues, and topics
- **Filtering**: Users can filter by league, club, source, and search terms
- **Scheduled Updates**: Runs every hour to keep content fresh
- **Article Management**: Keeps only the latest 100 articles to manage storage

## Sources

The system scrapes from these websites:
- BBC Sport Rugby League
- Sky Sports Rugby League  
- NRL.com
- Rugby League.com
- TotalRL
- All Out Rugby League

## Database Schema

### Tables Added
- `news_articles`: Stores scraped articles with metadata
- `news_tags`: Predefined tags for filtering
- `article_tags`: Junction table for article-tag relationships
- `scraping_logs`: Tracks scraping performance

### Article Fields
- `title`, `content`, `excerpt`: Article content
- `url`, `source`: Article source information
- `league`, `club`, `competition`: Categorized metadata
- `tags`: Array of relevant tags
- `image_url`: Article image if available
- `published_at`: Original publication date
- `scraped_at`: When article was scraped

## Usage

### Manual Scraping
```bash
npm run scrape-news
```

### Scheduled Scraping
```bash
npm run scraper
```

### API Endpoints

#### Get Articles
```
GET /api/news?league=NRL&club=Wigan Warriors&source=BBC Sport&search=grand final
```

Parameters:
- `league`: Filter by league (NRL, Super League, Championship, etc.)
- `club`: Filter by specific club
- `competition`: Filter by competition type
- `source`: Filter by news source
- `tag`: Filter by specific tag
- `search`: Full-text search
- `page`: Pagination (default: 1)
- `limit`: Articles per page (default: 20)

#### Get Tags
```
GET /api/news/tags
```

#### Trigger Scraping
```
POST /api/news/scrape
```

## Tagging System

### Automatic Tagging
The system automatically extracts tags from article titles and content:

**Teams**: Wigan Warriors, St Helens, Leeds Rhinos, etc.
**Leagues**: NRL, Super League, Championship, Women's Super League
**Competitions**: Grand Final, Challenge Cup, State of Origin, World Cup
**Topics**: Transfer News, Injury Updates, Match Reports, Player Interviews

### Tag Categories
- `league`: Competition leagues
- `club`: Team names
- `competition`: Tournaments and finals
- `topic`: Article topics and themes

## Filtering

Users can filter articles by:
- **League**: NRL, Super League, Championship, Women's Super League
- **Source**: BBC Sport, Sky Sports, NRL.com, etc.
- **Search**: Full-text search across titles and content
- **Tags**: Click on tags to filter by specific topics

## Scheduled Scraping

The system runs automatically every hour to:
1. Scrape all configured sources
2. Extract and tag new articles
3. Save to database (avoiding duplicates)
4. Clean up old articles (keep last 100)
5. Log scraping results

## Error Handling

- Failed scrapes are logged with error details
- Partial successes are tracked
- System continues running even if some sources fail
- Duplicate articles are automatically handled

## Performance

- Articles are ordered by publication date (newest first)
- Pagination prevents large data loads
- Images are lazy-loaded
- Database queries are optimized with proper indexing

## Monitoring

Check scraping logs in the database:
```sql
SELECT * FROM scraping_logs ORDER BY started_at DESC LIMIT 10;
```

View article counts by source:
```sql
SELECT source, COUNT(*) as article_count 
FROM news_articles 
GROUP BY source 
ORDER BY article_count DESC;
```
