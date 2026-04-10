"use client";

import { motion } from "framer-motion";
import { ArrowDown, Send } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block mb-4 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-1.5 text-xs font-medium text-[var(--color-primary-light)]">
            Disponível para novos projetos
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight"
        >
          Desenvolvedor Fullstack
          <br />
          <span className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-accent)] bg-clip-text text-transparent">
            focado em experiências
          </span>
          <br />
          modernas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg text-[var(--color-muted)] max-w-2xl mx-auto"
        >
          Crio interfaces de alta performance com Next.js, Angular e Node.js.
          Do design ao deploy, transformo ideias em produtos digitais que geram
          resultados.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projetos"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/25 hover:scale-105"
          >
            Ver projetos
            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#contato"
            className="group flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-8 py-3.5 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary-light)] hover:scale-105"
          >
            Fale comigo
            <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
