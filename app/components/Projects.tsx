"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

export default function Projects() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const projects = [
    {
      num: "01",
      title: t.projects.p1_title,
      description: t.projects.p1_desc,
      result: t.projects.p1_result,
      techs: ["Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Jest"],
      accent: "var(--color-primary)" as const,
    },
    {
      num: "02",
      title: t.projects.p2_title,
      description: t.projects.p2_desc,
      result: t.projects.p2_result,
      techs: ["Angular", "GSAP", "D3.js", "Material UI", "PHP"],
      accent: "var(--color-secondary)" as const,
    },
    {
      num: "03",
      title: t.projects.p3_title,
      description: t.projects.p3_desc,
      result: t.projects.p3_result,
      techs: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
      accent: "var(--color-accent)" as const,
    },
  ];

  return (
    <section id="projetos" className="relative py-24 md:py-32 bg-[var(--color-background)]">
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)" }} />

      <div ref={ref} className="mx-auto max-w-7xl px-8 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-[var(--color-primary)] uppercase">{t.projects.label}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-black leading-tight tracking-tight text-[var(--color-foreground)]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              {t.projects.title}
            </h2>
            <p className="text-[var(--color-muted)] max-w-md text-sm md:text-base leading-relaxed">{t.projects.description}</p>
          </div>
        </motion.div>

        <div className="space-y-5">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 50%, ${project.accent}0D 0%, transparent 55%)` }}
              />
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: project.accent, opacity: 0.6 }} />

              <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8 pl-8 md:pl-10">
                <span className="shrink-0 text-4xl md:text-5xl font-black leading-none select-none" style={{ color: project.accent, opacity: 0.25 }}>
                  {project.num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-foreground)] mb-2">{project.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">{project.description}</p>
                  <p className="mt-3 text-xs font-medium" style={{ color: project.accent }}>↗ {project.result}</p>
                </div>

                <div className="flex flex-wrap gap-2 md:max-w-[280px]">
                  {project.techs.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono text-[var(--color-muted)] border border-[var(--color-border)] bg-[var(--color-background)]">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 shrink-0">
                  <button aria-label={t.projects.view_code} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/40 transition-all">
                    <Github size={17} />
                  </button>
                  <button aria-label={t.projects.view_demo} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/40 transition-all">
                    <ExternalLink size={17} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

