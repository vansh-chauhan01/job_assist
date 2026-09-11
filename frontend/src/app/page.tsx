import Navbar from '@/components/LandingPageNavbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Working from '@/components/Working';
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Working />
      <Footer />
    </main>
  );
}