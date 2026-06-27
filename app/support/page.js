import Link from 'next/link'

export const metadata = {
  title: 'Help & Support | Turnt',
  description: 'Turnt Help & Support — assistance for our real-life community hangouts in Chennai.',
}

const sections = [
  {
    heading: '1. Welcome to Support',
    content: (
      <p className="m-0 p-0 mb-8">
        Turnt is built to get you off the screen and into high-energy, real-life community meetups across Chennai. 
        Whether you are prepping for your first beach hangout, looking to connect with members by name, 
        or trying to manage your registrations, we are here to help make your real-world transitions smooth and stress-free.
      </p>
    ),
  },
  {
    heading: '2. Event Access & RSVPs',
    content: (
      <div className="m-0 p-0 space-y-6 mb-8">
        <div>
          <strong className="text-white block text-lg font-bold mb-1">How do I find upcoming meetups?</strong>
          <p>All live meetups, beach gatherings, and interactive community spaces are posted directly on our primary platform dashboard.</p>
        </div>
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Do I need to honor my RSVP?</strong>
          <p>Yes. Because we focus on genuine, tightly knit person-to-person interactions, spots are highly limited. If you cannot attend, cancel your RSVP at least 24 hours in advance so another community member can claim the spot.</p>
        </div>
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Can I bring a friend?</strong>
          <p>To keep a balanced community vibe, everyone must register an individual account or claim an explicit guest pass through our event listing process.</p>
        </div>
      </div>
    ),
  },
  {
    heading: '3. Payments & Ticketing',
    content: (
      <div className="m-0 p-0 space-y-6 mb-8">
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Which payment gateway do you use?</strong>
          <p>All ticket sales and event registration fees are securely processed using industry-standard encryption via Razorpay.</p>
        </div>
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Are tickets refundable?</strong>
          <p>To ensure accurate planning with our venue partners, all ticket sales are final and non-refundable unless a meetup is officially cancelled or postponed by the Turnt organization team.</p>
        </div>
        <div>
          <strong className="text-white block text-lg font-bold mb-1">What if an event gets rained out?</strong>
          <p>Outdoor gatherings (like our beach meetups) are subject to weather. In cases of cancellation due to severe weather conditions, you will receive a notification via your registered contact channel with options to roll over your ticket or get a full refund.</p>
        </div>
      </div>
    ),
  },
  {
    heading: '4. Safety & Vibe Reports',
    content: (
      <div className="m-0 p-0 space-y-6 mb-8">
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Enforcing Code of Conduct</strong>
          <p>Turnt is an antidote to digital isolation, rooted strictly in mutual respect and safety. If you witness or experience harassment, safety violations, or disruptive behavior during any real-life meetup, please report it immediately to an on-site organizer.</p>
        </div>
        <div>
          <strong className="text-white block text-lg font-bold mb-1">Anonymous Incident Reporting</strong>
          <p>If you prefer to report an issue after an event concludes, you can email us safely and confidentially. We review all community conduct issues within 24 hours to keep our real-world spaces healthy.</p>
        </div>
      </div>
    ),
  },
]

export default function HelpSupportPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-between">
      
      {/* Orange & Yellow Ambient Lighting / Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[800px] rounded-full bg-[#F26A0A]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-15%] w-[900px] h-[800px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#F26A0A]/10 blur-[140px] pointer-events-none" />

      {/* Support Content Section with Background */}
      <div
        className="relative"
        style={{
          backgroundImage: 'url(/assets/prbg1.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-[#050505]/85 mix-blend-multiply pointer-events-none" />

        {/* Main Content Wrap */}
        <main className="relative z-10 px-6 md:px-12 lg:px-24 py-20 md:py-28 max-w-[1200px] mx-auto w-full flex-grow">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.2em] text-white/40 hover:text-[#F26A0A] transition-colors duration-300"
        >
          &larr; Back to Home
        </Link>

        {/* Large Bold Main Title */}
        <h1
          className="mt-10 mb-0 p-0 font-black uppercase text-[#F26A0A]"
          style={{ fontSize: 'calc(2.5rem + 2vw)', letterSpacing: '0.06em', lineHeight: '0.9' }}
        >
          Help & Support
        </h1>

        {/* Layout Wrapper: The first row content aligns immediately after the title header */}
        <div className="space-y-24 md:space-y-32 mt-16 md:mt-24">
          {sections.map((section) => (
            <div
              key={section.heading}
              className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-1 md:gap-12 items-start"
            >
              {/* Headings - Crisp heavy-weight sans-serif format with zero trailing vertical space */}
              <h2
                className="text-[#F26A0A] uppercase font-black tracking-wider p-0 m-0 block"
                style={{ fontSize: '1.5rem', lineHeight: '1.0' }}
              >
                {section.heading}
              </h2>
              
              {/* Content Body */}
              <div
                className="text-white/80 font-light p-0 m-0"
                style={{ fontSize: '1.2rem', lineHeight: '1.6' }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
        </main>
      </div>

      {/* Modern High-Contrast Centered Footer Block (Orange Background, Centered Text, Orange Headings) */}
      <footer className="relative z-10 bg-[#F26A0A] text-black px-6 md:px-12 lg:px-24 py-16 text-center">
        <center>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start text-center">
            
            <div>
              <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Turnt</h3>
              <p className="text-black/70 text-sm max-w-xs leading-relaxed mx-auto text-center">
                Curating community spaces, elite events, and high-energy interactive experiences.
              </p>
            </div>

            <div>
              <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-black/70 font-medium text-center">
                <li><Link href="/" className="hover:text-black hover:underline transition-colors">Home</Link></li>
                <li><Link href="/privacy" className="hover:text-black hover:underline transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-black hover:underline transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Contact Us</h3>
              <p className="text-black/80 text-base mb-2 text-center">Have privacy concerns or questions?</p>
              <a 
                href="mailto:turntclb@gmail.com" 
                className="text-xl font-bold text-black hover:opacity-80 underline decoration-black underline-offset-4 transition-colors text-center block mx-auto"
              >
                turntclb@gmail.com
              </a>
            </div>

          </div>
          
          {/* Copyright Timestamp Block */}
          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-black/10 text-center text-xs text-black/50 uppercase tracking-widest font-bold">
            &copy; 2026 Turnt Community. All rights reserved.
          </div>
        </center> 
      </footer>
    </div>
  )
}