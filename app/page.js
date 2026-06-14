import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import UpcomingEvents from './components/UpcomingEvents'
import Gallery from './components/Gallery'
import ReelsSection from './components/Reelssection'
import Reviews from './components/Reviews'
import About from './components/About'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <UpcomingEvents />
      <Gallery />
      <ReelsSection />
      <Reviews />
      <About />
      <Contact />
      <Feedback />
      <FAQ />
      <Footer />
    </>
  )
}
