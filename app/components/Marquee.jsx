'use client'
import '../styles/Marquee.css'

const items = [
  'RUN PLAY CONNECT',
  'EASY RUN',
  'BEACH GAMES',
  'GOOD VIBES',
  'SATURDAY RUNS',
  'COMMUNITY',
  'CLUB ANVA',
  'CHENNAI',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div className="marquee-item" key={i}>
            <span className="marquee-text">{item}</span>
            <span className="marquee-dot" />
          </div>
        ))}
      </div>
    </div>
  )
}