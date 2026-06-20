'use client'
import { motion } from 'framer-motion'

const spring = (delay = 0) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true },
  transition: { type: 'spring', stiffness: 60, damping: 18, delay },
})

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-36 px-6 md:px-12 overflow-hidden" style={{ background: '#050505' }}>

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(242,106,10,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 20% 80%, rgba(255,139,20,0.05) 0%, transparent 60%)
        `,
      }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* ── Eyebrow ── */}
        <motion.div {...spring(0)} className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #F26A0A)' }} />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#FF8B14' }}>
            Get in touch
          </span>
          <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #F26A0A, transparent)' }} />
        </motion.div>

        {/* ── Massive CTA ── */}
        <motion.h2 {...spring(0.1)} className="leading-[0.85] tracking-tight mb-6" style={{
          fontFamily: "'Jorgey', sans-serif",
          fontSize: 'clamp(48px, 10vw, 120px)',
          color: '#FFF7ED',
        }}>
          DON&apos;T BE A<br />
          <span style={{
            background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>STRANGER</span>
        </motion.h2>

        <motion.p {...spring(0.2)} className="text-sm md:text-base mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,244,230,0.4)' }}>
          Hit us up on Instagram or drop an email. We reply faster than your group chat.
        </motion.p>

        {/* ── Pill Buttons ── */}
        <motion.div {...spring(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Instagram */}
          <a
            href="https://instagram.com/turnt.club"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(242,106,10,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(242,106,10,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(242,106,10,0.3)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Instagram
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>

          {/* Email */}
          <a
            href="mailto:syedsma2525@gmail.com"
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer border"
            style={{
              borderColor: 'rgba(255,196,107,0.15)',
              color: 'rgba(255,244,230,0.6)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(242,106,10,0.4)'
              e.currentTarget.style.color = '#FFF7ED'
              e.currentTarget.style.background = 'rgba(242,106,10,0.06)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,196,107,0.15)'
              e.currentTarget.style.color = 'rgba(255,244,230,0.6)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Us
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* ── Location ── */}
        <motion.p {...spring(0.4)} className="mt-10 text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,244,230,0.2)', fontFamily: "'Space Mono', monospace" }}>
          Chennai, Tamil Nadu
        </motion.p>
      </div>
    </section>
  )
}
