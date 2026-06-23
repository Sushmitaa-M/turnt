'use client'

import { useRef, useState, useEffect } from 'react'

export default function HeroVideo() {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Ensure autoplay fires reliably even on low-power modes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay blocked or interrupted:", err)
      })
    }
  }, [])

  const toggleSound = () => {
    if (videoRef.current) {
      const currentMute = videoRef.current.muted
      videoRef.current.muted = !currentMute
      setIsMuted(!currentMute)
      
      // If they un-mute for the first time, restart for maximum impact
      if (!hasInteracted) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
        setHasInteracted(true)
      }
    }
  }

  return (
    <section className="relative w-full h-screen bg-[#000000] flex items-center justify-center overflow-hidden select-none">
      
      {/* Cinematic Video Plate */}
      <video
        ref={videoRef}
        src="/hero-drift.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        controls={false}
        loop={false} // Crucial: Allows native freeze on final frame
        preload="auto" // 2026 LCP Optimization priority hint
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Audio Controller Toggle */}
      <div className="absolute bottom-10 right-10 z-20">
        <button
          onClick={toggleSound}
          className="px-5 py-2.5 bg-[#0D0A09] border border-[rgba(255,196,107,0.1)] rounded-full text-white font-bold text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:border-[#F26A0A] hover:text-[#F26A0A] transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          <span>{isMuted ? '🔇 Muted' : '🔊 Sound On'}</span>
        </button>
      </div>

      {/* Ambient Bottom Fade to mask website scroll transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
    </section>
  )
}