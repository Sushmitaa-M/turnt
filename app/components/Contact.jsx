'use client'
import { motion } from 'framer-motion'
import '../styles/Contact.css'
import '../styles/Feedback.css'

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <motion.h2
        className="contact-title"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        GET IN TOUCH
      </motion.h2>
      <motion.p
        className="contact-sub"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Hit us up — we'd love to hear from you
      </motion.p>

      <motion.div
        className="contact-grid"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="contact-info">
          <div className="contact-info-row">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            @club.anva
          </div>
          <div className="contact-info-row">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            hello@clubanva.com
          </div>
          <div className="contact-info-row">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            Chennai, Tamil Nadu
          </div>
        </div>

        <div className="contact-form-wrap">
          <input className="form-input" type="text" placeholder="Your name" />
          <input className="form-input" type="email" placeholder="Email address" />
          <textarea className="form-input form-textarea" placeholder="Your message" style={{ minHeight: '140px', resize: 'vertical' }} />
          <button className="send-btn">SEND MESSAGE →</button>
        </div>
      </motion.div>
    </section>
  )
}