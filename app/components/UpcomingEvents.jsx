'use client'
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { supabase } from "@/lib/supabaseClient";

/* ─── Fallback event data ─── */
const FALLBACK_EVENTS = [
  {
    id: "fallback-1",
    name: "Sunburn Meet-up",
    subtitle: "good vibes only",
    date: "Saturday, 12th July",
    time: "5:00 – 8:00 AM",
    location: "Bessyy",
    locationFull: "Besant Nagar Beach, Chennai",
    status: "open",
    statusLabel: "Registration Open",
    tag: "FREE · OPEN TO ALL",
    about: "A chill evening by the waves. Good vibes, good people, no boring scenes.",
    accent: "#FF6B00",
    posterLabel: "SUNSET\nBEACH",
    bgWord: "TURNT",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  },
];

const ACCENTS = ["#FF6B00", "#E85D04", "#FF9500", "#F26A0A", "#FF8B14", "#FFC46B"];

function formatDbEvent(dbEvent, index) {
  const dt = new Date(dbEvent.date_time);
  const dateStr = dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = dt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const accent = ACCENTS[index % ACCENTS.length];
  const nameUpper = dbEvent.name.toUpperCase();
  const words = nameUpper.split(" ");
  const posterLabel = words.length > 2
    ? words.slice(0, Math.ceil(words.length / 2)).join(" ") + "\n" + words.slice(Math.ceil(words.length / 2)).join(" ")
    : nameUpper.replace(" ", "\n");
  return {
    id: dbEvent.id,
    name: dbEvent.name,
    subtitle: "good vibes only",
    date: dateStr,
    time: timeStr,
    location: dbEvent.venue.split(",")[0].trim(),
    locationFull: dbEvent.venue,
    status: "open",
    statusLabel: "Registration Open",
    tag: dbEvent.ticket_price === 0 ? "FREE · OPEN TO ALL" : "OPEN TO ALL",
    about: dbEvent.description,
    accent,
    posterLabel,
    bgWord: "TURNT",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    regLink: dbEvent.reg_link,
    dbId: dbEvent.id,
  };
}

