'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import '../styles/Navbar.css';


const links = [
  { label: 'Home',     href: '#home'     },
  { label: 'Gallery',  href: '#gallery'  },
  { label: 'Team',     href: '#team'     },
  { label: 'Upcoming', href: '#upcoming' },
  { label: 'About',    href: '#about'    },
  { label: 'Feedback', href: '#feedback' },
  { label: 'Contact',  href: '#contact'  },
  { label: 'Register', href: '#register' },
]

const PANELS = [
  '--panel-bottom-1',
  '--panel-bottom-2',
  '--panel-bottom-3',
  '--panel-bottom-4',
]

function animateProp(el, prop, from, to, duration, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = performance.now()
      function tick(now) {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 2)
        el.style.setProperty(prop, `${from + (to - from) * eased}%`)
        if (t < 1) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    }, delay)
  })
}

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const navRef                = useRef(null)
  const animating             = useRef(false)
  const lastScrollY           = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (open) return
      const current = window.scrollY
      const diff = current - lastScrollY.current
      if (diff > 8 && current > 80) setVisible(false)
      else if (diff < -8) setVisible(true)
      lastScrollY.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => {
    if (open) setVisible(true)
  }, [open])

  const toggle = useCallback(() => {
    if (animating.current) return
    animating.current = true
    const nav     = navRef.current
    const opening = !open

    if (opening) {
      nav.classList.add('open')
      Promise.all(
        PANELS.map((p, i) => animateProp(nav, p, 0, 100, 400, i * 100))
      ).then(() => { animating.current = false })
    } else {
      Promise.all(
        PANELS.map((p, i) => animateProp(nav, p, 100, 0, 400, i * 100))
      ).then(() => {
        nav.classList.remove('open')
        PANELS.forEach(p => nav.style.setProperty(p, '0%'))
        animating.current = false
      })
    }
    setOpen(opening)
  }, [open])

  const close = useCallback(() => { if (open) toggle() }, [open, toggle])

  return (
    <header className="header">
      <div className={`header__top${visible ? '' : ' header__top--hidden'}`}>
        <div className="header__logo" />
        <button
          className={`header__trigger${open ? ' open' : ''}`}
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
        />
      </div>

      <nav className="header__nav" ref={navRef}>
        <ul className="header__list">
          {links.map(({ label, href }) => (
            <li className="header__item" key={label}>
              <a href={href} className="header__link" onClick={close}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="header__aside">
          <span className="header__tagline">Run · Play · Connect</span>
          <a href="#login" className="header__cta" onClick={close}>
            Login
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}