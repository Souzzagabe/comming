import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { I18nProvider } from "./contexts/i18n-context";
import CookieConsent from "./components/CookieConsent";
import JsonLd from "./components/JsonLd";
import { SITE_URL } from "./seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Gabriel de Souza | Desenvolvedor Full Stack",
  description:
    "Desenvolvedor Full Stack com foco em Front-end. Crio sites, landing pages, sistemas web e aplicações com React, Next.js, Angular, Vue, Node.js e PHP.",
  applicationName: "Souzzagabe",
  alternates: { canonical: `${SITE_URL}/` },
  authors: [{ name: "Gabriel de Souza", url: SITE_URL }],
  creator: "Gabriel de Souza",
  openGraph: {
    title: "Gabriel de Souza | Desenvolvedor Full Stack",
    description:
      "Desenvolvedor Full Stack com foco em Front-end. Crio sites, landing pages, sistemas web e aplicações com React, Next.js, Angular, Vue, Node.js e PHP.",
    url: `${SITE_URL}/`,
    siteName: "Souzzagabe",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/fotosite.png",
        width: 880,
        height: 1206,
        alt: "Retrato de Gabriel de Souza em composição artística",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel de Souza | Desenvolvedor Full Stack",
    description:
      "Desenvolvedor Full Stack com foco em Front-end. Crio sites, landing pages, sistemas web e aplicações com React, Next.js, Angular, Vue, Node.js e PHP.",
    images: ["/fotosite.png"],
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
            <JsonLd />
          </I18nProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
