"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { Send, MessageCircle, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="contato" className="py-24 md:py-32 bg-[var(--color-card)]/50">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            Contato
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Vamos trabalhar juntos?
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">
            Tem um projeto em mente? Entre em contato e vamos transformar sua
            ideia em realidade.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-light)] transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-light)] transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Assunto
              </label>
              <input
                id="subject"
                type="text"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-light)] transition-colors"
                placeholder="Sobre o que gostaria de falar?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensagem
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-light)] transition-colors"
                placeholder="Descreva seu projeto..."
              />
            </div>

            <button
              type="submit"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/25 hover:scale-105 disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? "Enviado!" : "Enviar mensagem"}
              <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.form>

          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary-light)]">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Email</h4>
                  <p className="text-sm text-[var(--color-muted)]">
                    contato@seudominio.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[var(--color-accent)]/10 p-2.5 text-[var(--color-accent)]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Localização</h4>
                  <p className="text-sm text-[var(--color-muted)]">
                    Brasil — Remoto
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5500000000000?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/10 p-5 text-[#25d366] font-semibold transition-all hover:bg-[#25d366]/20 hover:scale-[1.02]"
            >
              <MessageCircle size={22} />
              Chamar no WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
