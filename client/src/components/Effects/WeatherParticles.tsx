import React, { useEffect, useRef } from 'react';

interface WeatherParticlesProps {
    intensity?: 'light' | 'moderate' | 'heavy';
    type?: 'rain' | 'storm';
}

const WeatherParticles: React.FC<WeatherParticlesProps> = ({ intensity = 'moderate', type = 'rain' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particleCount = intensity === 'light' ? 50 : intensity === 'moderate' ? 100 : 200;
        const particles: Array<{ x: number; y: number; speed: number; length: number; opacity: number }> = [];

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 5 + Math.random() * 10,
                length: 10 + Math.random() * 20,
                opacity: 0.3 + Math.random() * 0.4
            });
        }

        let animationId: number;
        let flashTimeout: number | null = null;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(174, 194, 224, ${particle.opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x - 2, particle.y + particle.length);
                ctx.stroke();

                particle.y += particle.speed;
                particle.x -= 1;

                if (particle.y > canvas.height) {
                    particle.y = -particle.length;
                    particle.x = Math.random() * canvas.width;
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        // Lightning effect for storm
        const triggerLightning = () => {
            if (type === 'storm' && Math.random() < 0.02) {
                canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                setTimeout(() => {
                    canvas.style.backgroundColor = 'transparent';
                }, 100);
            }
            flashTimeout = setTimeout(triggerLightning, 2000 + Math.random() * 3000);
        };

        animate();
        if (type === 'storm') triggerLightning();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            if (flashTimeout) clearTimeout(flashTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [intensity, type]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default WeatherParticles;
