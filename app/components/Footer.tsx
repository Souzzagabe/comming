"use client";

import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const EMAIL = "gabweb95@gmail.com";
const WHATSAPP =
  "https://wa.me/5551989125407?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento";

const socials = [
  { icon: Github, href: "https://github.com/Souzzagabe", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/gabriel-souza-web/",
    label: "LinkedIn",
  },
  { icon: Instagram, href: "https://www.instagram.com/souzzagabe/", label: "Instagram" },
] as const;

const LINK =
  "group inline-flex items-center gap-2 rounded-md text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]";
const TITLE =
  "mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-foreground)]/50";
const ARROW =
  "opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100";

export default function Footer() {
  const { t, locale } = useI18n();
  const isPt = locale === "pt";
  const newTab = isPt ? "(abre em nova aba)" : "(opens in a new tab)";

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#sobre", label: t.nav.about },
    { href: "#servicos", label: t.nav.services },
    { href: "#contato", label: t.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] pt-14 sm:pt-20">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#home"
              aria-label={isPt ? "GS. — Início" : "GS. — Home"}
              className="inline-block rounded-md text-3xl font-bold tracking-[-0.09em] text-[var(--color-foreground)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
            >
              GS<span className="text-[var(--color-primary)]">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              {t.hero.role}
            </p>
          </div>

          <nav aria-label={isPt ? "Navegação do rodapé" : "Footer navigation"}>
            <h2 className={TITLE}>{isPt ? "Navegação" : "Navigation"}</h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={TITLE}>Social</h2>
            <ul className="space-y-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    <Icon size={16} aria-hidden="true" />
                    {label}
                    <span className="sr-only">{newTab}</span>
                    <ArrowUpRight size={14} aria-hidden="true" className={ARROW} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={TITLE}>{t.nav.contact}</h2>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${EMAIL}`} className={`${LINK} break-all`}>
                  <Mail size={16} aria-hidden="true" className="shrink-0" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only">{newTab}</span>
                  <ArrowUpRight size={14} aria-hidden="true" className={ARROW} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-[var(--color-muted)]">
            © {new Date().getFullYear()} — {isPt ? "Desenvolvido por" : "Built by"}{" "}
            <a
              href="https://www.instagram.com/souzzagabe/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-medium text-[var(--color-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
            >
              @souzzagabe
              <span className="sr-only"> {newTab}</span>
            </a>
          </p>

          <a
            href="#home"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-4 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
          >
            {isPt ? "Voltar ao topo" : "Back to top"}
            <ArrowUp
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* wordmark gigante, cortado na base (decorativo) */}
      <div
        aria-hidden="true"
        className="footer-wordmark pointer-events-none -mb-[0.16em] select-none bg-gradient-to-b from-[var(--color-primary)]/35 to-transparent bg-clip-text text-center text-[clamp(4.5rem,19vw,17rem)] font-black leading-[0.85] tracking-[-0.06em] text-transparent"
      >
        souzzagabe
      </div>
    </footer>
  );
}