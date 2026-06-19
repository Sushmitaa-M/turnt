'use client'
import { motion } from 'framer-motion'

const spring = (delay = 0) => ({
  initial: { opacity: 0, y: 60, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { type: 'spring', stiffness: 80, damping: 20, delay },
})

const slideIn = (delay = 0, from = 'left') => ({
  initial: { opacity: 0, x: from === 'left' ? -80 : 80, filter: 'blur(6px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  transition: { type: 'spring', stiffness: 60, damping: 18, delay },
})

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* ── Ambient Glow Orbs ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 20% 50%, rgba(242,106,10,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 80% 30%, rgba(255,139,20,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(242,106,10,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Grid lines (subtle) ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* ── Main Content: Asymmetric Grid ── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">

          {/* ── Left Column: Typography ── */}
          <div className="md:col-span-7 flex flex-col gap-6">

            {/* Eyebrow */}
            <motion.div {...slideIn(0.1, 'left')} className="flex items-center gap-3">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #F26A0A, transparent)' }} />
              <span
                className="text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: '#FF8B14' }}
              >
                Chennai Gen-Z Community
              </span>
            </motion.div>

            {/* Giant Title */}
            <div className="overflow-hidden">
              <motion.h1
                {...spring(0.2)}
                className="leading-[0.85] tracking-tight"
                style={{
                  fontFamily: "'Jorgey', sans-serif",
                  fontSize: 'clamp(64px, 12vw, 160px)',
                  color: '#FFF7ED',
                }}
              >
                TUR
                <span
                  style={{
                    background: 'linear-gradient(135deg, #F26A0A 0%, #FFC46B 50%, #FF8B14 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                    position: 'relative',
                  }}
                >
                  NT
                </span>
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              {...slideIn(0.35, 'left')}
              className="text-sm md:text-base font-bold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(255,244,230,0.6)' }}
            >
              IRL Hangouts · Good Vibes · Chennai
            </motion.p>

            {/* Description */}
            <motion.p
              {...slideIn(0.45, 'left')}
              className="text-base md:text-lg leading-relaxed max-w-lg"
              style={{ color: 'rgba(255,244,230,0.45)' }}
            >
              No boring plans. No last-minute cancellations. Just show up, catch a vibe, and turn strangers into actual friends.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...slideIn(0.55, 'left')} className="flex flex-wrap gap-3 mt-2">
              <button
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(242,106,10,0.35)',
                }}
                onClick={() => document.querySelector('#upcoming')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(242,106,10,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(242,106,10,0.35)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Join Next Hangout
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <button
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer border"
                style={{
                  borderColor: 'rgba(255,196,107,0.15)',
                  color: 'rgba(255,244,230,0.6)',
                  background: 'transparent',
                }}
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(242,106,10,0.4)'
                  e.currentTarget.style.color = '#FFF7ED'
                  e.currentTarget.style.background = 'rgba(242,106,10,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,196,107,0.15)'
                  e.currentTarget.style.color = 'rgba(255,244,230,0.6)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Learn More
              </button>
            </motion.div>

            {/* Social proof strip */}
            {/* <motion.div {...slideIn(0.65, 'left')} className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-2">
                {[0,1,2,3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      borderColor: '#050505',
                      background: `linear-gradient(135deg, ${['#F26A0A','#FF8B14','#FFC46B','#E85D04'][i]}, ${['#FF8B14','#FFC46B','#F26A0A','#FF9500'][i]})`,
                      color: '#fff',
                    }}
                  >
                    {['H','A','P','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#FFF7ED' }}>500+ members</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,244,230,0.35)' }}>already vibing in Chennai</p>
              </div>
            </motion.div> */}
          </div>

          {/* ── Right Column: Decorative ── */}
          <div className="md:col-span-5 hidden md:flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.4 }}
              className="relative"
            >
              {/* Glowing ring */}
              <div
                className="w-64 h-64 lg:w-80 lg:h-80 rounded-full flex items-center justify-center relative"
                style={{
                  border: '1px solid rgba(242,106,10,0.2)',
                  background: 'radial-gradient(circle at center, rgba(242,106,10,0.08) 0%, transparent 70%)',
                  boxShadow: '0 0 80px rgba(242,106,10,0.1), inset 0 0 60px rgba(242,106,10,0.05)',
                }}
              >
                {/* Inner content */}
                <div className="text-center">
                  <div
                    className="text-6xl lg:text-7xl font-bold mb-2"
                    style={{
                      fontFamily: "'Jorgey', sans-serif",
                      background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ✦
                  </div>
                  <p className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: 'rgba(255,244,230,0.5)' }}>
                    Chennai
                  </p>
                  <p className="text-[10px] tracking-[0.15em] mt-1" style={{ color: 'rgba(255,244,230,0.25)' }}>
                    est. 2026
                  </p>
                </div>

                {/* Orbiting dots */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: '#F26A0A' }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#FF8B14' }} />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ background: '#FFC46B' }} />
                </motion.div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(10,10,10,0.8)',
                  border: '1px solid rgba(242,106,10,0.2)',
                  color: '#FF8B14',
                  backdropFilter: 'blur(10px)',
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                IRL Only
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(10,10,10,0.8)',
                  border: '1px solid rgba(255,196,107,0.15)',
                  color: 'rgba(255,244,230,0.6)',
                  backdropFilter: 'blur(10px)',
                }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                No boring scenes
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, rgba(242,106,10,0.4), transparent)' }}
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,244,230,0.25)' }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
