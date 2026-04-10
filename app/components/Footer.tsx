"use client";

import { Github, Linkedin, Instagram } from "lucide-react";

const socials = [
  { icon: <Github size={18} />, href: "https://github.com/", label: "GitHub" },
  { icon: <Linkedin size={18} />, href: "https://linkedin.com/in/", label: "LinkedIn" },
  { icon: <Instagram size={18} />, href: "https://instagram.com/", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} — Feito com Next.js & Tailwind CSS
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
