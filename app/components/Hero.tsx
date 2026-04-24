"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const TECHS = ["Next.js", "React", "TypeScript", "Node.js", "Angular", "PHP"];

export default function Hero() {
  const { t } = useI18n();

  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const imgX = useTransform(springX, [-1, 1], [-10, 10]);
  const imgY = useTransform(springY, [-1, 1], [-6, 6]);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    mouseY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden bg-[var(--color-background)]"
    >
      {/* Max-width inner wrapper — fixes ultra-wide layouts */}
      <div className="relative max-w-[1800px] mx-auto min-h-screen">

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[55%] h-full"
            style={{ background: "radial-gradient(ellipse at 80% 40%, #00C8FF08 0%, transparent 60%)" }}
          />
        </div>

        {/* RIGHT — full-height photo */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-64 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--color-background) 0%, var(--color-background) 15%, transparent 100%)",
            }}
          />
          <div className="absolute top-0 inset-x-0 h-28 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, var(--color-background), transparent)" }} />
          <div className="absolute bottom-0 inset-x-0 h-40 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }} />
          <motion.div style={{ x: imgX, y: imgY }} className="relative w-full h-full">
            <Image
              src="/fotosite.png"
              alt="Developer portrait"
              fill
              priority
              sizes="52vw"
              className="object-cover object-top"
            />
          </motion.div>
          <div
            className="absolute left-0 top-1/4 bottom-1/4 w-px z-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, var(--color-primary) 50%, transparent)" }}
          />
        </div>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 z-0">
          <Image src="/fotosite.png" alt="Developer portrait" fill priority sizes="100vw" className="object-cover object-top" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(6,13,18,0.55) 0%, rgba(6,13,18,0.88) 55%, rgba(6,13,18,0.98) 85%)" }} />
        </div>

        {/* LEFT — text content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 pt-24 pb-16 md:py-28 lg:w-[54%]">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--color-primary)]">
              {t.hero.available}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-black leading-[1.05] tracking-tight"
          >
            <span className="block text-[var(--color-foreground)]" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              {t.hero.title1}
            </span>
            <span
              className="block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              {t.hero.title2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-5 text-sm md:text-base font-medium text-[var(--color-muted)] tracking-wide"
          >
            {t.hero.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-5 text-[var(--color-muted)] leading-relaxed max-w-md text-sm md:text-base"
          >
            {t.hero.description}
          </motion.p>

          {/* Tech stack pills — replaces stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {TECHS.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 text-xs font-mono font-medium text-[var(--color-foreground)] tracking-wide hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)] transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 overflow-hidden bg-[var(--color-primary)] text-[var(--color-background)] px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_#00C8FF66]"
            >
              <span className="absolute inset-0 bg-white/20 translate-x-[-105%] group-hover:translate-x-[105%] transition-transform duration-500 skew-x-12 pointer-events-none" />
              {t.hero.cta_projects}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-medium text-[var(--color-foreground)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-card)] transition-all duration-300"
            >
              {t.hero.cta_contact}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-8 md:left-14 lg:left-20 xl:left-28 z-20 flex items-center gap-2"
        >
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown size={13} className="text-[var(--color-primary)]" />
          </motion.div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--color-muted)]">{t.hero.scroll}</span>
        </motion.div>

      </div>
    </section>
  );
}