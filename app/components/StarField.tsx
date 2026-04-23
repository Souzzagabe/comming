"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 120;

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  drift: number;
  angle: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width = W;
      canvas.height = H;
    }

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.15 + 0.03,
      drift: (Math.random() - 0.5) * 0.08,
      angle: Math.random() * Math.PI * 2,
    }));

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        // Slow float upward with slight horizontal drift
        s.y -= s.speed;
        s.x += s.drift;
        s.angle += 0.005;

        // Wrap around
        if (s.y < -4) s.y = H + 4;
        if (s.x < -4) s.x = W + 4;
        if (s.x > W + 4) s.x = -4;

        // Twinkle
        const twinkle = s.opacity + Math.sin(s.angle) * 0.12;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${Math.max(0, Math.min(1, twinkle))})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
