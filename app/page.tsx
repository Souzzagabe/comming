"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }[] = [];

    const colors = ["139, 92, 246", "6, 182, 212", "168, 85, 247", "59, 130, 246"];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx!.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(139, 92, 246, ${0.05 * (1 - dist / 130)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

function ProgressLoader() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-px w-40 bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }}
          animate={{ width: ["0%", "65%", "30%", "85%", "50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs text-[var(--color-muted)] font-mono tracking-widest">
        em breve
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background)]">
      <ParticleCanvas />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-accent)]/6 rounded-full blur-[180px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* LEFT - content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-28 py-20 lg:py-0 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8 max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-[var(--color-primary-light)] tracking-widest uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-light)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-primary-light)]" />
              </span>
              Em desenvolvimento
            </span>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="block text-white/90">Estamos</span>
                <span className="block bg-gradient-to-r from-[var(--color-primary-light)] via-purple-400 to-[var(--color-accent)] bg-clip-text text-transparent">
                  preparando
                </span>
                <span className="block text-white/90">algo incrivel.</span>
              </h1>
            </div>

            <p className="text-[var(--color-muted)] text-base leading-relaxed max-w-sm">
              Um novo portfolio esta sendo construido com atencao a cada detalhe.
              Experiencias modernas e interfaces que impressionam.
            </p>

            <ProgressLoader />

            <div className="flex items-center gap-4 pt-2">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-[var(--color-border)] to-transparent" />
              <span className="text-[10px] text-[var(--color-muted)]/50 font-mono tracking-[0.3em] uppercase">
                disponivel em breve
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT - image blended */}
        <div className="relative w-full lg:w-[48%] xl:w-[44%] order-1 lg:order-2 h-[60vw] sm:h-[50vw] lg:h-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.1 }}
            className="absolute inset-0"
          >
            <Image
              src="/fotosite.png"
              alt="Profile"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center lg:object-left-top"
              priority
            />
            <div
              className="absolute inset-y-0 left-0 w-32 hidden lg:block"
              style={{ background: "linear-gradient(to right, var(--color-background) 0%, transparent 100%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-24 lg:hidden"
              style={{ background: "linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-40"
              style={{ background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)" }}
            />
            <div
              className="absolute inset-y-0 right-0 w-16 hidden lg:block"
              style={{ background: "linear-gradient(to left, var(--color-background) 0%, transparent 100%)" }}
            />
            <div className="absolute inset-0 bg-[var(--color-primary)]/5 mix-blend-color" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/15 to-transparent z-10" />
    </div>
  );
}
