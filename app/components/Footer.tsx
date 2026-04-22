"use client";

import { Github, Linkedin, Instagram } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const socials = [
  { icon: <Github size={18} />, href: "https://github.com/Souzzagabe", label: "GitHub" },
  { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/gabriel-souza-web/", label: "LinkedIn" },
  { icon: <Instagram size={18} />, href: "https://www.instagram.com/souzzagabe/", label: "Instagram" },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-[var(--color-border)] py-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} — Desenvolvido por{" "}
          <a
            href="https://www.instagram.com/souzzagabe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline font-medium"
          >
            @souzzagabe
          </a>
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors hover:scale-110"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

