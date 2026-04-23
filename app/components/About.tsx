"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Lightbulb, Rocket, Layers, TestTube2, Globe } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const traits = [
  { icon: Code2,     title: "Clean Code",  desc: "Componentizacao, escalabilidade e boas praticas.",       color: "var(--color-primary)"   },
  { icon: Lightbulb, title: "UX Focus",    desc: "Interfaces intuitivas centradas no usuario.",             color: "var(--color-secondary)" },
  { icon: Rocket,    title: "Performance", desc: "Score 98+ no Lighthouse, Core Web Vitals.",               color: "var(--color-accent)"    },
  { icon: Layers,    title: "Fullstack",   desc: "Frontend e backend integrados sem friccao.",               color: "var(--color-primary)"   },
  { icon: TestTube2, title: "Testes",      desc: "Jest, TDD e fluxo de entrega continua.",                  color: "var(--color-secondary)" },
  { icon: Globe,     title: "Freelancer",  desc: "Sites, landing pages e sistemas sob demanda.",             color: "var(--color-accent)"    },
] as const;

export default function About() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sobre" className="relative py-24 md:py-32 bg-[var(--color-background)]">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)" }}
      />

      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-start">

          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[var(--color-primary)]" />
                <span className="text-[11px] font-mono tracking-[0.3em] text-[var(--color-primary)] uppercase">
                  {t.about.label}
                </span>
              </div>
              <h2 className="font-black leading-tight tracking-tight">
                <span
                  className="block text-[var(--color-foreground)]"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                >
                  {t.about.title1}
                </span>
                <span
                  className="block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                >
                  {t.about.title2}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 space-y-4 text-[var(--color-muted)] leading-relaxed text-sm md:text-base"
            >
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p4}</p>
            </motion.div>

          </div>

          {/* RIGHT - trait cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {traits.map((trait, i) => {
              const Icon = trait.icon;
              return (
                <motion.div
                  key={trait.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 20% 20%, ${trait.color}18 0%, transparent 65%)` }}
                  />
                  <div
                    className="inline-flex w-10 h-10 items-center justify-center rounded-xl"
                    style={{ background: `${trait.color}18`, color: trait.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-foreground)]">{trait.title}</h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed">{trait.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}