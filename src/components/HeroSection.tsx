import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";


const HeroSection = () => {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden pb-32 md:pb-0">
      <AnimatedBackground />



      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/5 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-up">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-wider text-accent/90 uppercase border border-accent/30 rounded-full">
            Professional Statistician & Data Analyst
          </span>
        </div>

        <h1 className="animate-fade-up-delay font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          Dr. Omar <span className="text-gradient">Ghanem</span>
        </h1>

        <p className="animate-fade-up-delay-2 max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
          Transforming research data into published success. 5+ years helping researchers
          and PhD students achieve their publication goals in prestigious Q1 journals.
        </p>

        <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="xl" onClick={scrollToContact}>
            <Mail className="w-5 h-5" />
            Let's Connect
          </Button>
          <Button variant="heroOutline" size="xl" onClick={scrollToAbout}>
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <button
          onClick={scrollToAbout}
          className="p-3 rounded-full border border-accent/30 text-accent/70 hover:text-accent hover:border-accent transition-colors"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
