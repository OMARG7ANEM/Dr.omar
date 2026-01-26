import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch if needed, though mostly client-side app
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border border-border">
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border border-border hover:bg-accent/20 transition-all duration-300"
            onClick={() => {
                if (theme === 'dark') {
                    setTheme('light');
                } else if (theme === 'light') {
                    setTheme('dark');
                } else {
                    // If system is currently selected, switch to the OPPOSITE of what system is showing
                    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    setTheme(systemIsDark ? 'light' : 'dark');
                }
            }}
        >
            {theme === 'dark' ? (
                <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
            ) : theme === 'light' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
            ) : (
                <span className="font-bold text-xs">A</span> // For Auto/System, or we can just swap sun/moon
            )}

            {/* Simplified Toggle Logic needed to standard Sun/Moon */}
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
