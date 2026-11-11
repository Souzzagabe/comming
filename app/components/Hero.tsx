"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const TECHS = ["Next.js", "React", "TypeScript", "Node.js", "Angular", "PHP"];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrollLayer = scrollLayerRef.current;
    if (!section || !scrollLayer) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateScrollParallax = () => {
      const progress = motionPreference.matches
        ? 0
        : Math.min(1, Math.max(0, -section.getBoundingClientRect().top / section.offsetHeight));
      scrollLayer.style.setProperty("--hero-scroll-offset", `${-36 * progress}px`);
      scrollLayer.style.setProperty("--hero-scroll-scale", `${1 - 0.04 * progress}`);
    };

    window.addEventListener("scroll", updateScrollParallax, { passive: true });
    window.addEventListener("resize", updateScrollParallax, { passive: true });
    motionPreference.addEventListener("change", updateScrollParallax);
    updateScrollParallax();

    return () => {
      window.removeEventListener("scroll", updateScrollParallax);
      window.removeEventListener("resize", updateScrollParallax);
      motionPreference.removeEventListener("change", updateScrollParallax);
    };
  }, []);

  function resetImageTilt() {
    const image = imageRef.current;
    if (!image) return;

    image.style.setProperty("--hero-image-x", "0px");
    image.style.setProperty("--hero-image-y", "0px");
    image.style.setProperty("--hero-image-rotate-x", "0deg");
    image.style.setProperty("--hero-image-rotate-y", "0deg");
  }

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      resetImageTilt();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetImageTilt();
      return;
    }

    const bounds = artRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      resetImageTilt();
      return;
    }

    const image = imageRef.current;
    if (!image) return;

    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    image.style.setProperty("--hero-image-x", `${(0.5 - pointerX) * 22}px`);
    image.style.setProperty("--hero-image-y", `${(pointerY - 0.5) * 18}px`);
    image.style.setProperty("--hero-image-rotate-x", `${(0.5 - pointerY) * 22}deg`);
    image.style.setProperty("--hero-image-rotate-y", `${(pointerX - 0.5) * 28}deg`);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetImageTilt}
      className="hero-section relative isolate overflow-hidden"
    >
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="hero-ambient-glow pointer-events-none absolute" />

      <div className="hero-layout relative z-10 mx-auto">
        <div ref={artRef} className="hero-art-frame relative">
          <div className="hero-art-orbit pointer-events-none absolute inset-0" />
          <div ref={scrollLayerRef} className="hero-scroll-parallax absolute inset-0">
            <div ref={imageRef} className="hero-image-reveal absolute inset-0" aria-hidden="true">
              <Image
                src="/Gemini_Generated_Image_.png"
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 48vw"
                style={{ objectFit: "contain", objectPosition: "center" }}
                className="hero-art-image object-contain"
              />
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <div className="hero-availability hero-enter hero-enter-1 mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
            <span className="hero-status-dot relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full opacity-50" />
              <span className="relative inline-flex size-2 rounded-full" />
            </span>
            {t.hero.available}
          </div>

          <h1 className="hero-title">
            <span className="hero-line block">{t.hero.title1}</span>
            <span className="hero-line hero-title-accent block">{t.hero.title2}</span>
          </h1>

          <p className="hero-role hero-enter hero-enter-2 mt-5 text-xs font-medium uppercase leading-relaxed tracking-[0.12em] sm:text-sm">
            {t.hero.role}
          </p>
          <p className="hero-description hero-enter hero-enter-3 mt-4 text-sm leading-relaxed sm:text-base">
            {t.hero.description}
          </p>

          <div
            className="hero-tech-list hero-enter hero-enter-4 mt-6 flex flex-wrap gap-2"
            aria-label="Tecnologias"
          >
            {TECHS.map((tech) => (
              <span key={tech} className="hero-tech rounded-full px-3 py-1.5 font-mono text-[10px]">
                {tech}
              </span>
            ))}
          </div>

          <div className="hero-actions hero-enter hero-enter-5 mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollTo("servicos")}
              className="magnetic-button hero-primary-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform"
            >
              {t.hero.cta_projects}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="hero-secondary-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
            >
              {t.hero.cta_contact}
            </button>
          </div>
        </div>

        <div className="hero-location hero-enter hero-enter-6 absolute flex items-center gap-3 rounded-full px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-sm font-bold tracking-[-0.08em]">
            GS<span className="hero-location-accent">.</span>
          </span>
          <span className="hero-location-divider h-4 w-px" />
          Porto Alegre, RS
        </div>
      </div>

      <div className="hero-scroll absolute bottom-6 left-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:left-8 lg:left-12">
        <ArrowDown size={14} aria-hidden="true" />
        {t.hero.scroll}
      </div>
    </section>
  );
}
