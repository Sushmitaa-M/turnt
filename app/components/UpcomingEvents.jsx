'use client'
import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/UpcomingEvents.css";
import { useRouter } from 'next/navigation'

/* ─── Event data ─────────────────────────────────────────── */
const EVENTS = [
  {
    id: 1,
    week: "WEEK 12",
    name: "Saturday Run",
    subtitle: "ft. nxtface",
    date: "Saturday, 7th June",
    time: "6:00 – 8:00 AM",
    location: "Bessyy",
    locationFull: "Besant Nagar Beach, Chennai",
    status: "open",
    statusLabel: "Registration Open",
    tag: "FREE · OPEN TO ALL",
    about:
      "A chill run w games — waves & vibes, 3km run and amazing games. We're definitely getting inside the water and stuff!!",
    accent: "#FF6B00",
    posterLabel: "SATURDAY\nRUN",
    bgWord: "ANVA",
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    week: "WEEK 13",
    name: "Sunset Sprint",
    subtitle: "ft. djwave",
    date: "Sunday, 15th June",
    time: "5:30 – 7:30 AM",
    location: "Elliot's Beach",
    locationFull: "Elliot's Beach, Besant Nagar",
    status: "soon",
    statusLabel: "Opening Soon",
    tag: "FREE · OPEN TO ALL",
    about:
      "Golden hour run along the shore. Feel the breeze, hit your PR, and catch the sunrise with the crew.",
    accent: "#E85D04",
    posterLabel: "SUNSET\nSPRINT",
    bgWord: "VOLT",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    week: "WEEK 14",
    name: "Night Miles",
    subtitle: "ft. bassline",
    date: "Saturday, 21st June",
    time: "8:00 – 10:00 PM",
    location: "Marina Walk",
    locationFull: "Marina Beach Promenade, Chennai",
    status: "open",
    statusLabel: "Registration Open",
    tag: "FREE · OPEN TO ALL",
    about:
      "Run under the city lights. Neon wristbands, ambient beats, and the longest beach stretch — all yours.",
    accent: "#FF9500",
    posterLabel: "NIGHT\nMILES",
    bgWord: "NITE",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&auto=format&fit=crop&q=80",
  },
];

