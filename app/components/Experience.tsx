"use client";

import type { CSSProperties, PointerEvent } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

type Lang = "pt" | "en";
type Text = Record<Lang, string>;

type Job = {
  company: string;
  role: Text;
  period: Text;
  kind: Text;
  place: Text;
  summary: Text;
  highlights: Text[];
  stack: string[];
};

/** Dados locais: nenhuma chamada externa (LinkedIn, API ou CMS). */
const JOBS: Job[] = [
  {
    company: "Target.IT",
    role: { pt: "Desenvolvedor Front-end", en: "Front-end Developer" },
    period: { pt: "jan. 2025 — presente", en: "Jan 2025 — present" },
    kind: { pt: "Tempo integral", en: "Full-time" },
    place: { pt: "Porto Alegre · Híbrido", en: "Porto Alegre · Hybrid" },
    summary: {
      pt: "Interfaces modernas, responsivas e de alta performance com React e Angular, em squads ágeis.",
      en: "Modern, responsive, high-performance interfaces with React and Angular, working in agile squads.",
    },
    highlights: [
      {
        pt: "Componentes reutilizáveis e modulares em arquitetura escalável, reduzindo tempo de desenvolvimento e custo de manutenção.",
        en: "Reusable, modular components on a scalable architecture, cutting development time and maintenance cost.",
      },
      {
        pt: "Testes automatizados com Jest para mais cobertura e estabilidade do código.",
        en: "Automated testing with Jest for better coverage and code stability.",
      },
      {
        pt: "Integrações com APIs e automação de processos internos com RPA, eliminando tarefas manuais repetitivas.",
        en: "API integrations and internal process automation with RPA, removing repetitive manual work.",
      },
      {
        pt: "Trabalho com equipes de design, back-end e produto em ciclos Scrum iterativos.",
        en: "Worked with design, back-end and product teams in iterative Scrum cycles.",
      },
    ],
    stack: ["React", "Angular", "Jest", "RPA", "SQL / NoSQL", "Scrum"],
  },
  {
    company: "Genesis Digital",
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    period: { pt: "jun. 2024 — jan. 2025", en: "Jun 2024 — Jan 2025" },
    kind: { pt: "Tempo integral", en: "Full-time" },
    place: { pt: "Porto Alegre · Híbrido", en: "Porto Alegre · Hybrid" },
    summary: {
      pt: "Soluções completas, do front-end à integração com o back-end, atendendo demandas reais de clientes.",
      en: "End-to-end solutions, from front-end to back-end integration, serving real client requirements.",
    },
    highlights: [
      {
        pt: "Interfaces interativas e responsivas com React, TypeScript e JavaScript, compatíveis entre dispositivos e navegadores.",
        en: "Interactive, responsive interfaces with React, TypeScript and JavaScript across devices and browsers.",
      },
      {
        pt: "Back-end em Java com orientação a objetos e integração completa com o front-end.",
        en: "Java back-end with object-oriented design, fully integrated with the front-end.",
      },
      {
        pt: "Sistemas dinâmicos em PHP e WordPress com funcionalidades personalizadas.",
        en: "Dynamic systems in PHP and WordPress with custom features.",
      },
      {
        pt: "Tradução de requisitos de negócio em soluções técnicas escaláveis, com integrações a serviços externos.",
        en: "Turned business requirements into scalable technical solutions, including third-party integrations.",
      },
    ],
    stack: ["React", "TypeScript", "Java", "PHP", "WordPress", "Next.js"],
  },
  {
    company: "Lacrei Saúde",
    role: { pt: "Desenvolvedor Front-end", en: "Front-end Developer" },
    period: { pt: "mar. 2024 — jun. 2024", en: "Mar 2024 — Jun 2024" },
    kind: { pt: "Meio período", en: "Part-time" },
    place: { pt: "Remoto", en: "Remote" },
    summary: {
      pt: "Desenvolvimento e manutenção de aplicações web responsivas e performáticas na área da saúde.",
      en: "Built and maintained responsive, performant web applications in the healthcare space.",
    },
    highlights: [
      {
        pt: "Aplicações com React, Next.js, TypeScript e Styled Components, com interfaces consistentes em todos os dispositivos.",
        en: "Applications with React, Next.js, TypeScript and Styled Components, consistent across all devices.",
      },
      {
        pt: "Correção de bugs, testes e validações que reduziram falhas e deixaram as entregas mais seguras.",
        en: "Bug fixing, testing and validation that reduced failures and made releases safer.",
      },
      {
        pt: "Integrações com APIs para um fluxo de dados eficiente entre front-end e back-end.",
        en: "API integrations for efficient data flow between front-end and back-end.",
      },
    ],
    stack: ["React", "Next.js", "TypeScript", "Styled Components"],
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

export default function Experience() {
  const { locale } = useI18n();
  const lang: Lang = locale === "pt" ? "pt" : "en";
  const isPt = lang === "pt";

  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-title"
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <div className="about-reveal mb-10 sm:mb-14" style={vars({ "--i": 0 })}>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-8 bg-[var(--color-primary)]" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {isPt ? "Experiência" : "Experience"}
            </span>
          </div>
          <h2
            id="experiencia-title"
            className="title-3d max-w-3xl font-black leading-[1.05] tracking-tight text-balance"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
          >
            {isPt ? "Onde já entreguei" : "Where I've shipped"}
          </h2>
        </div>

        <ol className="experience-list relative space-y-5 sm:space-y-6">
          {JOBS.map((job, i) => (
            <li
              key={job.company}
              className="about-reveal relative md:pl-12"
              style={vars({ "--i": i + 1 })}
            >
              <span
                className="experience-dot"
                data-current={i === 0 ? "true" : "false"}
                aria-hidden="true"
              >
                <span />
              </span>

              <article
                onPointerMove={trackPointer}
                className="about-card grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-10"
              >
                <header className="space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {job.period[lang]}
                  </p>
                  <h3 className="text-lg font-bold text-[var(--color-foreground)]">
                    {job.company}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-[var(--color-foreground)]/80">
                    <Briefcase size={14} aria-hidden="true" />
                    {job.role[lang]}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <MapPin size={13} aria-hidden="true" />
                    {job.place[lang]} · {job.kind[lang]}
                  </p>
                </header>

                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-[var(--color-foreground)] md:text-base">
                    {job.summary[lang]}
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {job.highlights.map((item) => (
                      <li
                        key={item.en}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]"
                      >
                        <span
                          className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                        <span>{item[lang]}</span>
                      </li>
                    ))}
                  </ul>

                  <ul
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label={isPt ? "Tecnologias" : "Technologies"}
                  >
                    {job.stack.map((tech) => (
                      <li
                        key={tech}
                        className="experience-tech rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 font-mono text-xs text-[var(--color-muted)]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}