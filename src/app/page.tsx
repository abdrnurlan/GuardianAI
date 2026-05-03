import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import OpenSourceCTA from "@/components/OpenSourceCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-[#DC2626]/30 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <OpenSourceCTA />
      <Footer />
    </main>
  );
}
