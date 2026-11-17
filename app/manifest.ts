import type { MetadataRoute } from "next";

// Gera /manifest.webmanifest (ícone na tela inicial do celular). 100% estático.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gabriel de Souza — Desenvolvedor Full Stack",
    short_name: "GS.",
    description:
      "Portfólio de Gabriel de Souza: sites estratégicos, landing pages, sistemas web e aplicações.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#f2c913",
    icons: [
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
