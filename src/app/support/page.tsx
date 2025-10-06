'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
import { supabase } from '@/lib/supabase'
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'

export default function SupportPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('contact')
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

  const supportMethods = [
    {
      title: 'Direct Message',
      description: 'Send a message to your agent directly',
      icon: MessageCircle,
      color: 'osm-blue',
      action: () => setActiveTab('contact'),
    },
    {
      title: 'Phone Support',
      description: 'Call our support team for immediate assistance',
      icon: Phone,
      color: 'osm-green',
      action: () => window.open('tel:+1234567890'),
    },
    {
      title: 'Email Support',
      description: 'Send an email for non-urgent inquiries',
      icon: Mail,
      color: 'osm-red',
      action: () => window.open('mailto:support@osm-ltd.com'),
    },
  ]

  const faqItems = [
    {
      question: 'How do I update my player profile?',
      answer: 'Go to the Profile section in the main navigation and fill out the required information. Make sure to save your changes.',
    },
    {
      question: 'How do I change my sport preference?',
      answer: 'In your Profile settings, you can select between Rugby League and Rugby Union. This will filter your news content.',
    },
    {
      question: 'How do I connect my social media accounts?',
      answer: 'Visit the Social section and add your Instagram, TikTok, and Twitter URLs in your profile settings.',
    },
    {
      question: 'How do I get help with my contract?',
      answer: 'Contact your agent directly through the messaging feature in the Support section, or call our support team.',
    },
    {
      question: 'How do I disable tooltips?',
      answer: 'Go to Settings and toggle off the "Enable tooltips" option to disable the helpful hints throughout the app.',
    },
  ]


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

        {/* Support Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {supportMethods.map((method, index) => (
            <button
              key={index}
              onClick={method.action}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-white/20">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{method.title}</h3>
                  <p className="text-sm text-white/80">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
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

        {/* Contact Information */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-white" />
              <div>
                <p className="font-medium text-white">Phone Support</p>
                <p className="text-white/80">+1 (234) 567-8900</p>
                <p className="text-sm text-white/60">Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-white" />
              <div>
                <p className="font-medium text-white">Email Support</p>
                <p className="text-white/80">support@osm-ltd.com</p>
                <p className="text-sm text-white/60">24/7 response</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-white/30 rounded-lg p-4 bg-white/10">
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-white" />
                  {item.question}
                </h3>
                <p className="text-white/80 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
