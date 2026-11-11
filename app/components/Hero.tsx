"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const TECHS = ["Next.js", "React", "TypeScript", "Node.js", "Angular", "PHP"];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 22, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 22, mass: 0.6 });
  const imageX = useTransform(smoothX, [-1, 1], [12, -12]);
  const imageY = useTransform(smoothY, [-1, 1], [-8, 8]);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-[min(900px,100svh)] items-center overflow-hidden bg-[var(--color-background)]"
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />

      <div className="hero-ambient-glow pointer-events-none absolute -right-36 top-1/4 size-[34rem] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-[120px]" />

      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        style={{ x: imageX, y: imageY }}
        className="hero-portrait hero-image-enter pointer-events-none absolute inset-0 z-0 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[60%]"
        aria-hidden="true"
      >
        <Image
          src="/Gemini_Generated_Image_.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="object-cover object-[72%_top] lg:object-contain lg:object-right-top"
        />
      </motion.div>

      <div className="hero-portrait-blend pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto grid min-h-[min(900px,100svh)] w-full max-w-7xl items-center px-5 pb-24 pt-32 sm:px-8 md:px-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-16 lg:py-28">
        <div className="max-w-2xl">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="hero-enter hero-enter-1 mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/45 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] backdrop-blur-md sm:text-xs"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-primary)] opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--color-primary)]" />
            </span>
            {t.hero.available}
          </motion.div>

          <h1 className="max-w-[12ch] text-[clamp(3rem,6.4vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.075em]">
            <motion.span
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
              className="hero-line block"
            >
              {t.hero.title1}
            </motion.span>
            <motion.span
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
              className="hero-line block text-[var(--color-primary)]"
            >
              {t.hero.title2}
            </motion.span>
          </h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38 }}
            className="hero-enter hero-enter-2 mt-6 max-w-xl text-xs font-medium uppercase leading-relaxed tracking-[0.12em] text-[var(--color-muted)] sm:text-sm"
          >
            {t.hero.role}
          </motion.p>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.46 }}
            className="hero-enter hero-enter-3 mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-muted)] sm:text-base"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.54 }}
            className="hero-enter hero-enter-4 mt-7 flex flex-wrap gap-2"
            aria-label="Tecnologias"
          >
            {TECHS.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 font-mono text-[10px] text-[var(--color-foreground)] backdrop-blur-md transition-colors hover:border-[var(--color-primary)]"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62 }}
            className="hero-enter hero-enter-5 mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => scrollTo("servicos")}
              className="magnetic-button inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-black transition-transform"
            >
              {t.hero.cta_projects}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-black/20 px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] backdrop-blur-md transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {t.hero.cta_contact}
            </button>
          </motion.div>
        </div>

        <div className="pointer-events-none relative hidden h-full min-h-[540px] lg:block">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.65 }}
            className="hero-enter hero-enter-6 absolute bottom-8 right-1 flex items-center gap-3 rounded-full border border-white/15 bg-black/55 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-foreground)] backdrop-blur-md"
          >
            <span className="text-sm font-bold tracking-[-0.08em]">
              GS<span className="text-[var(--color-primary)]">.</span>
            </span>
            <span className="h-4 w-px bg-white/25" />
            Porto Alegre, RS
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] sm:bottom-8 sm:left-8 lg:left-16">
        <ArrowDown size={14} className="text-[var(--color-primary)]" aria-hidden="true" />
        {t.hero.scroll}
      </div>
    </section>
  );
}
