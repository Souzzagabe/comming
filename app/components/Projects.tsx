"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "ValidaDocs",
    description:
      "Sistema completo de validação de documentos com CPF/CNPJ, formulários dinâmicos e integração com APIs governamentais. Interface responsiva com feedback em tempo real.",
    techs: ["Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Jest"],
    result:
      "Reduziu em 70% o tempo de validação manual de documentos para o cliente.",
    gradient: "from-[#6d28d9] to-[#06b6d4]",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Dashboard interativo com gráficos SVG animados, visualização de dados em tempo real e relatórios exportáveis. Animações com GSAP + ScrollTrigger.",
    techs: ["Angular", "GSAP", "D3.js", "Material UI", "PHP"],
    result:
      "Aumentou em 45% o engajamento dos usuários com os relatórios da plataforma.",
    gradient: "from-[#06b6d4] to-[#10b981]",
  },
  {
    title: "TechLanding Pro",
    description:
      "Landing page de alta conversão para startup de tecnologia. Animações suaves, performance otimizada e design mobile-first com Score 98 no Lighthouse.",
    techs: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    result:
      "Taxa de conversão de 12%, superando a média do mercado em 3x.",
    gradient: "from-[#8b5cf6] to-[#ec4899]",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projetos" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            Projetos
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            O que eu construo
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">
            Alguns dos projetos que demonstram minha experiência com interfaces
            modernas, integrações complexas e performance.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden transition-all hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/5"
            >
              {/* Gradient bar */}
              <div
                className={`h-1.5 bg-gradient-to-r ${project.gradient}`}
              />

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex gap-2 text-[var(--color-muted)]">
                    <button aria-label="GitHub" className="hover:text-[var(--color-foreground)] transition-colors">
                      <Github size={18} />
                    </button>
                    <button aria-label="Live demo" className="hover:text-[var(--color-foreground)] transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="mt-4 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 p-3">
                  <p className="text-xs font-medium text-[var(--color-primary-light)]">
                    📈 {project.result}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs text-[var(--color-muted)] border border-[var(--color-border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
