'use client'
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import '../styles/Reelssection.css'

// ─── REELS DATA ───────────────────────────────────────────────────────────────
// thumbnail: must be a real image URL (jpg/png/webp) — NOT an Instagram page URL
// videoUrl:  must be a direct .mp4 file URL hosted on Supabase / Cloudinary etc.
const REELS_DATA = [
  {
    id: 1,
    title: "Ignite Your Hustle",
    description: "Behind-the-scenes look at how we fuel momentum every single day.",
    category: "Lifestyle",
    thumbnail: "https://www.instagram.com/reel/DZfIE3uqaim/",
    videoUrl: "https://www.instagram.com/reel/DZfIE3uqaim/",
    instagramUrl: "https://www.instagram.com/reel/DZfIE3uqaim/",
  },
  {
    id: 2,
    title: "Urban Velocity",
    description: "Street culture meets high performance — a visual essay on motion.",
    category: "Culture",
    thumbnail: "https://hwiwmmhwbpogsefdtrxh.supabase.co/storage/v1/object/public/Reel01/Screenshot%202026-06-13%20170416.png",
    videoUrl: "https://hwiwmmhwbpogsefdtrxh.supabase.co/storage/v1/object/public/Reel01/insta2.mp4",
    instagramUrl: "https://www.instagram.com/reel/DZfZFLFoYQH/",
  },
  {
    id: 3,
    title: "Golden Hour",
    description: "Chasing light, chasing dreams — the art of the perfect moment.",
    category: "Photography",
    thumbnail: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=400&h=700&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    instagramUrl: "https://www.instagram.com/reel/DZaYk-ZPWZS/",
  },
  {
    id: 4,
    title: "Neon Nights",
    description: "When the city sleeps, the real stories begin. Witness the glow.",
    category: "Nightlife",
    thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=400&h=700&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    instagramUrl: "https://www.instagram.com/reel/DZaYk-ZPWZS/",
  },
  {
    id: 5,
    title: "Raw Energy",
    description: "Unfiltered passion. Uncut power. This is what drive looks like.",
    category: "Fitness",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    instagramUrl: "https://www.instagram.com/reel/DZaYk-ZPWZS/",
  },
  {
    id: 6,
    title: "Summit Mindset",
    description: "Every peak starts with a single step. Elevate your perspective.",
    category: "Adventure",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=700&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    instagramUrl: "https://www.instagram.com/reel/DZaYk-ZPWZS/",
  },
];

// ─── Icons ─────────────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true" width="17" height="17">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="10" height="10">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

// ✅ FIXED: SoundOnIcon = speaker WITH waves (shown when sound IS ON / not muted)
const SoundOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="15" height="15">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

