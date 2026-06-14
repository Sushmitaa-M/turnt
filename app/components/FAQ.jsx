'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/FAQ.css'

const faqs = [
  { q: 'WHAT IS THIS RUN CLUB FOR?', a: "Club Anva is a community-first run club in Chennai. We're for people who want to move, connect, and have fun — not compete. All paces, all levels, all vibes welcome." },
  { q: 'WHERE DO YOU HOST THE RUNS?', a: "We run at Besant Nagar (Bessyy) — right by the beach in Nassa uth. It's the perfect backdrop for a chill morning." },
  { q: 'HOW LONG IS THE RUN?', a: "Typically around 3km — enough to break a sweat, not enough to break you. We always follow up with games and hangout time." },
  { q: 'WHEN DO YOU RUN?', a: "Every Saturday, 6:00–8:00 AM. Early enough to catch the sunrise, early enough to still have your whole day." },
  { q: 'CAN I BRING A FRIEND?', a: "Absolutely! The more the merrier. Club Anva thrives on new faces and energy. Bring anyone who wants to run, play, and connect." },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="faq" id="faq">
      <div className="faq-header">
        <motion.h2
          className="faq-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="white">COMMON </span>
          <span className="orange">QUESTIONS</span>
        </motion.h2>
        <p className="faq-subtitle">Everything you need to know about joining Chennai's most vibrant running tribe.</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.q}
            className={`faq-item ${open === i ? 'open' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              <span className="faq-q-text">{faq.q}</span>
              <span className="faq-icon">+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}