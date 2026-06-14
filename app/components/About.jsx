'use client'
import { motion } from 'framer-motion'
import '../styles/About.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
})

const pillars = [
  { badge: 'SHOW UP AS YOU ARE', sub: 'No gear requirements. No fitness level needed. Just bring yourself.' },
  { badge: 'MOVEMENT IS MEDICINE', sub: 'We believe movement is the cure for isolation and overthinking.' },
  { badge: 'REAL LIFE > ONLINE LIFE', sub: 'We trade pixels for pavement and likes for high-fives.' },
  { badge: 'COMMUNITY > COMPETITION', sub: 'We cheer loudest for the last person to finish.' },
]

export default function About() {
  return (
    <div className="about" id="about">

      {/* Run With Us */}
      {/* <section className="run-with-us">
        <motion.div {...fadeUp(0)}>
          <h2 className="run-city-title">
            <span className="white-line">RUN WITH US</span>
            <span className="orange-line">CHENNAI</span>
          </h2>
        </motion.div>

        <motion.p className="run-desc" {...fadeUp(0.1)}>
          Run with us in Nassa uth, Besant nagar. No experience needed. Just show up.
        </motion.p>

        <motion.div className="run-btns" {...fadeUp(0.2)}>
          <button className="btn-primary">REGISTER NOW →</button>
          <button className="btn-outline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 8.5C2 4.9 4.9 2 8.5 2h7C19.1 2 22 4.9 22 8.5v7c0 3.6-2.9 6.5-6.5 6.5h-7C4.9 22 2 19.1 2 15.5v-7z"/>
            </svg>
            JOIN COMMUNITY
          </button>
          <button className="btn-outline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            FOLLOW US
          </button>
          <p className="run-meta">Chennai-based · Community · Open to All</p>
        </motion.div>
      </section> */}

      {/* Come As You Are */}
      <section className="come-as-you-are">
        <motion.p className="section-eyebrow" {...fadeUp(0)}>CLUB ANVA</motion.p>
        <motion.p className="section-tagline" {...fadeUp(0.05)}>Culture. Chaos. Community.</motion.p>
        <motion.h2 className="caya-title" {...fadeUp(0.1)}>
          COME AS<br />YOU ARE
        </motion.h2>
        <motion.p className="caya-desc" {...fadeUp(0.2)}>
          No roles to perform. No pressure to impress. Just people choosing presence, movement, and real connection.
        </motion.p>
        <motion.p className="caya-desc-2" {...fadeUp(0.25)}>
          You don't need to be a "runner". You don't need fancy shoes. You don't need to be fast. You just need to show up. We hold space for every pace, every story, and every vibe.
        </motion.p>
      </section>

      {/* Where Anva Began */}
      <section className="where-began">
        <motion.p className="began-eyebrow" {...fadeUp(0)}>The beginning of it all</motion.p>
        <motion.h2 className="began-title" {...fadeUp(0.1)}>WHERE ANVA BEGAN</motion.h2>
        <motion.p className="began-text" {...fadeUp(0.2)}>
          We didn't start ANVA to just run. We started it to belong. To feel something real in a digital world. To find our people.
        </motion.p>
        <motion.p className="began-text-2" {...fadeUp(0.25)}>
          In a city that never stops moving, we realized we were all running parallel races—close, but never touching. We craved a "third place" that wasn't work or home. A space where titles don't matter, deadlines don't exist, and the only goal is to share a sunrise with strangers who turn into family.
        </motion.p>
      </section>

      {/* Anva Definition */}
      <section className="anva-def">
        <motion.div {...fadeUp(0)}>
          <div className="anva-word">Anva</div>
          <div className="anva-phonetic">[an-va] · noun</div>
        </motion.div>
        <motion.p className="anva-definition" {...fadeUp(0.1)}>
          The quiet feeling of belonging that appears when people move together, slow down, and realise they are not alone.
        </motion.p>
        <motion.p className="anva-sub-def" {...fadeUp(0.15)}>
          It's not about the pace, the PRs, or the medals. It's about the collective energy of a hundred footsteps hitting the ground in rhythm. It's the safety of the pack and the freedom of the run.
        </motion.p>
      </section>

      {/* What We Stand For */}
      <section className="stand-for">
        <motion.h2 className="stand-for-title" {...fadeUp(0)}>
          <span className="line1">WHAT WE</span><br />
          <span className="line2">STAND FOR</span>
        </motion.h2>
        <div className="stand-pillars">
          {pillars.map((p, i) => (
            <motion.div
              key={p.badge}
              className="pillar-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="pillar-badge">{p.badge}</div>
              <div className="pillar-sub">{p.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section className="connect-section">
        <motion.div className="connect-bar" {...fadeUp(0)}>
          <div className="connect-title">CONNECT</div>
        </motion.div>
        <motion.p className="connect-body" {...fadeUp(0.1)}>
          Everyone is busy. Everyone is moving. Yet somewhere along the way, most of us stopped feeling truly connected.
        </motion.p>
        <motion.p className="connect-desc" {...fadeUp(0.15)}>
          We have 1,000 friends online but no one to grab coffee with. We double-tap photos but forget to make eye connection. Club Anva is our rebellion against the scroll. We trade pixels for pavement, likes for high-fives, and notifications for real conversations.
        </motion.p>
        <motion.p className="connect-accent" {...fadeUp(0.2)}>We noticed.</motion.p>
        <motion.p className="connect-scroll-text" {...fadeUp(0.25)}>SCROLLING IS NOT EQUAL TO BELONGING</motion.p>
      </section>
    </div>
  )
}