// ✅ FIXED: SoundOffIcon = speaker WITH X (shown when sound IS OFF / muted)
const SoundOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="15" height="15">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" width="20" height="20">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" width="20" height="20">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Reel Card ─────────────────────────────────────────────────────────────────
const ReelCard = ({ reel, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused,  setIsPaused]  = useState(false);
  const [isMuted,   setIsMuted]   = useState(true);   // starts muted
  const [progress,  setProgress]  = useState(0);
  const videoRef = useRef(null);

  // Auto-play when entering playing state
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.muted = true;          // always start muted (browser policy)
      setIsMuted(true);
      videoRef.current.play().catch(() => {});
      setIsPaused(false);
    }
  }, [isPlaying]);

  // Reset on close
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setIsMuted(true);
  };

  const togglePause = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPaused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  // ✅ FIXED mute toggle — syncs videoRef.muted AND state correctly
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration) setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  const cardVariants = {
    hidden:  { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.article
      className="reel-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      aria-label={`Reel: ${reel.title}`}
    >
      <div className="reel-media-wrapper">

        {/* ── THUMBNAIL STATE ── */}
        {!isPlaying && (
          <>
            <img
              className="reel-thumbnail"
              src={reel.thumbnail}
              alt={reel.title}
              loading="lazy"
              draggable={false}
            />
            <div className="reel-vignette" aria-hidden="true" />
            <div className="reel-overlay">
              <div className="reel-overlay-top">
                <span className="reel-category-tag">{reel.category}</span>
                <a
                  href={reel.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reel-insta-link"
                  aria-label="View on Instagram"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InstagramIcon />
                </a>
              </div>
              <div className="reel-overlay-bottom">
                <h3 className="reel-title">{reel.title}</h3>
                <p className="reel-desc">{reel.description}</p>
                <button className="reel-watch-cta" onClick={() => setIsPlaying(true)}>
                  <PlayIcon />
                  <span>Watch Reel</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── PLAYING STATE ── */}
        {isPlaying && (
          <div className="reel-video-shell">
            <video
              ref={videoRef}
              className="reel-video"
              src={reel.videoUrl}
              muted={isMuted}
              playsInline
              loop
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPaused(true)}
            />

            {/* Tap centre to pause/resume */}
            <button
              className="reel-video-tap-zone"
              onClick={togglePause}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused && (
                <span className="reel-paused-indicator">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </span>
              )}
            </button>

            {/* Top controls: mute toggle + close */}
            <div className="reel-video-top-bar">
              {/* ✅ FIXED: isMuted=true  → show SoundOffIcon (speaker+X)
                          isMuted=false → show SoundOnIcon  (speaker+waves) */}
              <button
                className="reel-video-ctrl-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
              </button>

              <button
                className="reel-video-ctrl-btn reel-video-ctrl-btn--close"
                onClick={handleClose}
                aria-label="Close video"
              >
                ✕
              </button>
            </div>

            {/* Bottom: title + IG link + progress */}
            <div className="reel-video-bottom-bar">
              <div className="reel-video-meta">
                <span className="reel-video-label">{reel.title}</span>
                <a href={reel.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="reel-video-ig-link" onClick={(e) => e.stopPropagation()}>
                  <InstagramIcon />
                </a>
              </div>
              <div
                className="reel-progress-track"
                onClick={handleSeek}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="reel-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="reel-glow-border" aria-hidden="true" />
      </div>
    </motion.article>
  );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ inView }) => (
  <motion.div
    className="reels-header"
    initial={{ opacity: 0, y: 32 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <motion.div className="reels-badge"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}>
      <span className="reels-badge-dot" />
      <InstagramIcon />
      <span>Instagram Reels</span>
    </motion.div>

    <motion.h2 className="reels-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}>
      Captured in<br />
      <span className="reels-heading-gradient">Motion</span>
    </motion.h2>

    <motion.p className="reels-subheading"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.32 }}>
      Short-form stories, long-lasting impressions.<br />
      Click Watch Reel to play.
    </motion.p>
  </motion.div>
);

// ─── Main Section ──────────────────────────────────────────────────────────────
const VISIBLE_COUNT = 3;

const ReelsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction,    setDirection]    = useState(1);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const total = REELS_DATA.length;

  const getVisible = (startIdx) =>
    Array.from({ length: VISIBLE_COUNT }, (_, i) => ({
      reel: REELS_DATA[(startIdx + i) % total],
      key:  (startIdx + i) % total,
    }));

  const navigate = (dir) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + dir * VISIBLE_COUNT + total) % total);
  };

  const containerVariants = {
    enter:  (dir) => ({ x: dir > 0 ? "6%" : "-6%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:   (dir) => ({ x: dir > 0 ? "-6%" : "6%", opacity: 0, transition: { duration: 0.35 } }),
  };

  return (
    <section className="reels-section" ref={sectionRef} aria-label="Instagram Reels Showcase">
      <div className="reels-bg-orb reels-bg-orb--left"  aria-hidden="true" />
      <div className="reels-bg-orb reels-bg-orb--right" aria-hidden="true" />
      <div className="reels-bg-grid"                    aria-hidden="true" />

      <div className="reels-inner">
        <SectionHeader inView={inView} />

        <div className="reels-carousel-wrapper">
          <button className="reels-arrow reels-arrow--left"
            onClick={() => navigate(-1)} aria-label="Previous reels" disabled={isAnimating}>
            <ArrowLeftIcon />
          </button>

          <div className="reels-track-overflow">
            <AnimatePresence initial={false} custom={direction} mode="wait"
              onExitComplete={() => setIsAnimating(false)}>
              <motion.div
                className="reels-track"
                key={currentIndex}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {getVisible(currentIndex).map(({ reel, key }, idx) => (
                  <ReelCard key={key} reel={reel} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="reels-arrow reels-arrow--right"
            onClick={() => navigate(1)} aria-label="Next reels" disabled={isAnimating}>
            <ArrowRightIcon />
          </button>
        </div>

        <div className="reels-dots" role="tablist" aria-label="Reel pages">
          {Array.from({ length: Math.ceil(total / VISIBLE_COUNT) }).map((_, i) => {
            const isActive = Math.floor(currentIndex / VISIBLE_COUNT) === i;
            return (
              <button key={i} role="tab" aria-selected={isActive}
                aria-label={`Go to page ${i + 1}`}
                className={`reels-dot ${isActive ? "reels-dot--active" : ""}`}
                onClick={() => {
                  if (!isAnimating) {
                    setDirection(i > Math.floor(currentIndex / VISIBLE_COUNT) ? 1 : -1);
                    setIsAnimating(true);
                    setCurrentIndex(i * VISIBLE_COUNT);
                  }
                }} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