function useKeyPress(key, handler) {
  useEffect(() => {
    const fn = (e) => { if (e.key === key) handler(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [key, handler]);
}

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   FeaturedDropCard
═══════════════════════════════════════════════════════════ */
function FeaturedDropCard({ event, user, interests, onInterested }) {
  const [hovered, setHovered] = useState(false);
  const [savingInterest, setSavingInterest] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isInterested = interests.has(event.dbId || event.id);
  const { accent } = event;

  const handleInterested = async () => {
    if (!user) {
      router.push('/login?returnTo=' + encodeURIComponent(pathname));
      return;
    }
    if (savingInterest || isInterested) return;
    setSavingInterest(true);
    await onInterested(event.dbId || event.id);
    setSavingInterest(false);
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden transition-all duration-500 cursor-default"
      style={{
        border: `1px solid ${hovered ? `${accent}44` : 'rgba(255,196,107,0.06)'}`,
        background: '#0A0A0A',
        boxShadow: hovered
          ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}22, 0 0 60px ${accent}12`
          : '0 16px 48px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Section ── */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700"
          style={{
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.4) 40%, transparent 60%),
                         radial-gradient(ellipse 60% 40% at 50% 80%, ${accent}33 0%, transparent 70%)`,
          }}
        />

        {/* Top badges */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div
            className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: '#fff',
              boxShadow: `0 4px 16px ${accent}44`,
            }}
          >
            <SparkleIcon /> FEATURED DROP
          </div>
        </div>

        <div className="absolute top-5 right-5">
          <div
            className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(10,10,10,0.7)',
              border: '1px solid rgba(255,196,107,0.15)',
              color: 'rgba(255,244,230,0.7)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {event.tag}
          </div>
        </div>

        {/* Bottom date strip */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
          <div>
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
              style={{ color: accent }}
            >
              {event.date}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Jorgey', sans-serif",
                color: '#FFF7ED',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {event.name}
            </h2>
          </div>
          <div
            className="text-right shrink-0 ml-4"
          >
            <p
              className="text-2xl md:text-3xl font-bold"
              style={{
                fontFamily: "'Jorgey', sans-serif",
                color: accent,
              }}
            >
              {event.time}
            </p>
          </div>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="p-5 md:p-7">
        {/* Location + Status row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm" style={{ color: 'rgba(255,244,230,0.6)' }}>
              {event.locationFull}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade8066',
              }}
            />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#4ade80' }}>
              {event.statusLabel}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm md:text-base leading-relaxed mb-6"
          style={{ color: 'rgba(255,244,230,0.5)' }}
        >
          {event.about}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="group flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: '#fff',
              boxShadow: `0 8px 32px ${accent}33`,
            }}
            onClick={() => {
              if (event.regLink) {
                window.open(event.regLink, '_blank', 'noopener,noreferrer');
              } else {
                router.push('/eventbooking?eventId=' + event.id);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = `0 16px 48px ${accent}55`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = `0 8px 32px ${accent}33`
            }}
          >
            <SparkleIcon />
            Register Now
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>

          <button
            onClick={handleInterested}
            disabled={savingInterest}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
            style={{
              border: `2px solid ${isInterested ? accent : 'rgba(255,255,255,0.1)'}`,
              background: isInterested ? `${accent}15` : 'transparent',
              color: isInterested ? accent : 'rgba(255,244,230,0.5)',
              boxShadow: isInterested ? `0 0 20px ${accent}22` : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isInterested) {
                e.currentTarget.style.borderColor = `${accent}55`
                e.currentTarget.style.color = accent
                e.currentTarget.style.background = `${accent}08`
              }
            }}
            onMouseLeave={(e) => {
              if (!isInterested) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,244,230,0.5)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <HeartIcon filled={isInterested} />
            {isInterested ? 'Saved' : 'Interested'}
          </button>
        </div>
      </div>

      {/* ── Glow border effect on hover ── */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          border: `1px solid ${accent}22`,
          boxShadow: `inset 0 0 40px ${accent}08`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   UpcomingEvents (root)
═══════════════════════════════════════════════════════════ */
export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState(new Set());
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      const { data: dbEvents, error } = await supabase
        .from('events')
        .select('id, name, description, date_time, venue, reg_link')
        .order('date_time', { ascending: true });
      if (!error && dbEvents && dbEvents.length > 0) {
        setEvents(dbEvents.map((e, i) => formatDbEvent(e, i)));
      } else {
        setEvents(FALLBACK_EVENTS);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) { setInterests(new Set()); return; }
    async function fetchInterests() {
      const { data } = await supabase
        .from('event_interests')
        .select('event_id')
        .eq('user_id', user.id);
      if (data) setInterests(new Set(data.map((r) => r.event_id)));
    }
    fetchInterests();
  }, [user]);

  const handleInterested = async (eventId) => {
    if (!user) {
      router.push('/login?returnTo=' + encodeURIComponent(pathname));
      return;
    }
    const { error } = await supabase.rpc('add_event_interest', { p_event_id: eventId });
    if (!error) setInterests((prev) => new Set([...prev, eventId]));
  };

  const go = useCallback(
    (next, direction) => {
      if (animating || next === active) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(next);
        setAnimating(false);
      }, 500);
    },
    [animating, active]
  );

  const goNext = () => go((active + 1) % events.length, 1);
  const goPrev = () => go((active - 1 + events.length) % events.length, -1);

  useKeyPress("ArrowRight", goNext);
  useKeyPress("ArrowLeft", goPrev);

  if (loading) {
    return (
      <section id="upcoming" className="py-24 px-6" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36,
            border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#FF6B00',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,244,230,0.35)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Loading events...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  const event = events[active];

  return (
    <section
      ref={sectionRef}
      id="upcoming"
      className="relative py-20 md:py-28 px-6 md:px-12"
      style={{ background: '#050505' }}
    >
      {/* ── Ambient glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 60%, ${event.accent}10 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${event.accent}, transparent)` }} />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: event.accent }}
            >
              Upcoming Events
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h2
              className="leading-[0.85] tracking-tight"
              style={{
                fontFamily: "'Jorgey', sans-serif",
                fontSize: 'clamp(40px, 8vw, 80px)',
                color: '#FFF7ED',
              }}
            >
              What's <em style={{ color: event.accent, fontStyle: 'normal' }}>Next</em>
            </h2>

            {events.length > 1 && (
              <div className="flex items-center gap-2 pb-2">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{
                    border: '1px solid rgba(255,196,107,0.1)',
                    background: 'rgba(10,10,10,0.6)',
                    color: 'rgba(255,244,230,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${event.accent}44`
                    e.currentTarget.style.color = event.accent
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,196,107,0.1)'
                    e.currentTarget.style.color = 'rgba(255,244,230,0.5)'
                  }}
                  aria-label="Previous event"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <span className="text-xs font-bold tabular-nums" style={{ color: 'rgba(255,244,230,0.3)', minWidth: '40px', textAlign: 'center' }}>
                  {String(active + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
                </span>
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{
                    border: '1px solid rgba(255,196,107,0.1)',
                    background: 'rgba(10,10,10,0.6)',
                    color: 'rgba(255,244,230,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${event.accent}44`
                    e.currentTarget.style.color = event.accent
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,196,107,0.1)'
                    e.currentTarget.style.color = 'rgba(255,244,230,0.5)'
                  }}
                  aria-label="Next event"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Featured Card ── */}
        <div>
          <FeaturedDropCard
            event={event}
            user={user}
            interests={interests}
            onInterested={handleInterested}
          />
        </div>

        {/* ── Dots ── */}
        {events.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {events.map((_, i) => (
              <button
                key={i}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === active ? 32 : 8,
                  background: i === active ? event.accent : 'rgba(255,255,255,0.15)',
                  boxShadow: i === active ? `0 0 12px ${event.accent}44` : 'none',
                }}
                onClick={() => go(i, i > active ? 1 : -1)}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
