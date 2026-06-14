'use client'
import { motion } from 'framer-motion'
import '../styles/Team.css'

export default function Team() {
  return (
    <section className="team" id="team">
      <motion.p
        className="team-eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        The minds and hearts behind Club Anva.
      </motion.p>

      <motion.h2
        className="team-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        THE <span>FOUNDERS</span>
      </motion.h2>

      <motion.div
        className="founder-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="founder-card-bg" />
        <div className="founder-badge">FOUNDER</div>

        <div className="founder-avatar">
          <div className="founder-silhouette" />
        </div>

        <div className="founder-tags">
          <span className="founder-tag">21 years young</span>
          <span className="founder-tag accent">Zodiac: Taurus</span>
          <span className="founder-tag accent">Trains hard. Plans harder.</span>
          <span className="founder-tag">IF IT RAINS WE WILL RUN.</span>
          <span className="founder-tag accent">Turns ideas into movements!</span>
          <span className="founder-tag">Makes running feel human</span>
          <span className="founder-tag">Built ANVA because running alone is boring.</span>
        </div>

        <div className="founder-quote">Born to do side quests</div>
      </motion.div>
    </section>
  )
}