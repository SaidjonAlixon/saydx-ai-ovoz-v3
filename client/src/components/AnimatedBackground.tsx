import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let w = canvas.width;
        let h = canvas.height;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            init();
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            glow: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                // Vary colors between cyan and royal blue
                const colors = ['#22d3ee', '#3b82f6', '#0ea5e9'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.glow = Math.random() * 15 + 5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > w) this.x = 0;
                else if (this.x < 0) this.x = w;
                if (this.y > h) this.y = 0;
                else if (this.y < 0) this.y = h;
            }

            draw() {
                if (!ctx) return;
                
                // Add glow effect to points
                ctx.shadowBlur = this.glow;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Reset shadow for performance
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            particles = [];
            const particleCount = Math.floor((w * h) / 12000); 
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            // Semi-transparent clear for subtle trail effect
            ctx.fillStyle = 'rgba(13, 12, 19, 0.2)'; 
            ctx.fillRect(0, 0, w, h);

            // Draw connecting lines with cyan gradient
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        const opacity = 1 - (distance / 150);
                        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] w-full h-full pointer-events-none"
            style={{ background: '#0d0c13' }}
        />
    );
}
