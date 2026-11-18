import type { Metadata } from "next";
import CookiePolicyContent from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Política de Cookies | Souzzagabe",
  description:
    "Política de cookies do portfólio de Gabriel de Souza. Saiba como o armazenamento local e de sessão é usado e como gerenciar suas preferências.",
  alternates: { canonical: "/politica-de-cookies" },
  openGraph: {
    title: "Política de Cookies | Souzzagabe",
    description:
      "Saiba como o armazenamento local e de sessão é usado no portfólio de Gabriel de Souza e como gerenciar suas preferências.",
    url: "/politica-de-cookies",
    siteName: "Souzzagabe",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Política de Cookies | Souzzagabe",
    description:
      "Saiba como o armazenamento local e de sessão é usado no portfólio de Gabriel de Souza e como gerenciar suas preferências.",
  },
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
