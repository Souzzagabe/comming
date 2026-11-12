"use client";

import type { CSSProperties, PointerEvent } from "react";
import {
  ArrowUpRight,
  Code2,
  Globe,
  Layers,
  Lightbulb,
  Rocket,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

/** Atualize este número depois das otimizações: a cor do anel muda sozinha. */
const LIGHTHOUSE_MOBILE = 99;

type Trait = {
  icon: LucideIcon;
  title: string;
  desc: string;
  wide?: boolean;
  score?: number;
  cta?: { label: string; href: string };
};

const traits: Trait[] = [
  {
    icon: Code2,
    title: "Código limpo",
    desc: "Componentização, escalabilidade e boas práticas.",
  },
  {
    icon: Lightbulb,
    title: "Foco em UX",
    desc: "Interfaces intuitivas centradas no usuário.",
  },
  {
    icon: Rocket,
    title: "Performance",
    desc: `Lighthouse mobile: ${LIGHTHOUSE_MOBILE}/100 no baseline medido.`,
    wide: true,
    score: LIGHTHOUSE_MOBILE,
  },
  {
    icon: Layers,
    title: "Fullstack",
    desc: "Frontend e backend integrados sem fricção.",
  },
  {
    icon: TestTube2,
    title: "Testes",
    desc: "Jest, TDD e fluxo de entrega contínua.",
  },
  {
    icon: Globe,
    title: "Freelancer",
    desc: "Sites, landing pages e sistemas sob demanda.",
    wide: true,
    cta: { label: "Vamos conversar", href: "#contato" },
  },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Luz do hover que segue o cursor dentro do card (só mouse). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Anel de score no padrão de cores do Lighthouse (vermelho / laranja / verde). */
function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 90 ? "#0cce6b" : score >= 50 ? "#ffa400" : "#ff4e42";

  return (
    <div
      className="relative size-[76px] shrink-0"
      role="img"
      aria-label={`Lighthouse mobile: ${score} de 100`}
      style={vars({ "--c": circumference.toFixed(2), color })}
    >
      <svg viewBox="0 0 72 72" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="5"
        />
        <circle
          className="about-ring-arc"
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute inset-0 grid place-items-center font-mono text-base font-bold text-[var(--color-foreground)]"
        aria-hidden="true"
      >
        {score}
      </span>
    </div>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative scroll-reveal overflow-hidden bg-[var(--color-background)] py-16 sm:py-20 md:py-32"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
        }}
      />
      {/* brilho estático de fundo (barato: sem blur, sem animação) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 78% 40%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* LEFT */}
          <div>
            <div className="about-reveal" style={vars({ "--i": 0 })}>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-[var(--color-primary)]" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  {t.about.label}
                </span>
              </div>

              <h2
                id="sobre-title"
                className="title-3d font-black leading-[1.05] tracking-tight text-balance"
              >
                <span
                  className="block"
                  style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
                >
                  {t.about.title1}
                </span>
                {/* text-shadow:none → o `main h2` global desenhava a sombra atrás do
                    texto transparente e deixava o gradiente "sujo" */}
                <span
                  className="title-3d-accent block pb-[0.1em]"
                  style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
                >
                  {t.about.title2}
                </span>
              </h2>
            </div>

            <div
              className="about-reveal mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-muted)] md:text-base"
              style={vars({ "--i": 1 })}
            >
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p4}</p>
            </div>
          </div>

          {/* RIGHT - bento */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {traits.map((trait, i) => {
              const Icon = trait.icon;
              return (
                <div
                  key={trait.title}
                  className={`about-reveal ${trait.wide ? "col-span-2" : ""}`}
                  style={vars({ "--i": i + 1 })}
                >
                  <article
                    onPointerMove={trackPointer}
                    className="about-card flex h-full items-start justify-between gap-4 p-4 sm:gap-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-foreground)]">
                          {trait.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
                          {trait.desc}
                        </p>
                      </div>
                      {trait.cta && (
                        <a
                          href={trait.cta.href}
                          className="about-cta mt-1 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]"
                        >
                          {trait.cta.label}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    {trait.score !== undefined && <ScoreRing score={trait.score} />}
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}