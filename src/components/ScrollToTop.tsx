import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                onClick={scrollToTop}
                size="icon"
                className="rounded-full shadow-lg bg-accent hover:bg-accent/90 text-white h-12 w-12 transition-all hover:-translate-y-1"
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </Button>
        </div>
    );
};
