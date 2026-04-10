import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfólio | Desenvolvedor Fullstack",
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
  authors: [{ name: "Dev Fullstack" }],
  openGraph: {
    title: "Portfólio | Desenvolvedor Fullstack",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
