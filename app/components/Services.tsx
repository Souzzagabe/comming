"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Layout, Server, Link2, Sparkles, BookOpen } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const ICONS = [Globe, Layout, Server, Link2, Sparkles, BookOpen] as const;
const ACCENTS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-purple)",
  "var(--color-primary)",
  "var(--color-secondary)",
] as const;

export default function Services() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const services = [
    { title: t.services.s1_title, desc: t.services.s1_desc },
    { title: t.services.s2_title, desc: t.services.s2_desc },
    { title: t.services.s3_title, desc: t.services.s3_desc },
    { title: t.services.s4_title, desc: t.services.s4_desc },
    { title: t.services.s5_title, desc: t.services.s5_desc },
    { title: t.services.s6_title, desc: t.services.s6_desc },
  ];

  return (
    <section id="servicos" className="relative py-24 md:py-32 bg-[var(--color-background)]">
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)" }} />

      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-[var(--color-primary)] uppercase">{t.services.label}</span>
          </div>
          <h2 className="font-black leading-tight tracking-tight text-[var(--color-foreground)]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            {t.services.title}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = ICONS[i];
            const color = ACCENTS[i];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08 * i }}
                className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}0D 0%, transparent 60%)` }}
                />
                <div
                  className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${color}50, transparent)` }}
                />
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${color}15`, color }}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-[var(--color-foreground)]">{service.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

