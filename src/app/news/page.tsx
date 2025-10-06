'use client'

import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  url: string
  source: string
  league?: string
  club?: string
  competition?: string
  tags?: string[]
  image_url?: string
  published_at: string
  created_at: string
}

interface NewsTag {
  id: string
  name: string
  category: string
}

export default function NewsPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [tags, setTags] = useState<NewsTag[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    league: '',
    club: '',
    competition: '',
    source: '',
    tag: '',
    search: ''
  })

  useEffect(() => {
    if (user) {
      fetchArticles()
      fetchTags()
    }
  }, [user, filters])

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/news/tags')
      const data = await response.json()
      setTags(data.tags || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      league: '',
      club: '',
      competition: '',
      source: '',
      tag: '',
      search: ''
    })
  }

  const handleScrapeNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/news/scrape', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Refresh articles after scraping
        await fetchArticles()
        alert(`Scraping completed! ${data.message}`)
      } else {
        alert('Scraping failed. Please try again.')
      }
    } catch (error) {
      console.error('Error scraping news:', error)
      alert('Error scraping news. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <AuthGuard>
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(40, 88, 200)' }}>
      {/* Background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/O.png"
          alt="O"
          width={2000}
          height={2000}
          className="opacity-8"
          style={{
            width: '150vh',
            height: '150vh',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)'
          }}
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-20 pb-32">
          <div className="mb-6 sm:mb-8 pt-4 sm:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Rugby League News</h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base">Latest headlines from rugby league around the world</p>
          </div>

          {/* Filters */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border-2 border-white/30 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">League</label>
                <select
                  value={filters.league}
                  onChange={(e) => handleFilterChange('league', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                >
                  <option value="">All Leagues</option>
                  <option value="NRL">NRL</option>
                  <option value="Super League">Super League</option>
                  <option value="Championship">Championship</option>
                  <option value="Women's Super League">Women&apos;s Super League</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                >
                  <option value="">All Sources</option>
                  <option value="BBC Sport">BBC Sport</option>
                  <option value="Sky Sports">Sky Sports</option>
                  <option value="NRL.com">NRL.com</option>
                  <option value="Rugby League.com">Rugby League.com</option>
                  <option value="TotalRL">TotalRL</option>
                  <option value="All Out Rugby League">All Out Rugby League</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Club</label>
                <select
                  value={filters.club}
                  onChange={(e) => handleFilterChange('club', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                >
                  <option value="">All Clubs</option>
                  <option value="Wigan Warriors">Wigan Warriors</option>
                  <option value="St Helens">St Helens</option>
                  <option value="Leeds Rhinos">Leeds Rhinos</option>
                  <option value="Warrington Wolves">Warrington Wolves</option>
                  <option value="Hull FC">Hull FC</option>
                  <option value="Hull KR">Hull KR</option>
                  <option value="Catalans Dragons">Catalans Dragons</option>
                  <option value="Salford Red Devils">Salford Red Devils</option>
                  <option value="Wakefield Trinity">Wakefield Trinity</option>
                  <option value="Castleford Tigers">Castleford Tigers</option>
                  <option value="Huddersfield Giants">Huddersfield Giants</option>
                  <option value="Brisbane Broncos">Brisbane Broncos</option>
                  <option value="Sydney Roosters">Sydney Roosters</option>
                  <option value="Melbourne Storm">Melbourne Storm</option>
                  <option value="Penrith Panthers">Penrith Panthers</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors text-sm sm:text-base touch-manipulation"
              >
                Clear Filters
              </button>
            </div>
            
            {/* Available Tags */}
            {tags.length > 0 && (
              <div className="mt-4">
                <label className="block text-white text-sm font-medium mb-2">Quick Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleFilterChange('tag', tag.name)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        filters.tag === tag.name
                          ? 'bg-white/30 text-white border-white/50'
                          : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Articles */}
          {loading ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">Loading news articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-lg">No Articles Found</h3>
                <p className="text-white/80 drop-shadow-md">
                  No rugby league articles match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border-2 border-white/30 hover:bg-white/25 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {article.image_url && (
                      <div className="sm:w-48 flex-shrink-0">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-32 sm:h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {article.source && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                            {article.source}
                          </span>
                        )}
                        {article.league && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                            {article.league}
                          </span>
                        )}
                        {article.club && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                            {article.club}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-white/80 transition-colors"
                        >
                          {article.title}
                        </a>
                      </h3>
                      
                      <p className="text-white/80 mb-3 drop-shadow-md text-sm sm:text-base">
                        {article.excerpt || article.content.substring(0, 200) + '...'}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags && article.tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-white/60 text-sm gap-2 sm:gap-0">
                        <span>
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </span>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80 transition-colors touch-manipulation"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}