'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { supabase } from '@/lib/supabase'
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'

export default function SupportPage() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !subject || !message) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          user_id: user.id,
          subject,
          message,
          status: 'open',
        })

      if (error) {
        console.error('Error sending message:', error)
      } else {
        setSent(true)
        setSubject('')
        setMessage('')
        setTimeout(() => setSent(false), 3000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }



  return (
    <AuthGuard>
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: 'rgb(234, 54, 36)' }}>
      {/* Background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/M.png"
          alt="M"
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
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-32">
          <div className="flex items-center space-x-3 mb-8 pt-8">
            <HelpCircle className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Support</h1>
          </div>


         {/* Team Members */}
         <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
           <h2 className="text-2xl font-bold text-white mb-6">Our Team</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/10 rounded-lg p-4 border border-white/20">
               <h4 className="font-semibold text-white">Andy Clarke</h4>
               <p className="text-white/80 text-sm mb-2">Managing Director</p>
               <a href="mailto:andy@outside-sport.com" className="text-white/80 text-sm hover:text-white transition-colors">
                 andy@outside-sport.com
               </a>
             </div>
             
             <div className="bg-white/10 rounded-lg p-4 border border-white/20">
               <h4 className="font-semibold text-white">Ian Sibbit</h4>
               <p className="text-white/80 text-sm mb-2">Rugby League</p>
               <a href="mailto:ian@outside-sport.com" className="text-white/80 text-sm hover:text-white transition-colors">
                 ian@outside-sport.com
               </a>
             </div>
             
             <div className="bg-white/10 rounded-lg p-4 border border-white/20">
               <h4 className="font-semibold text-white">Peter Menicou</h4>
               <p className="text-white/80 text-sm mb-2">NRL</p>
               <a href="mailto:pmenicou@sfx.com.au" className="text-white/80 text-sm hover:text-white transition-colors">
                 pmenicou@sfx.com.au
               </a>
             </div>
             
             <div className="bg-white/10 rounded-lg p-4 border border-white/20">
               <h4 className="font-semibold text-white">Sophie Clarke</h4>
               <p className="text-white/80 text-sm mb-2">Consultant</p>
               <a href="mailto:sophclarke1@hotmail.com" className="text-white/80 text-sm hover:text-white transition-colors">
                 sophclarke1@hotmail.com
               </a>
             </div>
           </div>
         </div>

         {/* Contact Form */}
         <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-white" />
            Send Message to Your Agent
          </h2>

          {sent && (
            <div className="mb-6 p-4 bg-white/20 border border-white/30 text-white rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Message sent successfully! Your agent will respond within 24 hours.</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="What can we help you with?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="Please provide as much detail as possible..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-white/30"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>

        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
