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
  const floatingRefs = useRef<Array<HTMLDivElement | null>>([]);

  function resetPointerMotion() {
    const image = imageRef.current;
    image?.style.setProperty("--hero-image-x", "0px");
    image?.style.setProperty("--hero-image-y", "0px");
    image?.style.setProperty("--hero-image-rotate-x", "0deg");
    image?.style.setProperty("--hero-image-rotate-y", "0deg");
    floatingRefs.current.forEach((item) => {
      item?.style.setProperty("--hero-float-x", "0px");
      item?.style.setProperty("--hero-float-y", "0px");
    });
  }

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

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      resetPointerMotion();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetPointerMotion();
      return;
    }

    const sectionBounds = sectionRef.current?.getBoundingClientRect();
    if (!sectionBounds) return;

    const pointerX = (event.clientX - sectionBounds.left) / sectionBounds.width;
    const pointerY = (event.clientY - sectionBounds.top) / sectionBounds.height;
    floatingRefs.current.forEach((item) => {
      if (!item) return;
      const depth = Number(item.dataset.depth ?? 24);
      item.style.setProperty("--hero-float-x", `${(0.5 - pointerX) * depth}px`);
      item.style.setProperty("--hero-float-y", `${(0.5 - pointerY) * depth}px`);
    });

    const artBounds = artRef.current?.getBoundingClientRect();
    const image = imageRef.current;
    const pointerOverImage =
      artBounds &&
      event.clientX >= artBounds.left &&
      event.clientX <= artBounds.right &&
      event.clientY >= artBounds.top &&
      event.clientY <= artBounds.bottom;
    if (!artBounds || !pointerOverImage || !image) {
      image?.style.setProperty("--hero-image-x", "0px");
      image?.style.setProperty("--hero-image-y", "0px");
      image?.style.setProperty("--hero-image-rotate-x", "0deg");
      image?.style.setProperty("--hero-image-rotate-y", "0deg");
      return;
    }

    const artX = (event.clientX - artBounds.left) / artBounds.width;
    const artY = (event.clientY - artBounds.top) / artBounds.height;
    image.style.setProperty("--hero-image-x", `${(0.5 - artX) * 22}px`);
    image.style.setProperty("--hero-image-y", `${(artY - 0.5) * 18}px`);
    image.style.setProperty("--hero-image-rotate-x", `${(0.5 - artY) * 22}deg`);
    image.style.setProperty("--hero-image-rotate-y", `${(artX - 0.5) * 28}deg`);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerMotion}
      className="hero-section relative isolate overflow-hidden"
    >
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="hero-ambient-glow pointer-events-none absolute" />
      {[
        "hero-pebble-one",
        "hero-pebble-two",
        "hero-pebble-three",
        "hero-pebble-four",
        "hero-pebble-five",
        "hero-pebble-six",
        "hero-pebble-seven",
      ].map((className, index) => (
        <div
          key={className}
          ref={(element) => {
            floatingRefs.current[index] = element;
          }}
          data-depth={22 + index * 6}
          className={`hero-pebble ${className} pointer-events-none absolute`}
          aria-hidden="true"
        >
          <span />
        </div>
      ))}

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
          <div
            ref={(element) => {
              floatingRefs.current[7] = element;
            }}
            data-depth="36"
            className="hero-pebble hero-pebble-copy pointer-events-none absolute"
            aria-hidden="true"
          >
            <span />
          </div>
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
      </div>

      <div className="hero-scroll absolute bottom-6 left-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:left-8 lg:left-12">
        <ArrowDown size={14} aria-hidden="true" />
        {t.hero.scroll}
      </div>
    </section>
  );
}
