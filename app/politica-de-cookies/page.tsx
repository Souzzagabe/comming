import type { Metadata } from "next";
import CookiePolicyContent from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Política de Cookies | Souzzagabe",
  description:
    "Saiba quais tecnologias de armazenamento são usadas no site Souzzagabe e como gerenciar suas preferências.",
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
