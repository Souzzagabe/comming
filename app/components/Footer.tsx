import { Github, Linkedin, Instagram } from "lucide-react";

const socials = [
  { icon: <Github size={18} />, href: "https://github.com/Souzzagabe", label: "GitHub" },
  {
    icon: <Linkedin size={18} />,
    href: "https://www.linkedin.com/in/gabriel-souza-web/",
    label: "LinkedIn",
  },
  {
    icon: <Instagram size={18} />,
    href: "https://www.instagram.com/souzzagabe/",
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-surface)] py-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8 lg:px-12">
        <a
          href="#home"
          className="text-xl font-bold tracking-[-0.09em] text-[var(--color-foreground)]"
          aria-label="GS. — Início"
        >
          GS<span className="text-[var(--color-primary)]">.</span>
        </a>
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
              className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
