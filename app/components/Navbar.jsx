'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import MyEventsSidebar from './MyEventsSidebar'

const links = [
  { label: 'Home',     href: '#home'     },
  { label: 'Events',   href: '#upcoming' },
  { label: 'Gallery',  href: '#gallery'  },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    close()
    router.push('/')
  }

  return (
    <>
      {/* ─── Floating Pill Navbar ─── */}
      <header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
        style={{ width: 'min(92vw, 720px)' }}
      >
        <nav
          className="flex items-center justify-between gap-3 px-5 py-3 rounded-full border transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.6)',
            borderColor: scrolled ? 'rgba(242,106,10,0.15)' : 'rgba(255,196,107,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(242,106,10,0.08)'
              : '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={close}>
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "'Jorgey', sans-serif",
                background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TURNT
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="block px-3 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-200 cursor-pointer"
                  style={{ color: 'rgba(255,244,230,0.5)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFF7ED'
                    e.currentTarget.style.background = 'rgba(242,106,10,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,244,230,0.5)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side: Auth buttons + Hamburger */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Desktop: My RSVPs + Logout */}
                <button
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    border: '1px solid rgba(242,106,10,0.3)',
                    color: '#F26A0A',
                    background: 'transparent',
                  }}
                  onClick={() => setIsSidebarOpen(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(242,106,10,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(242,106,10,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(242,106,10,0.3)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  My RSVPs
                </button>
                <button
                  className="hidden sm:flex items-center px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(242,106,10,0.3)',
                  }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(242,106,10,0.45)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(242,106,10,0.3)'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(242,106,10,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(242,106,10,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(242,106,10,0.3)'
                }}
              >
                Login
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
              onClick={() => setOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                style={{ background: '#FFF7ED', transform: open ? 'rotate(45deg) translate(2px, 2px)' : 'none' }}
              />
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                style={{ background: '#FFF7ED', opacity: open ? 0 : 1 }}
              />
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                style={{ background: '#FFF7ED', transform: open ? 'rotate(-45deg) translate(2px, -2px)' : 'none' }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? '500px' : '0', opacity: open ? 1 : 0, marginTop: open ? '8px' : '0' }}
        >
          <div
            className="rounded-2xl border p-4 flex flex-col gap-1"
            style={{
              background: 'rgba(10,10,10,0.92)',
              borderColor: 'rgba(255,196,107,0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={close}
                className="block px-4 py-3 text-sm font-semibold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer"
                style={{ color: 'rgba(255,244,230,0.6)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(242,106,10,0.1)'
                  e.currentTarget.style.color = '#FFF7ED'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,244,230,0.6)'
                }}
              >
                {label}
              </a>
            ))}

            <div className="border-t my-2" style={{ borderColor: 'rgba(255,196,107,0.08)' }} />

            {user ? (
              <>
                <button
                  onClick={() => { close(); setIsSidebarOpen(true) }}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ border: '1px solid rgba(242,106,10,0.3)', color: '#F26A0A' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  My RSVPs
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #F26A0A, #FF8B14)', color: '#fff' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #F26A0A, #FF8B14)', color: '#fff' }}
              >
                Login
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20" />

      {/* Sidebar */}
      <MyEventsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
