'use client'
import { motion } from 'framer-motion'
import '../styles/Hero.css';
const Logo = '/assets/TurnLogobg.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-noise" />
      <div className="hero-glow" />
      <div className='LogoDiv'>
        <img src={Logo} alt="Turn" />
      </div>
      <div className="hero-content">
        <motion.div className="hero-logo-mark" {...fadeUp(0.1)}>
          ✦ TURNT ✦
        </motion.div>

        <motion.h1 className="hero-title" {...fadeUp(0.2)}>
          Turnt<br />
        </motion.h1>

        <motion.p className="hero-tagline" {...fadeUp(0.35)}>
          RUN · PLAY · CONNECT
        </motion.p>

        <motion.p className="hero-subtitle" {...fadeUp(0.45)}>
          Easy Run · Beach Games · Good Vibes
        </motion.p>

        <motion.p className="hero-desc" {...fadeUp(0.5)}>
          A chill morning run by the beach, followed by laughter and a relaxed hangout by the sea.
        </motion.p>

        <motion.div className="hero-buttons" {...fadeUp(0.6)}>
          <button className="btn-primary" onClick={() => document.querySelector('#upcoming')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="8" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="8" r="1.5" fill="currentColor" />
              <circle cx="16" cy="12" r="1.5" fill="currentColor" />
            </svg>
            JOIN NEXT RUN →
          </button>
          <button className="btn-outline" onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 8.5C2 4.9 4.9 2 8.5 2h7C19.1 2 22 4.9 22 8.5v7c0 3.6-2.9 6.5-6.5 6.5h-7C4.9 22 2 19.1 2 15.5v-7z"/>
              <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            COMMUNITY
          </button>
          <button className="btn-outline">
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            INSTAGRAM
          </button>
        </motion.div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span className="scroll-label">Scroll</span>
      </div>
    </section>
  )
}