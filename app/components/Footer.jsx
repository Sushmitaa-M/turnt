'use client'
import '../styles/Footer.css'

const navLinks = ['Home', 'About', 'Gallery', 'Team', 'Register']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <span>CLUB</span>
                <span>ANVA</span>
              </div>
              <div className="footer-brand-name">
                Club <span>Anva</span> · Chennai
              </div>
            </div>
            <p className="footer-tagline">RUN · PLAY · CONNECT</p>
          </div>

          <nav className="footer-nav">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Club Anva. All rights reserved.</p>
          <p className="footer-dev">Developed by <span>@adhiswhat</span></p>
        </div>
      </div>
    </footer>
  )
}