'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import '../styles/Feedback.css'

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  return (
    <section className="feedback" id="feedback-form">
      <motion.h2
        className="feedback-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="white">SHARE YOUR </span>
        <span className="orange">EXPERIE</span>
        <span className="white">NCE</span>
      </motion.h2>

      <motion.p
        className="feedback-sub"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Tell us what you loved about hanging out with TURNT
      </motion.p>

      <motion.div
        className="feedback-form"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div>
          <div className="rating-label">YOUR RATING</div>
          <div className="stars-row">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                className={`star-btn ${n <= (hover || rating) ? 'active' : ''}`}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
              >★</button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <input className="form-input" type="text" placeholder="Your name *" />
          <input className="form-input" type="email" placeholder="Email (optional)" />
        </div>

        <textarea
          className="form-input form-textarea"
          placeholder="Tell us about your experience... *"
        />

        <button className="submit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          SUBMIT FEEDBACK
        </button>

        <p className="feedback-alt">or send a direct message instead</p>
      </motion.div>
    </section>
  )
}