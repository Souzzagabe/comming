"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Layout, Server, Link2 } from "lucide-react";

const services = [
  {
    icon: <Globe size={28} />,
    title: "Criação de Sites",
    description:
      "Sites institucionais modernos, responsivos e otimizados para SEO. Design profissional que transmite credibilidade.",
    features: ["Responsivo", "SEO otimizado", "Performance A+"],
  },
  {
    icon: <Layout size={28} />,
    title: "Landing Pages",
    description:
      "Páginas de alta conversão com design impactante, animações suaves e foco total em resultados.",
    features: ["Alta conversão", "Animações", "CTA otimizado"],
  },
  {
    icon: <Server size={28} />,
    title: "Sistemas Web",
    description:
      "Aplicações web completas com dashboard, autenticação, painéis administrativos e lógica de negócios.",
    features: ["Fullstack", "Escalável", "Seguro"],
  },
  {
    icon: <Link2 size={28} />,
    title: "Integrações",
    description:
      "Integração com APIs, gateways de pagamento, ERPs e serviços externos. Dados fluindo sem atrito.",
    features: ["APIs REST", "Webhooks", "Automação"],
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicos" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            Serviços
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Como posso te ajudar
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">
            Ofereço soluções sob medida para empresas e empreendedores que
            precisam de presença digital de qualidade.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 * i }}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/5"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[var(--color-primary)]/10 p-3 text-[var(--color-primary-light)] group-hover:bg-[var(--color-primary)]/20 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs text-[var(--color-muted)] border border-[var(--color-border)]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
