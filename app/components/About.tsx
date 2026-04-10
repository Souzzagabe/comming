"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Lightbulb, Rocket } from "lucide-react";

const highlights = [
  {
    icon: <Code2 size={24} />,
    title: "Código limpo",
    desc: "Componentização, escalabilidade e boas práticas em cada projeto.",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Mentalidade de produto",
    desc: "Foco em UX, performance e entregas que geram valor real.",
  },
  {
    icon: <Rocket size={24} />,
    title: "Entrega contínua",
    desc: "Atuação ágil, comunicação constante e deploys frequentes.",
  },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-[var(--color-primary-light)]">
            Sobre mim
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Quem está por trás do código
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5 text-[var(--color-muted)] leading-relaxed"
          >
            <p>
              Sou desenvolvedor <strong className="text-[var(--color-foreground)]">Fullstack com foco em Frontend</strong>, 
              apaixonado por criar interfaces que combinam performance, estética e usabilidade.
            </p>
            <p>
              Tenho experiência sólida com <strong className="text-[var(--color-foreground)]">Next.js, Angular, Node.js e PHP</strong>, 
              atuando na integração entre frontend e backend, consumo de APIs, interfaces dinâmicas 
              e responsivas, e validações complexas como CPF/CNPJ e formulários dinâmicos.
            </p>
            <p>
              Trabalho com <strong className="text-[var(--color-foreground)]">Styled Components, Material UI, Chakra UI</strong> e 
              domino ferramentas de animação como <strong className="text-[var(--color-foreground)]">GSAP + ScrollTrigger</strong> e 
              manipulação avançada de SVG. Testes com Jest fazem parte do meu fluxo.
            </p>
            <p>
              Atuo em ambientes ágeis com entrega contínua e comunicação constante entre times. 
              Também realizo <strong className="text-[var(--color-foreground)]">freelancers de criação de sites e landing pages</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid gap-6"
          >
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors hover:border-[var(--color-primary)]/40"
              >
                <div className="mt-1 rounded-lg bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary-light)]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
