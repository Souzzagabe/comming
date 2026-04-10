"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Skill = {
  name: string;
  level: number; // 0-100
  tag: "Avançado" | "Intermediário";
};

const categories: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "Next.js / React", level: 95, tag: "Avançado" },
      { name: "Angular", level: 88, tag: "Avançado" },
      { name: "TypeScript", level: 92, tag: "Avançado" },
      { name: "Tailwind CSS", level: 90, tag: "Avançado" },
      { name: "Styled Components", level: 85, tag: "Avançado" },
      { name: "Material UI / Chakra UI", level: 85, tag: "Avançado" },
      { name: "GSAP / Framer Motion", level: 80, tag: "Avançado" },
      { name: "SVG & Animações", level: 82, tag: "Avançado" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 85, tag: "Avançado" },
      { name: "PHP", level: 75, tag: "Intermediário" },
      { name: "APIs REST", level: 90, tag: "Avançado" },
      { name: "Banco de Dados", level: 78, tag: "Intermediário" },
    ],
  },
  {
    title: "Ferramentas & Testes",
    skills: [
      { name: "Git / GitHub", level: 90, tag: "Avançado" },
      { name: "Jest", level: 80, tag: "Avançado" },
      { name: "Docker", level: 65, tag: "Intermediário" },
      { name: "Figma", level: 72, tag: "Intermediário" },
      { name: "CI/CD", level: 70, tag: "Intermediário" },
    ],
  },
];

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-foreground)]">{skill.name}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            skill.tag === "Avançado"
              ? "bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]"
              : "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          }`}
        >
          {skill.tag}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="habilidades" className="py-24 md:py-32 bg-[var(--color-card)]/50">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            Habilidades
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Meu arsenal técnico
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * ci }}
            >
              <h3 className="text-lg font-semibold mb-6 text-[var(--color-foreground)]">
                {cat.title}
              </h3>
              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    delay={0.1 * si + 0.2}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
