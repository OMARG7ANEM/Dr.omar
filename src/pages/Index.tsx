import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import PortfolioSection from "@/components/PortfolioSection";

import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <section id="home">
        <HeroSection />
      </section>
      <AboutSection />
      <SkillsSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
