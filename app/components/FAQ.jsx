'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/FAQ.css'

const faqs = [
  { q: 'WHAT IS TURNT?', a: "A space to get off your phone and actually meet people in real life. We organize chill hangouts, beach meetups, and good-vibes-only gatherings in Chennai." },
  { q: 'WHERE DO YOU HOST MEETUPS?', a: "Most of our meetups happen at Besant Nagar Beach — right by the sea. We also explore other spots around Chennai depending on the vibe." },
  { q: 'DO I NEED TO BRING ANYONE?', a: "Come solo! Most people do, and you'll leave with actual friends. No awkwardness — just good energy and real conversations." },
  { q: 'WHEN DO YOU MEET UP?', a: "We host events on weekends, usually in the evenings. Follow us on Instagram @turnt.club to stay in the loop on upcoming hangouts." },
  { q: 'IS IT FREE?', a: "Most of our meetups are free. Some special events might have a small fee to cover snacks or activities — we always let you know upfront." },
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
        <p className="faq-subtitle">Everything you need to know about joining Chennai&apos;s most vibey community.</p>
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
