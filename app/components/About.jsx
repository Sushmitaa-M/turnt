'use client'
import { motion } from 'framer-motion'

const spring = (delay = 0) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true },
  transition: { type: 'spring', stiffness: 60, damping: 18, delay },
})

const slideIn = (delay = 0) => ({
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { type: 'spring', stiffness: 60, damping: 18, delay },
})

const pillars = [
  { badge: 'SHOW UP AS YOU ARE', sub: 'No masks. No pretenses. Just bring yourself and your real energy.' },
  { badge: 'VIBES OVER EVERYTHING', sub: 'We believe good company is the cure for doomscrolling and loneliness.' },
  { badge: 'REAL LIFE > ONLINE LIFE', sub: 'We trade screenshots for shared moments and DMs for real conversations.' },
  { badge: 'COMMUNITY > CROWDS', sub: 'We remember names, not just faces. Every person matters here.' },
]

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-32 px-6 md:px-12" style={{ background: '#050505' }}>

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 40% at 30% 50%, rgba(242,106,10,0.06) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Come As You Are ── */}
        <div className="mb-24 md:mb-32">
          <motion.div {...slideIn(0)} className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #F26A0A, transparent)' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#FF8B14' }}>
              Turnt
            </span>
          </motion.div>

          <motion.p {...spring(0.05)} className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,244,230,0.35)', fontFamily: "'Space Mono', monospace" }}>
            Culture. Chaos. Community.
          </motion.p>

          <motion.h2 {...spring(0.1)} className="leading-[0.85] tracking-tight mb-8" style={{
            fontFamily: "'Jorgey', sans-serif",
            fontSize: 'clamp(48px, 10vw, 120px)',
            background: 'linear-gradient(160deg, #FFF7ED 20%, #FFC46B 60%, #F26A0A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            COME AS<br />YOU ARE
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.p {...spring(0.2)} className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,244,230,0.6)' }}>
              No roles to perform. No pressure to impress. Just people choosing presence, good company, and real connection.
            </motion.p>
            <motion.p {...spring(0.25)} className="text-sm leading-relaxed" style={{ color: 'rgba(255,244,230,0.35)' }}>
              You don&apos;t need to be anyone special. You don&apos;t need a plan. You just need to show up. We hold space for every mood, every story, and every vibe.
            </motion.p>
          </div>
        </div>

        {/* ── Why We Built Turnt (Glassmorphic Card) ── */}
        <motion.div {...spring(0.1)} className="rounded-3xl p-8 md:p-12 mb-24 md:mb-32" style={{
          background: 'rgba(10,10,10,0.6)',
          border: '1px solid rgba(242,106,10,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(242,106,10,0.04), inset 0 1px 0 rgba(255,196,107,0.05)',
        }}>
          <motion.p {...slideIn(0)} className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: 'rgba(255,244,230,0.3)', fontFamily: "'Space Mono', monospace" }}>
            How it started
          </motion.p>

          <motion.h2 {...spring(0.1)} className="leading-[0.85] tracking-tight mb-8" style={{
            fontFamily: "'Jorgey', sans-serif",
            fontSize: 'clamp(36px, 7vw, 72px)',
            background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            WHY WE BUILT<br />TURNT
          </motion.h2>

          <motion.p {...spring(0.2)} className="text-lg md:text-xl font-semibold leading-relaxed mb-6 max-w-2xl" style={{ color: '#FFF7ED' }}>
            We did not start Turnt to plan another event. We started it to belong. To feel something real in a digital world. To find our people.
          </motion.p>

          <motion.p {...spring(0.25)} className="text-sm leading-relaxed max-w-xl" style={{ color: 'rgba(255,244,230,0.45)' }}>
            We realized everyone in Chennai was stuck in group chats, postponing plans forever. Next weekend? became a meme. Turnt is our rebellion against the endless scroll.
          </motion.p>
        </motion.div>

        {/* ── What We Stand For ── */}
        <div className="mb-24 md:mb-32">
          <motion.h2 {...spring(0)} className="leading-[0.85] tracking-tight mb-12" style={{
            fontFamily: "'Jorgey', sans-serif",
            fontSize: 'clamp(40px, 8vw, 80px)',
          }}>
            <span style={{ color: '#FFF7ED' }}>WHAT WE </span>
            <span style={{
              background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>STAND FOR</span>
          </motion.h2>

          <div className="flex flex-col">
            {pillars.map((p, i) => (
              <motion.div
                key={p.badge}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 60, damping: 18, delay: i * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b transition-colors duration-300"
                style={{ borderColor: 'rgba(255,196,107,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(242,106,10,0.03)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div className="shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{
                  background: 'linear-gradient(135deg, #F26A0A, #FF8B14)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(242,106,10,0.25)',
                }}>
                  {p.badge}
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,244,230,0.5)' }}>{p.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Connect ── */}
        <div>
          <motion.div {...spring(0)} className="rounded-2xl p-6 md:p-8 mb-8" style={{
            background: 'rgba(10,10,10,0.4)',
            border: '1px solid rgba(255,196,107,0.06)',
          }}>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight" style={{
              fontFamily: "'Jorgey', sans-serif",
              background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              CONNECT
            </h3>
          </motion.div>

          <motion.p {...spring(0.1)} className="text-base md:text-lg font-semibold leading-relaxed mb-4 max-w-2xl" style={{ color: '#FFF7ED' }}>
            Everyone is busy. Everyone is swamped. Yet somewhere along the way, most of us stopped feeling truly connected.
          </motion.p>

          <motion.p {...spring(0.15)} className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: 'rgba(255,244,230,0.4)' }}>
            We have 1,000 friends online but no one to grab coffee with. Turnt is our rebellion against the scroll.
          </motion.p>

          <motion.p {...spring(0.2)} className="text-sm font-bold" style={{ color: '#F26A0A' }}>
            We noticed.
          </motion.p>

          <motion.p {...spring(0.25)} className="text-[10px] tracking-[0.3em] uppercase mt-6" style={{ color: 'rgba(255,244,230,0.2)', fontFamily: "'Space Mono', monospace" }}>
            Scrolling is not equal to belonging
          </motion.p>
        </div>

      </div>
    </section>
  )
}
