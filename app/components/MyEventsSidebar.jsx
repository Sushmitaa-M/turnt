'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function MyEventsSidebar({ isOpen, onClose }) {
  const [user, setUser] = useState(null)
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    async function fetchData() {
      setLoading(true)
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (!currentUser) {
        setRsvps([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('event_interests')
        .select('*, events(*)')
        .eq('user_id', currentUser.id)

      setRsvps(data || [])
      setLoading(false)
    }

    fetchData()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className="fixed inset-y-0 right-0 z-[100] w-full md:w-[420px] flex flex-col transition-transform duration-500 ease-out"
        style={{
          background: '#0A0A0A',
          borderLeft: '1px solid rgba(255,196,107,0.08)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,196,107,0.06)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Jorgey', sans-serif", color: '#FFF7ED' }}>
              My <span style={{
                background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>RSVPs</span>
            </h2>
            <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
              {rsvps.length} event{rsvps.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              border: '1px solid rgba(255,196,107,0.1)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,244,230,0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(242,106,10,0.3)'
              e.currentTarget.style.color = '#F26A0A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,196,107,0.1)'
              e.currentTarget.style.color = 'rgba(255,244,230,0.5)'
            }}
            aria-label="Close sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderTopColor: '#F26A0A',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : !user ? (
            <div className="text-center py-16">
              <p className="text-sm mb-3" style={{ color: 'rgba(255,244,230,0.4)' }}>
                Sign in to see your saved events.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
                  color: '#fff',
                }}
              >
                Login
              </a>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4" style={{ opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto" style={{ color: 'rgba(255,244,230,0.2)' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="text-sm mb-1" style={{ color: 'rgba(255,244,230,0.4)' }}>
                No events saved yet.
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,244,230,0.2)' }}>
                Tap the heart on any event to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rsvps.map((rsvp) => {
                const event = rsvp.events
                if (!event) return null
                const dt = new Date(event.date_time)
                const dateStr = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                const timeStr = dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })

                return (
                  <div
                    key={rsvp.id}
                    className="rounded-xl p-4 transition-all duration-200 cursor-default"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,196,107,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(242,106,10,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(242,106,10,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(255,196,107,0.06)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold truncate" style={{ color: '#FFF7ED' }}>
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold tracking-wider" style={{ color: '#F26A0A' }}>
                            {dateStr}
                          </span>
                          <span style={{ color: 'rgba(255,196,107,0.2)' }}>·</span>
                          <span className="text-[10px]" style={{ color: 'rgba(255,244,230,0.3)' }}>
                            {timeStr}
                          </span>
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: 'rgba(255,244,230,0.25)' }}>
                          {event.venue}
                        </p>
                      </div>
                      <div
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ color: '#F26A0A' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
