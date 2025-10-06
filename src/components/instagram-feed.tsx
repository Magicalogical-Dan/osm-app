'use client'

import { InstagramEmbed } from './instagram-embed'
import { Instagram, ExternalLink } from 'lucide-react'

interface InstagramFeedProps {
  username: string
  displayName: string
  profileUrl: string
  recentPosts: Array<{
    url: string
    caption: string
    likes: number
    comments: number
    timestamp: string
  }>
  className?: string
}

export function InstagramFeed({ 
  username, 
  displayName, 
  profileUrl, 
  recentPosts, 
  className = '' 
}: InstagramFeedProps) {
  return (
    <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">@{username}</h3>
            <p className="text-sm text-white/80">{displayName}</p>
          </div>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white/80 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="space-y-4">
        {recentPosts.length > 0 ? (
          recentPosts.map((post, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">{post.timestamp}</span>
                <div className="flex items-center space-x-3 text-sm text-white/80">
                  <span className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </span>
                </div>
              </div>
              <p className="text-white text-sm mb-3">{post.caption}</p>
              
              {/* Instagram Embed for the actual post */}
              <div className="flex justify-center">
                <InstagramEmbed 
                  url={post.url} 
                  width={300} 
                  height={350}
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-center">
            <p className="text-white/60 text-sm">No recent posts available</p>
          </div>
        )}
      </div>
    </div>
  )
}

