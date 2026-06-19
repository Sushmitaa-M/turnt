'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        setAccessDenied(true)
        setLoading(false)
        setTimeout(() => router.push('/'), 2000)
        return
      }

      const { data, error } = await supabase
        .from('events')
        .select('*, event_interests( profiles(full_name, username, whatsapp_number) )')
        .order('date_time', { ascending: true })

      if (!error && data) {
        setEventsData(data)
      }

      setLoading(false)
    }

    checkAccess()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-3 mx-auto mb-4"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              borderTopColor: '#F26A0A',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="text-sm tracking-widest uppercase" style={{ color: 'rgba(255,244,230,0.4)' }}>
            Verifying access...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <div className="text-6xl mb-4" style={{ fontFamily: "'Jorgey', sans-serif", color: '#EF4444' }}>
            403
          </div>
          <p className="text-sm tracking-widest uppercase mb-2" style={{ color: 'rgba(255,244,230,0.5)' }}>
            Access Denied
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,244,230,0.25)' }}>
            Redirecting to home...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 md:px-8 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #F26A0A, transparent)' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#FF8B14', fontFamily: "'Space Mono', monospace" }}>
              Admin
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
            style={{
              fontFamily: "'Jorgey', sans-serif",
              color: '#FFF7ED',
            }}
          >
            Event <span style={{
              background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>RSVPs</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,244,230,0.35)' }}>
            View registrations and interested users across all events.
          </p>
        </div>

        {/* ── Stats Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Events', value: eventsData.length },
            { label: 'Total RSVPs', value: eventsData.reduce((sum, e) => sum + (e.event_interests?.length || 0), 0) },
            { label: 'Upcoming', value: eventsData.filter(e => new Date(e.date_time) > new Date()).length },
            { label: 'Past Events', value: eventsData.filter(e => new Date(e.date_time) <= new Date()).length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5"
              style={{
                background: '#0A0A0A',
                border: '1px solid rgba(255,196,107,0.06)',
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
                {stat.label}
              </p>
              <p className="text-2xl md:text-3xl font-bold" style={{
                fontFamily: "'Jorgey', sans-serif",
                background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Events List ── */}
        <div className="space-y-6">
          {eventsData.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#0A0A0A', border: '1px solid rgba(255,196,107,0.06)' }}>
              <p className="text-sm" style={{ color: 'rgba(255,244,230,0.35)' }}>No events found.</p>
            </div>
          ) : (
            eventsData.map((event) => {
              const interests = event.event_interests || []
              const isPast = new Date(event.date_time) <= new Date()
              const dt = new Date(event.date_time)
              const dateStr = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
              const timeStr = dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })

              return (
                <div
                  key={event.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#0A0A0A',
                    border: '1px solid rgba(255,196,107,0.06)',
                    opacity: isPast ? 0.6 : 1,
                  }}
                >
                  {/* Event Header */}
                  <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255,196,107,0.04)' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg md:text-xl font-bold" style={{ fontFamily: "'Jorgey', sans-serif", color: '#FFF7ED' }}>
                          {event.name}
                        </h2>
                        {isPast && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,244,230,0.3)' }}>
                            Past
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,244,230,0.4)' }}>
                        <span>{dateStr}</span>
                        <span style={{ color: 'rgba(255,196,107,0.2)' }}>·</span>
                        <span>{timeStr}</span>
                        <span style={{ color: 'rgba(255,196,107,0.2)' }}>·</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="px-4 py-2 rounded-full text-xs font-bold tracking-wider"
                        style={{
                          background: interests.length > 0 ? 'rgba(242,106,10,0.12)' : 'rgba(255,255,255,0.04)',
                          color: interests.length > 0 ? '#F26A0A' : 'rgba(255,244,230,0.3)',
                          border: `1px solid ${interests.length > 0 ? 'rgba(242,106,10,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {interests.length} {interests.length === 1 ? 'RSVP' : 'RSVPs'}
                      </div>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="p-5 md:p-6">
                    {interests.length === 0 ? (
                      <p className="text-xs text-center py-4" style={{ color: 'rgba(255,244,230,0.2)' }}>
                        No registrations yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,196,107,0.06)' }}>
                              <th className="pb-3 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
                                #
                              </th>
                              <th className="pb-3 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
                                Name
                              </th>
                              <th className="pb-3 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
                                Username
                              </th>
                              <th className="pb-3 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
                                WhatsApp
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {interests.map((interest, idx) => {
                              const profile = interest.profiles
                              return (
                                <tr
                                  key={idx}
                                  className="transition-colors duration-150"
                                  style={{ borderBottom: '1px solid rgba(255,196,107,0.03)' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(242,106,10,0.03)' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                >
                                  <td className="py-3 text-xs tabular-nums" style={{ color: 'rgba(255,244,230,0.2)' }}>
                                    {String(idx + 1).padStart(2, '0')}
                                  </td>
                                  <td className="py-3 text-sm font-semibold" style={{ color: '#FFF7ED' }}>
                                    {profile?.full_name || '—'}
                                  </td>
                                  <td className="py-3 text-sm" style={{ color: 'rgba(255,244,230,0.5)' }}>
                                    @{profile?.username || '—'}
                                  </td>
                                  <td className="py-3 text-sm" style={{ color: 'rgba(255,244,230,0.5)' }}>
                                    {profile?.whatsapp_number || '—'}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