/* ─── Keyboard hook ──────────────────────────────────────── */
function useKeyPress(key, handler) {
  useEffect(() => {
    const fn = (e) => { if (e.key === key) handler(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [key, handler]);
}

/* ─── Icons ──────────────────────────────────────────────── */
const CalIcon = ({ accent }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PinIcon = ({ accent }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ accent }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   EventPoster
══════════════════════════════════════════════════════════ */
function EventPoster({ event, animating, dir }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [event.id]);

  const entered = mounted && !animating;
  const { accent } = event;

  return (
    <div className="ue-poster">
      {/* Real event photo */}
      <img
        src={event.image}
        alt={event.name}
        className="ue-poster-bg-img"
      />

      {/* Large background word */}
      <div
        className={`ue-poster-bg-word${entered ? " entered" : ""}`}
        style={{
          transform: entered
            ? "translate(-50%,-50%) scale(1)"
            : `translate(-50%,-50%) scale(${dir > 0 ? 1.15 : 0.85})`,
        }}
      >
        {event.bgWord}
      </div>

      {/* Gradient overlay */}
      <div
        className="ue-poster-grad"
        style={{
          background: `linear-gradient(to top, #0a0a0a 0%, transparent 60%),
                       radial-gradient(ellipse 80% 60% at 50% 100%, ${accent}33 0%, transparent 70%)`,
        }}
      />

      {/* Week chip */}
      <div
        className={`ue-week-chip${entered ? " entered" : ""}`}
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        {event.week}
      </div>

      {/* Giant title */}
      <div
        className={`ue-poster-title${entered ? " entered" : ""}`}
        style={{
          color: accent,
          transform: entered ? "none" : `translateX(${dir > 0 ? 60 : -60}px)`,
        }}
      >
        {event.posterLabel.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Subtitle */}
      <div className={`ue-poster-sub${entered ? " entered" : ""}`}>
        {event.subtitle}
      </div>

      {/* Date bar */}
      <div className={`ue-poster-date-bar${entered ? " entered" : ""}`}>
        <span className="date-bold">{event.date.toUpperCase()}</span>
        <span className="date-time">{event.time}</span>
      </div>

      {/* Location chip */}
      <div className={`ue-poster-location-chip${entered ? " entered" : ""}`}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {event.location}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   InfoPanel
══════════════════════════════════════════════════════════ */
function InfoPanel({ event, animating, dir }) {
  const [mounted, setMounted] = useState(false);
  const [regHover, setRegHover] = useState(false);
  const router = useRouter()
  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [event.id]);

  const entered = mounted && !animating;
  const { accent } = event;

  const metaRows = [
    {
      Icon: CalIcon,
      label: event.date,
      sub: event.time,
      delayClass: "delay-22",
      transitionDelay: "0.22s",
    },
    {
      Icon: PinIcon,
      label: event.location,
      sub: event.locationFull,
      delayClass: "delay-28",
      transitionDelay: "0.28s",
    },
    {
      Icon: ClockIcon,
      label: event.statusLabel,
      sub: "Spots available",
      isStatus: true,
      open: event.status === "open",
      transitionDelay: "0.34s",
    },
  ];

  return (
    <div className="ue-info-panel">

      {/* Event name */}
      <div style={{ overflow: "hidden" }}>
        <h3
          className={`ue-event-name${entered ? " entered" : ""}`}
          style={{
            transform: entered ? "none" : `translateY(${dir > 0 ? 48 : -48}px)`,
          }}
        >
          {event.name}
        </h3>
      </div>

      {/* Free tag */}
      <div className={`ue-tag-pill${entered ? " entered" : ""}`}>
        {event.tag}
      </div>

      {/* Meta list */}
      <div className="ue-meta-list">
        {metaRows.map(({ Icon, label, sub, isStatus, open, transitionDelay }, i) => (
          <div
            key={i}
            className={`ue-meta-row${entered ? " entered" : ""}`}
            style={{ transitionDelay }}
          >
            <div
              className="ue-meta-icon"
              style={{ borderColor: `${accent}33` }}
            >
              <Icon accent={accent} />
            </div>
            <div>
              <div className="ue-meta-label">
                {label}
                {isStatus && (
                  <span
                    className="ue-status-dot"
                    style={{
                      background: open ? "#4ade80" : "#fb923c",
                      boxShadow: `0 0 6px ${open ? "#4ade8066" : "#fb923c66"}`,
                    }}
                  />
                )}
              </div>
              <div className="ue-meta-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className={`ue-about${entered ? " entered" : ""}`}>
        <div className="ue-about-label">About</div>
        <p className="ue-about-text">{event.about}</p>
      </div>

      {/* Register CTA */}
      <div className={`ue-reg-wrap${entered ? " entered" : ""}`}>
        <button
          className="ue-reg-btn"
          style={{
            background: regHover
              ? `linear-gradient(135deg, ${accent}ee, ${accent})`
              : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            boxShadow: regHover
              ? `0 16px 48px ${accent}55`
              : `0 8px 32px ${accent}33`,
            transform: regHover ? "translateY(-3px) scale(1.01)" : "none",
          }}
          onMouseEnter={() => setRegHover(true)}
          onMouseLeave={() => setRegHover(false)}
          onClick={()=>router.push('/eventbooking?eventId=' + event.id)}
        >
          <span>Register Now</span>
          <span className="ue-reg-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   UpcomingEvents (root)
══════════════════════════════════════════════════════════ */
export default function UpcomingEvents() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  /* Intersection reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Navigation */
  const go = useCallback(
    (next, direction) => {
      if (animating || next === active) return;
      setDir(direction);
      setPrev(active);
      setAnimating(true);
      setTimeout(() => {
        setActive(next);
        setPrev(null);
        setAnimating(false);
      }, 650);
    },
    [animating, active]
  );

  const goNext = () => go((active + 1) % EVENTS.length, 1);
  const goPrev = () => go((active - 1 + EVENTS.length) % EVENTS.length, -1);

  useKeyPress("ArrowRight", goNext);
  useKeyPress("ArrowLeft", goPrev);

  const event = EVENTS[active];

  return (
    <section ref={sectionRef} className="ue-section">

      {/* Ambient colour glow */}
      <div
        className="ue-ambient-glow"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${event.accent}22 0%, transparent 70%)`,
        }}
      />

      {/* ── Header ── */}
      <div className={`ue-header${revealed ? " revealed" : ""}`}>
        <div className="ue-header-left">
          <span className="ue-eyebrow">UPCOMING EVENTS</span>
          <h2 className="ue-section-title">
            What's
            <br />
            <em style={{ color: event.accent }}>Next</em>
          </h2>
        </div>

        <div className="ue-nav-controls">
          <button className="ue-nav-btn" onClick={goPrev} aria-label="Previous event">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="ue-counter">
            <span className="ue-counter-active" style={{ color: event.accent }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="ue-counter-sep">/</span>
            <span className="ue-counter-total">
              {String(EVENTS.length).padStart(2, "0")}
            </span>
          </div>

          <button className="ue-nav-btn" onClick={goNext} aria-label="Next event">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Showcase ── */}
      <div className={`ue-showcase${revealed ? " revealed" : ""}`}>

        {/* Poster column */}
        <div className="ue-poster-wrap">
          <EventPoster event={event} animating={animating} dir={dir} />

          {/* Dot navigation */}
          <div className="ue-dots">
            {EVENTS.map((_, i) => (
              <button
                key={i}
                className="ue-dot"
                aria-label={`Go to event ${i + 1}`}
                onClick={() => go(i, i > active ? 1 : -1)}
                style={{
                  width: i === active ? 28 : 8,
                  background:
                    i === active ? event.accent : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Info panel column */}
        <InfoPanel event={event} animating={animating} dir={dir} />
      </div>
    </section>
  );
}