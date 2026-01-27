import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
    { name: "Home", href: "#home" }, // Hero section usually doesn't have an ID, I'll need to add it or assumes top
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
];

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll("section[id]").forEach((section) => {
            observer.observe(section);
        });

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 py-3 md:px-6 md:py-4",
                scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-transparent"
            )}
        >
            <div className="w-full flex items-center justify-between">
                <a
                    href="#home"
                    className="text-lg md:text-xl font-display font-bold text-accent dark:text-foreground transition-colors"
                    onClick={(e) => scrollToSection(e, "#home")}
                >
                    Dr. Ghanem
                </a>

                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-6">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-accent relative py-1",
                                        activeSection === item.href.substring(1)
                                            ? "text-accent"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.name}
                                    {activeSection === item.href.substring(1) && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full animate-fade-in" />
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ThemeToggle />
                </div>

                {/* Mobile menu could go here, for now keeping it simple for desktop */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 text-accent bg-accent/10 hover:bg-accent/20 border border-accent/30">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[80%] sm:w-[385px] pt-12">
                            <nav className="flex flex-col gap-6">
                                {navItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            scrollToSection(e, item.href);
                                        }}
                                        className={cn(
                                            "text-lg font-medium transition-colors hover:text-accent",
                                            activeSection === item.href.substring(1)
                                                ? "text-accent"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
