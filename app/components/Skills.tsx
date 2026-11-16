"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useI18n } from "@/app/contexts/i18n-context";

type Lang = "pt" | "en";
type Text = Record<Lang, string>;

type Group = {
  title: Text;
  note: Text;
  items: { name: string; core?: boolean }[];
};

/**
 * Sem barras de porcentagem: números "de nível" não são verificáveis e
 * recrutadores desconfiam deles. Em vez disso, o destaque (core) marca o que
 * aparece no dia a dia das experiências profissionais.
 */
const GROUPS: Group[] = [
  {
    title: { pt: "Frontend", en: "Frontend" },
    note: {
      pt: "Interfaces responsivas, componentizadas e performáticas.",
      en: "Responsive, componentized, performant interfaces.",
    },
    items: [
      { name: "React", core: true },
      { name: "Next.js", core: true },
      { name: "TypeScript", core: true },
      { name: "Angular", core: true },
      { name: "JavaScript", core: true },
      { name: "Tailwind CSS" },
      { name: "Styled Components" },
      { name: "Material UI" },
      { name: "GSAP" },
      { name: "Framer Motion" },
      { name: "HTML & CSS" },
    ],
  },
  {
    title: { pt: "Backend & Dados", en: "Backend & Data" },
    note: {
      pt: "Integração de APIs e persistência em bancos relacionais e não relacionais.",
      en: "API integration and persistence on relational and non-relational databases.",
    },
    items: [
      { name: "Node.js", core: true },
      { name: "Express.js", core: true },
      { name: "APIs REST", core: true },
      { name: "Java" },
      { name: "PHP" },
      { name: "WordPress" },
      { name: "SQL" },
      { name: "NoSQL" },
      { name: "PostgreSQL" },
    ],
  },
  {
    title: { pt: "Qualidade & Processo", en: "Quality & Process" },
    note: {
      pt: "Entrega contínua, testes e trabalho em equipe multidisciplinar.",
      en: "Continuous delivery, testing and cross-functional teamwork.",
    },
    items: [
      { name: "Jest", core: true },
      { name: "Git / GitHub", core: true },
      { name: "Scrum", core: true },
      { name: "TDD" },
      { name: "CI/CD" },
      { name: "Docker" },
      { name: "RPA" },
      { name: "UI/UX" },
      { name: "Figma" },
    ],
  },
];

export default function Skills() {
  const { locale } = useI18n();
  const lang: Lang = locale === "pt" ? "pt" : "en";
  const isPt = lang === "pt";

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: inView || reduce ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay },
  });

  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-title"
      className="bg-[var(--color-card)]/50 py-16 sm:py-20 md:py-32"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-8">
        <motion.div {...fade(0)}>
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            {isPt ? "Habilidades" : "Skills"}
          </span>
          <h2 id="habilidades-title" className="mt-2 text-3xl font-bold md:text-4xl">
            {isPt ? "Meu arsenal técnico" : "My technical toolkit"}
          </h2>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span
              className="size-2 rounded-full bg-[var(--color-primary)]"
              aria-hidden="true"
            />
            {isPt ? "Destacadas: uso diário em projetos profissionais" : "Highlighted: daily use in professional projects"}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {GROUPS.map((group, i) => (
            <motion.div key={group.title.en} {...fade(0.12 * (i + 1))}>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                {group.title[lang]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {group.note[lang]}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className={`skill-chip rounded-full border px-3 py-1.5 font-mono text-xs ${
                      item.core
                        ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-foreground)]"
                        : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)]"
                    }`}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}