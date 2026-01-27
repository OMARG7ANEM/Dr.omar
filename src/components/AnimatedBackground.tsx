import { useEffect, useRef } from 'react';
import { useTheme } from "@/components/ThemeProvider";

const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let moon: Moon | null = null;
        let animationFrameId: number;
        let w = 0;
        let h = 0;
        let isMobile = false;

        // Check effective theme (handle system preference)
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Configuration based on theme
        const particleColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(255, 255, 255, ';
        const lineColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(212, 175, 55, ';
        const getConnectionDistance = () => isMobile ? 80 : 150;
        const getMouseDistance = () => isMobile ? 120 : 250;

        class Moon {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            radius: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.vx = 0;
                this.vy = 0;
                this.radius = 50;
            }

            update() {
                // physics constants
                const friction = 0.92;
                const ease = 0.05; // Return speed
                const repulsionRadius = 300;
                const repulsionForce = 2; // How fast it runs away

                // 1. Mouse Interaction (Repel/Chase)
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < repulsionRadius) {
                    const angle = Math.atan2(dy, dx);
                    // Push AWAY from mouse
                    const forceX = -Math.cos(angle) * repulsionForce;
                    const forceY = -Math.sin(angle) * repulsionForce;

                    this.vx += forceX;
                    this.vy += forceY;
                }

                // 2. Return to Base (Spring)
                const dxBase = this.baseX - this.x;
                const dyBase = this.baseY - this.y;

                this.vx += dxBase * ease * 0.1; // weaker spring for floaty feel
                this.vy += dyBase * ease * 0.1;

                // 3. Physics update
                this.vx *= friction;
                this.vy *= friction;

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                if (!ctx) return;

                ctx.save();

                if (isDark) {
                    // Glow
                    ctx.shadowBlur = 60;
                    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

                    // Main Moon Body
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = "#F6F1D5";
                    ctx.fill();

                    // Details/Craters (moving with the moon)
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "rgba(200, 200, 200, 0.3)";

                    // Crater 1
                    ctx.beginPath();
                    ctx.arc(this.x - 12, this.y + 6, 10, 0, Math.PI * 2);
                    ctx.fill();

                    // Crater 2
                    ctx.beginPath();
                    ctx.arc(this.x + 18, this.y - 12, 6, 0, Math.PI * 2);
                    ctx.fill();

                    // Crater 3
                    ctx.beginPath();
                    ctx.arc(this.x + 6, this.y + 18, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Sun logic
                    ctx.shadowBlur = 60;
                    ctx.shadowColor = "rgba(255, 165, 0, 0.6)";

                    // Main Sun Body
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = "#fbbf24"; // Golden yellow
                    ctx.fill();

                    // Sun shine glare
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                    ctx.beginPath();
                    ctx.arc(this.x - 10, this.y - 10, 15, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                const velocityMultiplier = isMobile ? 0.3 : 1;
                this.vx = (Math.random() - 0.5) * (isDark ? 0.3 : 0.5) * velocityMultiplier;
                this.vy = (Math.random() - 0.5) * (isDark ? 0.3 : 0.5) * velocityMultiplier;
                const sizeMultiplier = isMobile ? 0.5 : 1;
                this.size = (Math.random() * 2 + (isDark ? 0.5 : 1)) * sizeMultiplier;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                // Mouse interaction
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < getMouseDistance()) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = getMouseDistance();
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 2;
                    const directionY = forceDirectionY * force * 2;

                    this.x += directionX;
                    this.y += directionY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor + (isDark ? this.opacity : '0.4') + ')';
                ctx.fill();

                // Glow for stars in dark mode
                if (isDark && this.size > 1.5) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "white";
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            particles = [];
            isMobile = w < 768;
            const particleCount = isMobile
                ? Math.min(Math.floor((w * h) / 15000), 40)
                : Math.min(Math.floor((w * h) / 10000), 80);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }


            // Only create Sun/Moon on desktop
            if (!isMobile) {
                if (isDark) {
                    moon = new Moon(w * 0.85, h * 0.2);
                } else {
                    moon = new Moon(w * 0.15, h * 0.2);
                }
                moon.radius = 50;
            } else {
                moon = null;
            }
        };

        const animate = () => {
            if (!ctx) return;

            if (isDark) {
                const gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, "#020617");
                gradient.addColorStop(1, "#0f172a");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
            } else {
                ctx.clearRect(0, 0, w, h);
            }

            if (moon) {
                moon.update();
                moon.draw();
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < getConnectionDistance()) {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor + (
                            (isDark ? 0.2 : 0.15) * (1 - distance / getConnectionDistance())
                        ) + ')';
                        ctx.lineWidth = isMobile ? 0.5 : 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                const dx = mouseRef.current.x - particles[i].x;
                const dy = mouseRef.current.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < getMouseDistance()) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor + (
                        0.2 * (1 - distance / getMouseDistance())
                    ) + ')';
                    ctx.lineWidth = isMobile ? 0.5 : 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            } else {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        }

        handleResize();
        init();
        animate();

        window.addEventListener('resize', handleResize);

        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('mouseleave', handleMouseLeave);
        } else {
            window.addEventListener('mousemove', handleMouseMove);
        }


        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('mouseleave', handleMouseLeave);
            } else {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
};

export default AnimatedBackground;
