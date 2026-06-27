'use client'

import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import UpcomingEvents from './components/UpcomingEvents'
import Gallery from './components/Gallery'
import About from './components/About'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function Home() {
  const [showHero, setShowHero] = useState(false)
  const [videoDone, setVideoDone] = useState(false)

  const handleVideoEnd = useCallback(() => {
    setVideoDone(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowHero(true)
      })
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div
        className="relative"
        style={{
          opacity: videoDone ? 0 : 1,
          transition: 'opacity 700ms ease-in-out',
          pointerEvents: videoDone ? 'none' : 'auto',
          position: videoDone ? 'absolute' : 'relative',
          width: '100%',
        }}
      >
        <HeroSection onEnded={handleVideoEnd} />
      </div>

      <div
        style={{
          opacity: showHero ? 1 : 0,
          transition: 'opacity 700ms ease-in-out',
          visibility: showHero ? 'visible' : 'hidden',
        }}
      >
        <Navbar />
        <Hero />
        <Marquee />
        <UpcomingEvents />
        <Gallery />
        <About />
        <Contact />
        <Feedback />
        <FAQ />
        <Footer />
      </div>
    </main>
  )
}