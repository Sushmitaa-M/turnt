import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Turnt',
  description: 'Turnt Terms of Service — rules and guidelines for our real-life community hangouts.',
}

const sections = [
  {
    heading: '1. Acceptance of Terms',
    content: (
      <p className="m-0 p-0 mb-8">
        By accessing our platform, registering for events, or participating in Turnt community activities, 
        you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. 
        Turnt is built to foster real-life, high-energy community hangouts in Chennai, moving interactions 
        away from digital screens and into face-to-face connections. If you do not agree to these terms, 
        you may not participate in our community or events.
      </p>
    ),
  },
  {
    heading: '2. Community Code of Conduct',
    content: (
      <div className="m-0 p-0">
        <p className="m-0 p-0 mb-4">
          Turnt is built on presence, genuine interaction, and good vibes. To maintain a safe space where 
          people know each other by name, all members and attendees must strictly adhere to the following rules during gatherings:
        </p>
        <ul className="list-disc list-inside space-y-4 m-0 p-0 mb-8">
          <li>Treat every community member, host, and venue staff with respect and dignity.</li>
          <li>Zero tolerance for harassment, discrimination, bullying, or aggressive behaviors of any kind.</li>
          <li>Respect the personal boundaries, physical space, and privacy of fellow attendees.</li>
          <li>Follow all venue-specific protocols and instructions given by Turnt organizers during meet-ups.</li>
        </ul>
      </div>
    ),
  },
  {
    heading: '3. Real-Life Events & Registrations',
    content: (
      <p className="m-0 p-0 mb-8">
        When you RSVP or purchase a ticket for a Turnt meetup (including beach meet-ups, mixers, or social gatherings), 
        your spot is reserved exclusively for you. Because our focus is on moving past endlessly postponed plans to 
        actually showing up, we expect members to honor their RSVPs. Repeated failure to show up after claiming a limited 
        spot may result in suspension from future event registrations.
      </p>
    ),
  },
  {
    heading: '4. Ticketing & Refund Policy',
    content: (
      <p className="m-0 p-0 mb-8">
        All paid event bookings are securely processed through our third-party payment partner, Razorpay. 
        Unless explicitly stated otherwise on the specific event description page, all ticket purchases are final and 
        non-refundable. In the event that a meetup is completely cancelled or rescheduled by Turnt due to unexpected 
        circumstances (such as extreme weather or venue issues), options for a transfer or a full refund will be provided.
      </p>
    ),
  },
  {
    heading: '5. Assumption of Risk & Physical Safety',
    content: (
      <p className="m-0 p-0 mb-8">
        Turnt coordinates events in public and private spaces across Chennai, including outdoor beach meet-ups and indoor venues. 
        By attending a real-life meetup, you acknowledge that you are voluntarily participating at your own discretion. 
        You assume all standard risks associated with social gatherings and outdoor environments. Turnt, its organizers, 
        and affiliates are not legally liable for any personal injury, medical emergency, property loss, or damage occurring 
        during our meetups.
      </p>
    ),
  },
  {
    heading: '6. Media & Content Release',
    content: (
      <p className="m-0 p-0 mb-8">
        To capture true community energy and share real-life highlights, professional photography and video recording 
        may take place at Turnt meetups. By attending, you grant Turnt the right to use your likeness in recap reels, 
        social media announcements, and platform imagery. If you prefer not to be captured on camera, please notify 
        our organizing team explicitly at the start of the event.
      </p>
    ),
  },
  {
    heading: '7. Account Discretion & Termination',
    content: (
      <p className="m-0 p-0 mb-8">
        We reserve the right to remove any individual from an ongoing meetup or permanently ban them from the Turnt platform 
        and community updates if they compromise the safety, vibe, or well-being of our members. Our decision in maintaining 
        a healthy community environment remains final.
      </p>
    ),
  },
  {
    heading: '8. Contact Us',
    content: (
      <p className="m-0 p-0 mb-8">
        If you have any questions, behavior reports, or need clarity regarding these community terms, loop us in directly at{' '}
        <a href="mailto:turntclb@gmail.com" className="hover:underline text-white font-bold decoration-[#F26A0A] underline-offset-4">
          turntclb@gmail.com
        </a>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-between">
      
      {/* Orange & Yellow Ambient Lighting / Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[800px] rounded-full bg-[#F26A0A]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-15%] w-[900px] h-[800px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#F26A0A]/10 blur-[140px] pointer-events-none" />

      {/* Terms Content Section with Background */}
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
          Terms of Service
        </h1>

        {/* Layout Wrapper */}
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

      {/* Modern High-Contrast Footer Block (Orange Background, Centered Text, Orange Headings) */}
<footer className="relative z-10 bg-[#F26A0A] text-black px-6 md:px-12 lg:px-24 py-16 text-center">
  <center>
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start text-center">
      
      <div>
        {/* Changed text-black to text-[#F26A0A] */}
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
                <li><Link href="/support" className="hover:text-black hover:underline transition-colors">Help & Support</Link></li>
              </ul>
      </div>

      <div>
        {/* Changed text-black to text-[#F26A0A] */}
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