import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-primary border-t border-border/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-display text-xl font-bold text-primary-foreground">
            Dr. Omar <span className="text-gradient">Ghanem</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-sm text-primary-foreground/60">
              © {currentYear} All rights reserved. Professional Statistical Consulting.
            </div>
            <Link
              to="/login"
              className="text-primary-foreground/40 hover:text-accent transition-colors"
              title="Admin Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
