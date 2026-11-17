"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight, BookOpen, Globe, Layout, Link2, Server, Sparkles } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";
import StoneField from "./StoneField";

const ICONS = [Globe, Layout, Server, Link2, Sparkles, BookOpen] as const;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Luz do hover que segue o cursor dentro do card (só mouse). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export default function Services() {
  const { t, locale } = useI18n();
  const isPt = locale === "pt";
  const sectionRef = useRef<HTMLElement>(null);

  // Pausa a flutuação infinita dos pebbles quando a seção está fora da tela.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.inview = String(entry.isIntersecting);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const services = [
    { title: t.services.s1_title, desc: t.services.s1_desc },
    { title: t.services.s2_title, desc: t.services.s2_desc },
    { title: t.services.s3_title, desc: t.services.s3_desc },
    { title: t.services.s4_title, desc: t.services.s4_desc },
    { title: t.services.s5_title, desc: t.services.s5_desc },
    { title: t.services.s6_title, desc: t.services.s6_desc },
  ];

  const aiFlow = [
    { pt: "Especificar", en: "Specify" },
    { pt: "Planejar", en: "Plan" },
    { pt: "Quebrar em tarefas", en: "Break into tasks" },
    { pt: "Implementar com IA", en: "Build with AI" },
    { pt: "Revisar e testar", en: "Review & test" },
  ];

  const aiSkills: { pt: string; en: string; core?: boolean }[] = [
    { pt: "Spec-Driven Development", en: "Spec-Driven Development", core: true },
    { pt: "Prompt Engineering", en: "Prompt Engineering", core: true },
    { pt: "Context Engineering", en: "Context Engineering", core: true },
    { pt: "Revisão de código assistida", en: "AI-assisted code review", core: true },
    { pt: "Claude Code", en: "Claude Code" },
    { pt: "GitHub Copilot", en: "GitHub Copilot" },
    { pt: "Cursor", en: "Cursor" },
    { pt: "MCP", en: "MCP" },
    { pt: "Agentes de IA", en: "AI agents" },
    { pt: "TDD com IA", en: "AI-assisted TDD" },
  ];

  return (
    <section
      id="servicos"
      ref={sectionRef}
      aria-labelledby="servicos-title"
      className="services-section relative isolate scroll-reveal overflow-hidden bg-[var(--color-primary)] py-16 text-black sm:py-20 md:py-32"
    >
      {["one", "two", "three", "four"].map((name) => (
        <div
          key={name}
          className={`services-pebble services-pebble-${name} pointer-events-none absolute`}
          aria-hidden="true"
        >
          <span />
        </div>
      ))}

      <div className="stone-dust services-dust pointer-events-none absolute inset-0" aria-hidden="true" />
      <StoneField variant="services" />

      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(0 0 0 / 19%) 30%, rgb(0 0 0 / 19%) 70%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <div className="services-reveal mb-10 sm:mb-14" style={vars({ "--i": 0 })}>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-8 bg-black" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-black">
              {t.services.label}
            </span>
          </div>
          {/* text-shadow:none → o `main h2` global engrossava o texto preto sobre o amarelo */}
          <h2
            id="servicos-title"
            className="heading-flat max-w-3xl font-black leading-[1.05] tracking-tight text-balance text-black"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
          >
            {t.services.title}
          </h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={service.title}
                className="services-reveal"
                style={vars({ "--i": i + 1 })}
              >
                <article
                  onPointerMove={trackPointer}
                  className="services-card relative flex h-full flex-col items-start gap-4 p-4 min-[380px]:flex-row sm:flex-col sm:p-6"
                >
                  <div className="flex w-full shrink-0 items-start justify-between min-[380px]:w-auto sm:w-full">
                    <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[var(--color-primary)]">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <span
                      className="static font-mono text-xs tracking-[0.2em] text-[var(--color-muted)]/60 min-[380px]:absolute min-[380px]:right-4 min-[380px]:top-4 sm:static"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 min-[380px]:pr-6 sm:pr-0">
                    <h3 className="font-bold text-[var(--color-foreground)]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                      {service.desc}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <article
          onPointerMove={trackPointer}
          className="services-card services-reveal mt-10 p-5 sm:p-7"
          style={vars({ "--i": 7 })}
          aria-labelledby="services-ai-title"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {isPt ? "IA no desenvolvimento" : "AI in development"}
              </span>
              <h3
                id="services-ai-title"
                className="mt-2 text-lg font-semibold text-[var(--color-foreground)]"
              >
                {isPt ? "Desenvolvimento orientado por especificações" : "Spec-driven development"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                {isPt
                  ? "Uso IA como parceira de engenharia, não como atalho: a especificação define o comportamento esperado, a IA acelera a implementação e eu reviso, testo e assumo a qualidade do que vai para produção."
                  : "I use AI as an engineering partner, not a shortcut: the spec defines the expected behavior, AI speeds up implementation, and I review, test and own the quality of what ships."}
              </p>

              <ol
                className="services-ai-flow mt-5 grid gap-2"
                aria-label={isPt ? "Fluxo de trabalho" : "Workflow"}
              >
                {aiFlow.map((step, i) => (
                  <li
                    key={step.en}
                    className="services-ai-step flex items-center gap-3 text-sm text-[var(--color-foreground)]"
                  >
                    <span
                      className="services-ai-num inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)]/50 font-mono text-xs font-semibold text-[var(--color-primary)]"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {step[locale]}
                  </li>
                ))}
              </ol>
            </div>

            <ul className="flex flex-wrap content-start gap-2">
              {aiSkills.map((item) => (
                <li
                  key={item.en}
                  className={`skill-chip rounded-full border px-3 py-1.5 font-mono text-xs ${
                    item.core
                      ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-foreground)]"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)]"
                  }`}
                >
                  {item[locale]}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div
          className="services-reveal mt-10 flex justify-center sm:mt-14"
          style={vars({ "--i": 8 })}
        >
          <a
            href="#contato"
            className="services-cta group inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-bold text-[var(--color-primary)]"
          >
            {t.hero.cta_contact}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}