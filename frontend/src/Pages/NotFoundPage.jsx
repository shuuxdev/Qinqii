import React, { useEffect, useRef } from 'react';

const NotFound = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const createParticle = (x, y) => {
            const size = Math.random() * 5 + 2;
            const speedX = Math.random() * 3 - 1.5;
            const speedY = Math.random() * 3 - 1.5;
            particles.push({ x, y, size, speedX, speedY });
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(108, 99, 255, 0.7)';

            particles.forEach((particle, index) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                particles[index].x += particle.speedX;
                particles[index].y += particle.speedY;
            });

            // Remove particles that are out of the canvas
            particles = particles.filter(
                (particle) =>
                    particle.x > 0 &&
                    particle.x < canvas.width &&
                    particle.y > 0 &&
                    particle.y < canvas.height
            );
        };

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const animate = () => {
            updateCanvasSize();
            createParticle(canvas.width / 2, canvas.height / 2);
            drawParticles();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 relative">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
            <div className="text-white text-center relative">
                <h1 className="text-9xl font-bold relative z-10">404</h1>
                <p className="text-3xl font-semibold mb-4 relative z-10">Nghịch ngooo là khum tốt :3</p>
                <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out inline-block">
                    Về nàoooo
                </a>
            </div>
        </div>
    );
};

export default NotFound;
