import { useRef, useState, useEffect } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface CountUpStatProps {
    end: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

export const CountUpStat = ({ end, suffix = "", duration = 2000, className = "" }: CountUpStatProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const count = useCountUp(end, duration, isVisible);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <span ref={ref} className={className}>
            {count}{suffix}
        </span>
    );
};
