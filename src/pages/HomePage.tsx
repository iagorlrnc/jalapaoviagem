import { Navbar } from '../components/Navbar'
import { HeroSection } from '../components/HeroSection'
import { DestinationsSection } from '../components/DestinationsSection'
import { TripsSection } from '../components/TripsSection'
import { AboutSection } from '../components/AboutSection'
import { ContactSection, Footer } from '../components/ContactSection'
import { FloatingWhatsApp } from '../components/FloatingWhatsApp'

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0e0a]">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <TripsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
