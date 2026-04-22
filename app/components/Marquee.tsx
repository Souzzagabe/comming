"use client";

import { useRef, useState } from "react";

const ITEMS = [
  "Next.js",
  "React",
  "TypeScript",
  "Angular",
  "Node.js",
  "PHP",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "Styled Components",
  "Jest",
  "Material UI",
  "PostgreSQL",
  "Docker",
  "Vercel",
];

export default function Marquee() {
  const [paused, setPaused] = useState(false);
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--color-border)] py-5 select-none cursor-default"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left edge fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--color-background), transparent)",
        }}
      />
      {/* Right edge fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, var(--color-background), transparent)",
        }}
      />

      <div
        className={`flex gap-0 whitespace-nowrap animate-marquee ${paused ? "paused" : ""}`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-sm font-mono tracking-widest uppercase"
          >
            <span className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              {item}
            </span>
            <span className="text-[var(--color-primary)] opacity-40 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
