'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { supabase } from '@/lib/supabase'
import { NewsArticle } from '@/lib/supabase'
import { 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  User,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

export default function NewsPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])

  useEffect(() => {
    if (user) {
      loadArticles()
    }
  }, [user])

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error loading articles:', error)
      } else if (data) {
        setArticles(data)
        setFilteredArticles(data)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', 'Rugby League', 'Rugby Union', 'Transfers', 'Player Features', 'Match Reports']

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      setFilteredArticles(articles)
    } else {
      const filtered = articles.filter(article => {
        if (category === 'Rugby League') return article.sport === 'rugby_league'
        if (category === 'Rugby Union') return article.sport === 'rugby_union'
        if (category === 'Transfers') return article.tags?.includes('Transfer News')
        if (category === 'Player Features') return article.tags?.includes('Player Interviews')
        if (category === 'Match Reports') return article.tags?.includes('Match Reports')
        return true
      })
      setFilteredArticles(filtered)
    }
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(40, 88, 200)' }}>
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
          <div className="relative z-10 h-screen overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex items-center justify-center pt-20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <span className="ml-3 text-white text-lg">Loading news articles...</span>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
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
          <div className="max-w-6xl mx-auto px-4 pt-20 pb-32">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8 pt-8">
              <Newspaper className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">News</h1>
            </div>

            {/* Page Introduction */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Newspaper className="w-8 h-8 text-white mr-3" />
                  <h2 className="text-2xl font-bold text-white">Latest Rugby News & Updates</h2>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-white/80 mb-4">
                    Stay informed with the latest rugby news, player transfers, match results, and exclusive insights from the OSM team.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Daily Updates</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Expert Analysis</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Real-time News</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
                <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category 
                          ? 'bg-white/30 text-white border-2 border-white/50' 
                          : 'bg-white/10 text-white/80 border border-white/30 hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* News Articles */}
            <div className="space-y-6">
              {filteredArticles.length === 0 ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 text-center">
                  <Newspaper className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
                  <p className="text-white/80">
                    {selectedCategory === 'All' 
                      ? 'No articles are available at the moment.' 
                      : `No articles found for the ${selectedCategory} category.`
                    }
                  </p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Article Image Placeholder */}
                      <div className="lg:w-1/3">
                        <div className="aspect-video bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                          {article.image_url ? (
                            <img 
                              src={article.image_url} 
                              alt={article.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Newspaper className="w-12 h-12 text-white/60" />
                          )}
                        </div>
                      </div>
                      
                      {/* Article Content */}
                      <div className="lg:w-2/3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full border border-white/30">
                            {article.sport === 'rugby_league' ? 'Rugby League' : 
                             article.sport === 'rugby_union' ? 'Rugby Union' : 
                             article.sport === 'both' ? 'Both Sports' : article.sport}
                          </span>
                          <span className="text-white/60 text-sm">{getReadTime(article.content)}</span>
                          {article.league && (
                            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded border border-white/20">
                              {article.league}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 hover:text-white/90 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-white/80 mb-4 leading-relaxed">
                          {article.excerpt || article.content.substring(0, 200) + '...'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{article.source}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(article.published_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                          >
                            <span>Read More</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredArticles.length > 0 && (
              <div className="text-center mt-8">
                <button 
                  onClick={loadArticles}
                  className="bg-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
