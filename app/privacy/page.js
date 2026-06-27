import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Turnt',
  description: 'Turnt Privacy Policy — how we collect, use, and protect your data.',
}

const sections = [
  {
    heading: '1. Introduction',
    content: (
      <p className="m-0 p-0 mb-8">
        At Turnt, your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, 
        and how we protect it when you use our website, register for events, or participate in our community hangouts 
        across Chennai. We are dedicated to moving interactions away from endless scrolling and into real-life 
        person-to-person connections, and we treat your data with that same level of care and respect. By using Turnt, 
        you agree to the practices described in this policy.
      </p>
    ),
  },
  {
    heading: '2. Information We Collect',
    content: (
      <div className="m-0 p-0 space-y-6 mb-8">
        <p className="m-0 p-0">
          To foster an environment where people know each other by name, we collect specific details necessary to manage real-life community interactions:
        </p>
        <ul className="list-disc list-inside space-y-4 m-0 p-0">
          <li>
            <strong className="text-white font-bold">Personal Information:</strong> When you create an account, register for a meetup, or claim a spot, we collect information such as your full name, email address, WhatsApp/phone number, and Instagram handle to verify your profile and facilitate community coordination.
          </li>
          <li>
            <strong className="text-white font-bold">Payment Information:</strong> For events requiring a ticket registration fee, transactions are handled securely through our third-party provider, Razorpay. Turnt does not capture or store your debit/credit card credentials directly on our databases.
          </li>
          <li>
            <strong className="text-white font-bold">Usage Data:</strong> We gather essential usage details like pages visited, device models, and browser types strictly to improve platform performance.
          </li>
          <li>
            <strong className="text-white font-bold">Media Capture:</strong> Photos and videos captured during our real-life gatherings (like our beach meetups) may be processed for community highlights and social media recap features with your implied presence or explicit consent.
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: '3. How We Use Your Information',
    content: (
      <div className="m-0 p-0 space-y-4 mb-8">
        <p className="m-0 p-0">We use your data to make real-world meetups effortless and safe. Specifically, your data helps us:</p>
        <ul className="list-disc list-inside space-y-4 m-0 p-0">
          <li>Process and manage your event bookings, RSVPs, and ticket verifications.</li>
          <li>Send you critical real-life meetup updates, venue notifications, or severe weather changes.</li>
          <li>Connect you directly with the Turnt community network and localized hosting staff.</li>
          <li>Keep our spaces safe by monitoring accountability patterns and investigating community conduct flag reports.</li>
        </ul>
      </div>
    ),
  },
  {
    heading: '4. Third-Party Services',
    content: (
      <div className="m-0 p-0 space-y-4 mb-8">
        <p className="m-0 p-0">
          We do not sell, rent, or trade your personal data to third parties under any circumstances. We share necessary operational data only with trusted infrastructure partners to keep the community running:
        </p>
        <ul className="list-disc list-inside space-y-4 m-0 p-0">
          <li><strong className="text-white font-bold">Supabase:</strong> Used to process secure database storage, cloud infrastructure, and account authentication protocols.</li>
          <li><strong className="text-white font-bold">Razorpay:</strong> Used to manage all commercial ticketing transactions and secure payment checkouts.</li>
        </ul>
        <p className="m-0 p-0">
          These partners are bound by their respective privacy parameters and are not permitted to use your information for unsolicited commercial marketing.
        </p>
      </div>
    ),
  },
  {
    heading: '5. Cookies',
    content: (
      <p className="m-0 p-0 mb-8">
        We utilize essential cookies and basic session tokens to verify your login status and optimize local site load times. 
        We may use anonymous analytics tools to track aggregate navigation traffic patterns. You can modify your tracking 
        settings directly through your browser; however, dropping essential cookies may limit your ability to remain logged in 
        or process event registrations cleanly.
      </p>
    ),
  },
  {
    heading: '6. Data Security',
    content: (
      <p className="m-0 p-0 mb-8">
        We employ industry-standard safety configurations—including encrypted connections (HTTPS), restricted internal 
        database access controls, and secure authentication flows via Supabase—to protect your files against data loss 
        or unauthorized access. Please note, however, that no method of transmission over the internet or cloud storage 
        network is 100% secure.
      </p>
    ),
  },
  {
    heading: '7. Your Rights',
    content: (
      <p className="m-0 p-0 mb-8">
        You hold complete ownership of your personal profile details. At any time, you have the right to look over the 
        information we store, correct inaccuracies, or request the total deletion of your profile data. To opt out of any 
        community notifications or request an immediate account deletion, please link up with our support team using our 
        explicit support channels.
      </p>
    ),
  },
  {
    heading: '8. Contact Us',
    content: (
      <p className="m-0 p-0 mb-8">
        If you have any questions, security concerns, or privacy feedback regarding our data rules, drop a line directly 
        to our inbox at{' '}
        <a href="mailto:turntclb@gmail.com" className="hover:underline text-white font-bold decoration-[#F26A0A] underline-offset-4">
          turntclb@gmail.com
        </a>.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Orange & Yellow Ambient Lighting / Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[800px] rounded-full bg-red-500/10 blur-[130px]" />
        <div className="absolute top-[40%] left-[-15%] w-[900px] h-[800px] rounded-full bg-yellow-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full bg-red-500/10 blur-[140px]" />
      </div>

      {/* Privacy Policy Content Section with Background */}
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
            className="text-sm uppercase tracking-[0.2em] text-white/40 hover:text-black transition-colors duration-300"
          >
            &larr; Back to Home
          </Link>

          {/* Large Bold Main Title */}
          <h1
            className="mt-10 mb-0 p-0 font-black uppercase text-[#F26A0A]"
            style={{ fontSize: 'calc(2.5rem + 2vw)', letterSpacing: '0.06em', lineHeight: '0.9' }}
          >
            Privacy Policy
          </h1>

          {/* Layout Wrapper */}
          <div className="space-y-24 md:space-y-32 mt-16 md:mt-24">
            {sections.map((section) => (
              <div
                key={section.heading}
                className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-1 md:gap-12 items-start"
              >
                {/* Headings */}
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

      {/* Modern High-Contrast Centered Footer Block */}
      <footer className="relative z-10 bg-[#E05305] text-black px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start text-center md:text-left">
            
            {/* Column 1: Brand Info */}
            <div>
              <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Turnt</h3>
              <p className="text-black/70 text-sm max-w-xs leading-relaxed mx-auto md:mx-0">
                Curating community spaces, elite events, and high-energy interactive experiences.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
            <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-black/70 font-medium">
                <li><Link href="/" className="hover:text-black hover:underline transition-colors">Home</Link></li>
                <li><Link href="/terms" className="hover:text-black hover:underline transition-colors">Terms of Service</Link></li>
                <li><Link href="/support" className="hover:text-black hover:underline transition-colors">Help & Support</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="text-black text-lg font-black uppercase tracking-wider mb-4">Contact Us</h3>
              <p className="text-black/80 text-base mb-2">Have privacy concerns or questions?</p>
              <a 
                href="mailto:turntclb@gmail.com" 
                className="text-xl font-bold text-black hover:opacity-80 underline decoration-black underline-offset-4 transition-colors block"
              >
                turntclb@gmail.com
              </a>
            </div>

          </div>
          
          {/* Copyright Timestamp Block */}
          <div className="mt-12 pt-8 border-t border-black/10 text-center text-xs text-black/50 uppercase tracking-widest font-bold">
            &copy; 2026 Turnt Community. All rights reserved.
          </div>
          
        </div>
      </footer>
    </div>
  )
}