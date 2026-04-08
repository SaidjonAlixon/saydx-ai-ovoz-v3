import { useEffect, useRef } from "react";

export default function CursorSnake() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const trail = useRef<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        // Initialize trail
        for (let i = 0; i < 40; i++) {
            trail.current.push({ x: pointer.current.x, y: pointer.current.y });
        }

        const onPointerMove = (e: MouseEvent) => {
            pointer.current.x = e.clientX;
            pointer.current.y = e.clientY;
        };

        window.addEventListener("mousemove", onPointerMove);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Smoothly move the head of the trail towards the pointer
            const head = trail.current[0];
            head.x += (pointer.current.x - head.x) * 0.5;
            head.y += (pointer.current.y - head.y) * 0.5;

            // Update the rest of the trail
            for (let i = 1; i < trail.current.length; i++) {
                const point = trail.current[i];
                const prevPoint = trail.current[i - 1];
                point.x += (prevPoint.x - point.x) * 0.35;
                point.y += (prevPoint.y - point.y) * 0.35;
            }

            // Draw the snake
            ctx.beginPath();
            ctx.moveTo(trail.current[0].x, trail.current[0].y);
            for (let i = 1; i < trail.current.length - 1; i++) {
                const xc = (trail.current[i].x + trail.current[i + 1].x) / 2;
                const yc = (trail.current[i].y + trail.current[i + 1].y) / 2;
                ctx.quadraticCurveTo(trail.current[i].x, trail.current[i].y, xc, yc);
            }

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 12; // thickness of the line
            // Neon cyan color to match logo
            ctx.strokeStyle = "rgba(0, 212, 255, 0.8)";
            ctx.shadowColor = "rgba(0, 212, 255, 0.6)";
            ctx.shadowBlur = 15;

            // We can create a gradient to make the tail fade
            const gradient = ctx.createLinearGradient(
                trail.current[0].x, trail.current[0].y,
                trail.current[trail.current.length - 1].x, trail.current[trail.current.length - 1].y
            );
            gradient.addColorStop(0, "rgba(0, 212, 255, 1)");
            gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
            ctx.strokeStyle = gradient;

            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("mousemove", onPointerMove);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed top-0 left-0 w-full h-full z-50"
        />
    );
}
