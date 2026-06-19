'use client'
import Image from 'next/image'

const galleryItems = [
  { id: 1, title: 'Beach Hang', sub: 'Vibes', img: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2, title: 'Chill Session', sub: 'Relax', img: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3, title: 'Sunset Vibes', sub: 'Golden', img: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4, title: 'Group Vibe', sub: 'Together', img: 'https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5, title: 'Sand Games', sub: 'Play', img: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6, title: 'Golden Hour', sub: 'Chill', img: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 7, title: 'Wave Watch', sub: 'Ocean', img: 'https://images.pexels.com/photos/1854897/pexels-photo-1854897.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 8, title: 'Connect', sub: 'Friends', img: 'https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 9, title: 'Beach Walk', sub: 'Stroll', img: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 10, title: 'Night Lights', sub: 'City', img: 'https://images.pexels.com/photos/1199590/pexels-photo-1199590.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 11, title: 'The Crew', sub: 'Squad', img: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 12, title: 'Good Times', sub: 'Vibes', img: 'https://images.pexels.com/photos/1300526/pexels-photo-1300526.jpeg?auto=compress&cs=tinysrgb&w=600' },
]

const tripled = [...galleryItems, ...galleryItems, ...galleryItems]

function GalleryCard({ item }) {
  return (
    <div
      className="group relative shrink-0 w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: '1px solid rgba(255,196,107,0.06)',
      }}
    >
      <Image
        src={item.img}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 256px, 288px"
        className="object-cover transition-all duration-500 group-hover:scale-110"
        style={{
          filter: 'grayscale(100%) brightness(0.7)',
        }}
      />

      {/* Hover override: remove grayscale and bump brightness */}
      <style>{`
        .group:hover > .gallery-img {
          filter: grayscale(0%) brightness(1) !important;
        }
      `}</style>

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 50%)',
      }} />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{
          color: '#FF8B14',
          fontFamily: "'Space Mono', monospace",
        }}>
          {item.sub}
        </p>
        <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#FFF7ED' }}>
          {item.title}
        </h3>
      </div>

      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{
        border: '1px solid rgba(242,106,10,0.3)',
        boxShadow: 'inset 0 0 30px rgba(242,106,10,0.1)',
      }} />
    </div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#050505' }}>

      {/* ── Header ── */}
      <div className="px-6 md:px-12 mb-10 md:mb-14 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #F26A0A, transparent)' }} />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#FF8B14' }}>
            Gallery
          </span>
        </div>
        <h2 className="leading-[0.85] tracking-tight" style={{
          fontFamily: "'Jorgey', sans-serif",
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: '#FFF7ED',
        }}>
          THE <span style={{
            background: 'linear-gradient(135deg, #F26A0A, #FFC46B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>VIBES</span>
        </h2>
      </div>

      {/* ── Row 1: Scroll Left ── */}
      <div className="relative mb-4">
        <div
          className="flex gap-4"
          style={{
            animation: 'scroll-left 40s linear infinite',
            width: 'max-content',
          }}
        >
          {tripled.map((item, i) => (
            <GalleryCard key={`r1-${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* ── Row 2: Scroll Right (offset) ── */}
      <div className="relative">
        <div
          className="flex gap-4"
          style={{
            animation: 'scroll-right 45s linear infinite',
            width: 'max-content',
            transform: 'translateX(-30%)',
          }}
        >
          {tripled.map((item, i) => (
            <GalleryCard key={`r2-${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* ── Fade edges ── */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 z-10" style={{
        background: 'linear-gradient(to right, #050505, transparent)',
      }} />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 z-10" style={{
        background: 'linear-gradient(to left, #050505, transparent)',
      }} />
    </section>
  )
}
