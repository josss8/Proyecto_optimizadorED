import React, { useEffect, useRef } from 'react';

const GOOGLE_COLORS = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#FBBC05', // Yellow
  '#34A853', // Green
  '#A855F7', // Purple
];

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic count based on hardware cores
    const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    // Scale particles reasonably: minimum 35, maximum 85
    const particleCount = Math.min(Math.max(cores * 9, 35), 85);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140, // Repulsion influence radius
    };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : Math.random() * width;
        this.y = init ? Math.random() * height : (Math.random() > 0.5 ? 0 : height);
        this.radius = Math.random() * 2.2 + 1.2;
        this.color = GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)];
        
        // Base floating velocities (Antigravity gentle drift)
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        
        // Repulsion velocity additions
        this.repulseVx = 0;
        this.repulseVy = 0;
        this.friction = 0.94;
        this.alpha = Math.random() * 0.5 + 0.35;
      }

      update() {
        // Distance to cursor
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          // Antigravity repulsion physics (flee from cursor)
          const force = (1 - dist / mouse.radius) * 6.5;
          const angle = Math.atan2(dy, dx);
          this.repulseVx -= Math.cos(angle) * force;
          this.repulseVy -= Math.sin(angle) * force;
        }

        // Apply friction to repulsion
        this.repulseVx *= this.friction;
        this.repulseVy *= this.friction;

        // Position update
        this.x += this.vx + this.repulseVx;
        this.y += this.vy + this.repulseVy;

        // Boundary bounce / wrap
        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Connect close particles with subtle links
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#FFFFFF';
            ctx.globalAlpha = (1 - dist / 100) * 0.07;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawConnections();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Event Listeners
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#0A0A0A' }}
    />
  );
}
