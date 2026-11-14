"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";
import StoneField from "./StoneField";

const TECHS = ["Next.js", "React", "TypeScript", "Node.js", "Angular", "PHP"];

const MARQUEE = [
  "Frontend",
  "Performance",
  "UX",
  "Next.js",
  "React",
  "TypeScript",
  "Angular",
  "Node.js",
  "PHP",
  "Tailwind CSS",
  "Styled Components",
  "Material UI",
  "Jest",
  "PostgreSQL",
  "Docker",
  "Vercel",
  "GSAP",
  "Framer Motion",
];

// 2 repetições por grupo → cobre telas largas; 2 grupos = loop sem emenda
const MARQUEE_ROW = [...MARQUEE, ...MARQUEE];

const PEBBLES = [
  "hero-pebble-one",
  "hero-pebble-two",
  "hero-pebble-three",
  "hero-pebble-four",
  "hero-pebble-five",
  "hero-pebble-six",
  "hero-pebble-seven",
];

/** Helper para tipar custom properties CSS inline (--w, --i, --t...). */
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Quebra o texto em palavras; cada uma sobe de dentro de uma máscara. */
function TitleWords({
  text,
  offset = 0,
  underlineLast = false,
}: {
  text: string;
  offset?: number;
  underlineLast?: boolean;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => {
        const mask = (
          <span className="hero-word-mask">
            <span className="hero-word" style={vars({ "--w": offset + i })}>
              {word}
            </span>
          </span>
        );
        return (
          <Fragment key={`${word}-${i}`}>
            {i > 0 && " "}
            {underlineLast && i === words.length - 1 ? (
              <span className="hero-underline">{mask}</span>
            ) : (
              mask
            )}
          </Fragment>
        );
      })}
    </>
  );
}

/** Hora local de Porto Alegre, atualizada a cada minuto (alinhada ao relógio). */
function PortoAlegreClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    let timer: ReturnType<typeof setTimeout>;

    const update = () => {
      const now = new Date();
      setTime(format.format(now));
      timer = setTimeout(update, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };

    update();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-clock hero-enter inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
      <MapPin size={12} aria-hidden="true" />
      <span>
        Porto Alegre · {time ?? "--:--"} BRT
      </span>
    </div>
  );
}

/** Efeito "magnético" leve nos botões (só mouse; CSS faz a suavização). */
function pullButton(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (event.clientX - (r.left + r.width / 2)) / r.width;
  const y = (event.clientY - (r.top + r.height / 2)) / r.height;
  el.style.setProperty("--mx", `${(x * 12).toFixed(2)}px`);
  el.style.setProperty("--my", `${(y * 9).toFixed(2)}px`);
}

