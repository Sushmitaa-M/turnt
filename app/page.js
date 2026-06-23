import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Marquee from './components/Marquee'
import UpcomingEvents from './components/UpcomingEvents'
import Gallery from './components/Gallery'
import About from './components/About'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      <HeroSection />
      <Marquee />
      <UpcomingEvents />
      <Gallery />
      <About />
      <Contact />
      <Feedback />
      <FAQ />
      <Footer />
    </main>
  )
}
