'use client'
import { motion } from 'framer-motion'
import '../styles/Reviews.css'

const reviews = [
  { name: 'Harikant', initial: 'H', stars: 5, text: 'HANDS DOWN THE BEST COMMUNITY OUT THERE IN CHENNAI.', date: '2/15/2026' },
  { name: 'Akshya', initial: 'A', stars: 5, text: 'Huge thanks to Turnt for making my first meetup so memorable. I was a bit nervous showing up alone, but the vibe was incredibly welcoming from the start to the end.', date: '2/14/2026' },
  { name: 'Lakshan', initial: 'L', stars: 5, text: 'Such a good time. Already bringing friends to the next one.', date: '2/19/2026' },
  { name: 'Dharmik', initial: 'D', stars: 4, text: 'the best community meetup I have been to — real energy, real people.', date: '2/12/2026' },
  { name: 'Priya', initial: 'P', stars: 5, text: 'Joined without knowing anyone. Left with five new friends and a craving for the next hangout.', date: '2/10/2026' },
  { name: 'Kiran', initial: 'K', stars: 5, text: 'The beach sunset meetup was unreal. Best way to spend a Saturday evening.', date: '2/8/2026' },
]

const doubled = [...reviews, ...reviews]

export default function Reviews() {
  return (
    <section className="reviews" id="feedback">
      <div className="reviews-header">
        <motion.h2
          className="reviews-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          REV<span>IE</span>WS
        </motion.h2>
      </div>

      <div className="reviews-track-wrap">
        <div className="reviews-track">
          {doubled.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-quote-icon">"</div>
              <div className="review-user">
                <div className="review-avatar">{r.initial}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-stars">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <span key={j} className="star">★</span>
                    ))}
                    {Array.from({ length: 5 - r.stars }).map((_, j) => (
                      <span key={j} className="star" style={{ opacity: 0.25 }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-text">{r.text}</p>
              <div className="review-date">{r.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-cta">
        <button className="btn-ghost">View All Reviews</button>
      </div>
    </section>
  )
}
