'use client';

import { useEffect, useRef } from 'react';

export default function Snowfall() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Set explicit size to avoid scaling issues
        canvas.width = width;
        canvas.height = height;

        // Snowflakes configuration
        const snowflakeCount = 150;
        const snowflakes: {
            x: number;
            y: number;
            radius: number;
            speed: number;
            wind: number;
            opacity: number;
        }[] = [];

        // Initialize snowflakes
        for (let i = 0; i < snowflakeCount; i++) {
            snowflakes.push(createSnowflake(width, height));
        }

        function createSnowflake(w: number, h: number) {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 2 + 0.5, // 0.5px to 2.5px
                speed: Math.random() * 1.5 + 0.5, // Falling speed
                wind: Math.random() * 0.5 - 0.25, // Slight horizontal drift
                opacity: Math.random() * 0.5 + 0.3, // Varied opacity
            };
        }

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            snowflakes.forEach((flake) => {
                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind;

                // Reset if out of bounds
                if (flake.y > height) {
                    flake.y = -5;
                    flake.x = Math.random() * width;
                }
                if (flake.x > width) {
                    flake.x = 0;
                } else if (flake.x < 0) {
                    flake.x = width;
                }

                // Draw
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();
                ctx.closePath();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[5]"
            style={{ width: '100%', height: '100%' }}
            aria-hidden="true"
        />
    );
}
