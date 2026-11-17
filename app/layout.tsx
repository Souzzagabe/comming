import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { I18nProvider } from "./contexts/i18n-context";
import CookieConsent from "./components/CookieConsent";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Souzzagabe | Desenvolvedor Fullstack",
  description:
    "Desenvolvedor Fullstack com foco em Frontend. Especialista em Next.js, Angular, Node.js e PHP. Criação de interfaces modernas, responsivas e performáticas.",
  keywords: [
    "desenvolvedor fullstack",
    "frontend",
    "next.js",
    "angular",
    "react",
    "node.js",
    "freelancer",
    "criação de sites",
    "landing page",
  ],
  authors: [{ name: "Gabriel Souza" }],
  openGraph: {
    title: "Souzzagabe | Desenvolvedor Fullstack",
    description:
      "Desenvolvedor Fullstack com foco em Frontend. Interfaces modernas e performáticas.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionConfig reducedMotion="user">
          <I18nProvider>
            {children}
            <CookieConsent />
          </I18nProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