function releaseButton(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--mx", "0px");
  event.currentTarget.style.setProperty("--my", "0px");
}

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  const title1Words = t.hero.title1.split(" ").length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Pausa os loops infinitos (CSS) enquanto o hero está fora da tela.
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.inview = String(entry.isIntersecting);
    });
    observer.observe(section);

    // Alvo (ponteiro) e valor atual suavizado. x/y em -1..1; sx/sy em px.
    const target = { x: 0, y: 0, sx: 0, sy: 0 };
    const current = { x: 0, y: 0, sx: 0, sy: 0 };
    let frame = 0;
    let last = 0;
    let active = false;

    // Um único loop de rAF, que só roda enquanto há movimento a suavizar,
    // e escreve apenas 4 custom properties na <section>. O CSS faz o resto.
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const a = 1 - Math.exp(-dt / 110); // suavização independente do FPS
      const aSpot = 1 - Math.exp(-dt / 170);

      current.x += (target.x - current.x) * a;
      current.y += (target.y - current.y) * a;
      current.sx += (target.sx - current.sx) * aSpot;
      current.sy += (target.sy - current.sy) * aSpot;

      section.style.setProperty("--px", current.x.toFixed(4));
      section.style.setProperty("--py", current.y.toFixed(4));
      section.style.setProperty("--sx", `${current.sx.toFixed(1)}px`);
      section.style.setProperty("--sy", `${current.sy.toFixed(1)}px`);

      const settled =
        Math.abs(target.x - current.x) < 0.001 &&
        Math.abs(target.y - current.y) < 0.001 &&
        Math.abs(target.sx - current.sx) < 0.5 &&
        Math.abs(target.sy - current.sy) < 0.5;

      if (settled) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (reduceMotion.matches || !finePointer.matches) return;

      const rect = section.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      target.sx = event.clientX - rect.left;
      target.sy = event.clientY - rect.top;

      if (!active) {
        // primeira entrada: a luz nasce sob o cursor em vez de voar do centro
        active = true;
        current.sx = target.sx;
        current.sy = target.sy;
        section.dataset.pointer = "active";
      }
      wake();
    };

    const onLeave = () => {
      active = false;
      section.dataset.pointer = "idle";
      target.x = 0;
      target.y = 0;
      wake();
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section relative isolate overflow-hidden"
    >
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="hero-ambient-glow pointer-events-none absolute" />
      <div className="hero-spotlight pointer-events-none absolute" aria-hidden="true" />
      <div className="stone-dust hero-dust pointer-events-none absolute inset-0" aria-hidden="true" />
      <StoneField variant="hero" />

      {PEBBLES.map((className, index) => (
        <div
          key={className}
          style={vars({ "--depth": 22 + index * 6, "--i": index })}
          className={`hero-pebble ${className} pointer-events-none absolute`}
          aria-hidden="true"
        >
          <span />
        </div>
      ))}

      <div className="hero-layout relative z-10 mx-auto">
        <div className="hero-art-frame relative">
          <div className="hero-art-orbit pointer-events-none absolute inset-0" />
          <div className="hero-scroll-parallax absolute inset-0">
            <div className="hero-image-reveal absolute inset-0" aria-hidden="true">
              <Image
                src="/Gemini_Generated_Image_.png"
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 48vw"
                className="hero-art-image object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <div
            style={vars({ "--depth": 36, "--i": 7 })}
            className="hero-pebble hero-pebble-copy pointer-events-none absolute"
            aria-hidden="true"
          >
            <span />
          </div>

          <div className="hero-meta mb-6 flex flex-wrap items-center gap-2">
            <div className="hero-availability hero-enter hero-enter-1 inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              <span className="hero-status-dot relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full opacity-50" />
                <span className="relative inline-flex size-2 rounded-full" />
              </span>
              {t.hero.available}
            </div>
            <PortoAlegreClock />
          </div>

          <h1 className="hero-title">
            <span className="block">
              <TitleWords text={t.hero.title1} />
            </span>
            <span className="hero-title-accent">
              <TitleWords text={t.hero.title2} offset={title1Words} underlineLast />
            </span>
          </h1>

          <p className="hero-role hero-enter hero-enter-2 mt-5 text-xs font-medium uppercase leading-relaxed tracking-[0.12em] sm:text-sm">
            {t.hero.role}
          </p>
          <p className="hero-description hero-enter hero-enter-3 mt-4 text-sm leading-relaxed sm:text-base">
            {t.hero.description}
          </p>

          <ul className="hero-tech-list mt-6 flex flex-wrap gap-2" aria-label="Tecnologias">
            {TECHS.map((tech, i) => (
              <li
                key={tech}
                style={vars({ "--t": i })}
                className="hero-tech rounded-full px-3 py-1.5 font-mono text-[10px]"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="hero-actions hero-enter hero-enter-5 mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#servicos"
              onPointerMove={pullButton}
              onPointerLeave={releaseButton}
              className="hero-magnetic hero-primary-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
            >
              {t.hero.cta_projects}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href="#contato"
              onPointerMove={pullButton}
              onPointerLeave={releaseButton}
              className="hero-magnetic hero-secondary-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              {t.hero.cta_contact}
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute left-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:left-8 lg:left-12">
        <ArrowDown size={14} aria-hidden="true" />
        {t.hero.scroll}
      </div>

      {/* Faixa inclinada: transição visual hero → próxima seção (decorativa) */}
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {[0, 1].map((group) => (
            <div key={group} className="hero-marquee-group">
              {MARQUEE_ROW.map((word, i) => (
                <span key={`${word}-${i}`} className="hero-marquee-item">
                  {word}
                  <span className="hero-marquee-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}