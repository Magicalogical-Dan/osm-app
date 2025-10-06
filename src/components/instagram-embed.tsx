'use client'

import { useEffect, useRef } from 'react'

interface InstagramEmbedProps {
  url: string
  width?: number
  height?: number
  className?: string
}

export function InstagramEmbed({ url, width = 400, height = 480, className = '' }: InstagramEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (embedRef.current) {
      // Clear any existing content
      embedRef.current.innerHTML = ''
      
      // Create the Instagram embed script
      const script = document.createElement('script')
      script.async = true
      script.src = '//www.instagram.com/embed.js'
      script.onload = () => {
        // Instagram's embed script will automatically process any blockquote elements
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      }
      
      // Create a blockquote element for Instagram to process
      const blockquote = document.createElement('blockquote')
      blockquote.className = 'instagram-media'
      blockquote.setAttribute('data-instgrm-permalink', url)
      blockquote.setAttribute('data-instgrm-version', '14')
      blockquote.setAttribute('data-instgrm-captioned', 'true')
      blockquote.style.cssText = `
        background:#FFF; 
        border:0; 
        border-radius:3px; 
        box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); 
        margin: 1px; 
        max-width:${width}px; 
        min-width:326px; 
        padding:0; 
        width:99.375%; 
        width:-webkit-calc(100% - 2px); 
        width:calc(100% - 2px);
      `
      
      embedRef.current.appendChild(blockquote)
      document.head.appendChild(script)
    }
  }, [url, width])

  return (
    <div 
      ref={embedRef} 
      className={`instagram-embed ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  )
}

// Declare Instagram's global object
declare global {
  interface Window {
    instgrm: {
      Embeds: {
        process: () => void
      }
    }
  }
}

