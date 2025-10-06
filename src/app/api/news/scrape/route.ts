import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Scrapers for different news sources
const scrapers = {
  'BBC Sport': {
    url: 'https://www.bbc.com/sport/rugby-league',
    selector: '.gs-c-promo',
    titleSelector: '.gs-c-promo-heading__title',
    linkSelector: 'a',
    contentSelector: '.gs-c-promo-summary'
  },
  'Sky Sports': {
    url: 'https://www.skysports.com/rugby-league',
    selector: '.sdc-site-tile__headline',
    titleSelector: 'a',
    linkSelector: 'a',
    contentSelector: '.sdc-site-tile__summary'
  },
  'NRL.com': {
    url: 'https://www.nrl.com/news/',
    selector: '.feature-card',
    titleSelector: '.feature-card__title',
    linkSelector: 'a',
    contentSelector: '.feature-card__excerpt'
  },
  'Rugby League.com': {
    url: 'https://www.rugbyleague.com/news/',
    selector: '.news-item',
    titleSelector: '.news-item__title',
    linkSelector: 'a',
    contentSelector: '.news-item__excerpt'
  },
  'TotalRL': {
    url: 'https://www.totalrl.com/news/',
    selector: '.post',
    titleSelector: '.post-title',
    linkSelector: 'a',
    contentSelector: '.post-excerpt'
  },
  'All Out Rugby League': {
    url: 'https://www.alloutrugbyleague.com/news/',
    selector: '.article',
    titleSelector: '.article-title',
    linkSelector: 'a',
    contentSelector: '.article-excerpt'
  }
}

interface ScraperConfig {
  url: string;
  selector: string;
  titleSelector: string;
  linkSelector: string;
  contentSelector: string;
}

async function scrapeSource(sourceName: string, config: ScraperConfig) {
  const errors: string[] = []
  let articlesScraped = 0
  
  try {
    // Note: This is a simplified scraper. In production, you'd want to use a proper scraping library
    // like Puppeteer, Playwright, or Cheerio with proper error handling and rate limiting
    
    const response = await fetch(config.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Simple regex-based extraction (in production, use proper HTML parsing)
    const articleMatches = html.match(/<article[^>]*>[\s\S]*?<\/article>/g) || []
    
    for (const articleHtml of articleMatches.slice(0, 10)) { // Limit to 10 articles per source
      try {
        // Extract title
        const titleMatch = articleHtml.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i)
        const title = titleMatch ? titleMatch[1].trim() : null
        
        // Extract link
        const linkMatch = articleHtml.match(/<a[^>]+href="([^"]+)"/i)
        const url = linkMatch ? new URL(linkMatch[1], config.url).href : null
        
        // Extract content/excerpt
        const contentMatch = articleHtml.match(/<p[^>]*>([^<]+)<\/p>/i)
        const content = contentMatch ? contentMatch[1].trim() : null
        
        if (title && url && content) {
          // Extract tags from title and content
          const tags = extractTags(title + ' ' + content)
          
          // Determine league and club from content
          const league = extractLeague(title + ' ' + content)
          const club = extractClub(title + ' ' + content)
          
          // Check if article already exists
          const { data: existing } = await supabase
            .from('news_articles')
            .select('id')
            .eq('url', url)
            .eq('source', sourceName)
            .single()
          
          if (!existing) {
            // Insert new article
            const { error } = await supabase
              .from('news_articles')
              .insert({
                title,
                content,
                excerpt: content.substring(0, 200),
                url,
                source: sourceName,
                league,
                club,
                tags,
                published_at: new Date().toISOString()
              })
            
            if (!error) {
              articlesScraped++
            } else {
              errors.push(`Failed to insert article: ${error.message}`)
            }
          }
        }
      } catch (articleError) {
        errors.push(`Error processing article: ${articleError}`)
      }
    }
    
    return {
      status: articlesScraped > 0 ? 'success' : 'error',
      articlesScraped,
      errors
    }
  } catch (error) {
    return {
      status: 'error',
      articlesScraped: 0,
      errors: [`Scraping failed: ${error}`]
    }
  }
}

function extractTags(text: string): string[] {
  const tags: string[] = []
  const lowerText = text.toLowerCase()
  
  // League tags
  if (lowerText.includes('nrl')) tags.push('NRL')
  if (lowerText.includes('super league')) tags.push('Super League')
  if (lowerText.includes('championship')) tags.push('Championship')
  if (lowerText.includes('women\'s super league')) tags.push('Women\'s Super League')
  
  // Club tags
  const clubs = [
    'Wigan Warriors', 'St Helens', 'Leeds Rhinos', 'Warrington Wolves',
    'Hull FC', 'Hull KR', 'Catalans Dragons', 'Salford Red Devils',
    'Wakefield Trinity', 'Castleford Tigers', 'Huddersfield Giants',
    'Brisbane Broncos', 'Sydney Roosters', 'Melbourne Storm', 'Penrith Panthers'
  ]
  
  clubs.forEach(club => {
    if (lowerText.includes(club.toLowerCase())) {
      tags.push(club)
    }
  })
  
  // Competition tags
  if (lowerText.includes('grand final')) tags.push('Grand Final')
  if (lowerText.includes('challenge cup')) tags.push('Challenge Cup')
  if (lowerText.includes('state of origin')) tags.push('State of Origin')
  if (lowerText.includes('world cup')) tags.push('World Cup')
  
  // Topic tags
  if (lowerText.includes('transfer')) tags.push('Transfer News')
  if (lowerText.includes('injury')) tags.push('Injury Updates')
  if (lowerText.includes('match report')) tags.push('Match Reports')
  if (lowerText.includes('interview')) tags.push('Player Interviews')
  
  return tags
}

function extractLeague(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('nrl')) return 'NRL'
  if (lowerText.includes('super league')) return 'Super League'
  if (lowerText.includes('championship')) return 'Championship'
  if (lowerText.includes('women\'s super league')) return 'Women\'s Super League'
  
  return null
}

function extractClub(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  const clubs = [
    'Wigan Warriors', 'St Helens', 'Leeds Rhinos', 'Warrington Wolves',
    'Hull FC', 'Hull KR', 'Catalans Dragons', 'Salford Red Devils',
    'Wakefield Trinity', 'Castleford Tigers', 'Huddersfield Giants',
    'Brisbane Broncos', 'Sydney Roosters', 'Melbourne Storm', 'Penrith Panthers'
  ]
  
  for (const club of clubs) {
    if (lowerText.includes(club.toLowerCase())) {
      return club
    }
  }
  
  return null
}

export async function POST() {
  try {
    const results = []
    
    // Scrape all sources
    for (const [sourceName, config] of Object.entries(scrapers)) {
      const result = await scrapeSource(sourceName, config)
      
      // Log the scraping attempt
      await supabase
        .from('scraping_logs')
        .insert({
          source: sourceName,
          status: result.status,
          articles_scraped: result.articlesScraped,
          errors: result.errors
        })
      
      results.push({
        source: sourceName,
        ...result
      })
    }
    
    const totalArticles = results.reduce((sum, result) => sum + result.articlesScraped, 0)
    
    return NextResponse.json({
      success: true,
      message: `Scraping completed. ${totalArticles} new articles scraped.`,
      results
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed', details: error },
      { status: 500 }
    )
  }
}

