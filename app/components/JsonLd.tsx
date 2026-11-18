/**
 * Dados estruturados (schema.org) — ajudam o Google a entender quem você é.
 * 100% estático: sem API, sem JavaScript no cliente. Coloque <JsonLd /> uma vez, no layout ou na página.
 * Ajuste SITE_URL se o domínio mudar.
 */
import { SITE_URL } from "@/app/seo";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Gabriel de Souza — Desenvolvedor Full Stack",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Gabriel de Souza",
      url: `${SITE_URL}/`,
      jobTitle: "Desenvolvedor Full Stack (foco em Front-end)",
      description:
        "Desenvolvedor Full Stack com foco em Front-end. Sites estratégicos, landing pages, sistemas web, e-commerce e aplicações.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Alegre",
        addressRegion: "RS",
        addressCountry: "BR",
      },
      worksFor: { "@type": "Organization", name: "Target.IT Serviços em Tecnologia" },
      knowsAbout: [
        "React",
        "Next.js",
        "Angular",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Java",
        "PHP",
        "WordPress",
        "Jest",
        "UX/UI",
        "Desenvolvimento Front-end",
        "Performance web",
      ],
      sameAs: [
        "https://github.com/Souzzagabe",
        "https://www.linkedin.com/in/gabriel-souza-web/",
        "https://www.instagram.com/souzzagabe/",
      ],
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}