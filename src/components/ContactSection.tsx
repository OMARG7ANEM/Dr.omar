import ContactForm from "@/components/ContactForm";
import { Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider text-accent uppercase bg-accent/10 rounded-full">
              Get In Touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="text-gradient">Elevate</span> Your Research?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Let's discuss how I can help you achieve your publication goals 
              and take your research to the next level.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact form */}
            <ContactForm />

            {/* Contact info */}
            <div className="space-y-8">
              <div className="p-8 bg-hero-gradient rounded-2xl text-primary-foreground">
                <h3 className="font-display text-2xl font-bold mb-4">
                  Let's Connect
                </h3>
                <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                  I'm always excited to discuss new research projects and help 
                  fellow academics achieve their publication goals. Whether you're 
                  working on a systematic review, need statistical consultation, 
                  or want guidance on your PhD research, I'm here to help.
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Send className="w-5 h-5 text-accent" />
                  <span className="text-sm text-primary-foreground/80">
                    Usually responds within 24 hours
                  </span>
                </div>

                <Button variant="heroOutline" size="lg" asChild className="w-full">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-card rounded-xl border border-border/50 text-center">
                  <div className="text-3xl font-display font-bold text-foreground mb-1">
                    24h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Time
                  </div>
                </div>
                <div className="p-6 bg-card rounded-xl border border-border/50 text-center">
                  <div className="text-3xl font-display font-bold text-foreground mb-1">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidential
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
