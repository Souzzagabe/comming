"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#sobre", label: t.nav.about },
    { href: "#servicos", label: t.nav.services },
    { href: "#contato", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const observers = ["home", "sobre", "servicos", "contato"].flatMap((id) => {
      const section = document.getElementById(id);
      if (!section) return [];
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(`#${id}`);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      observer.observe(section);
      return [observer];
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-[var(--color-border)] bg-black/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <button
          onClick={() => scrollTo("home")}
          className={`rounded-lg text-2xl font-bold tracking-[-0.09em] transition-colors ${
            scrolled ? "text-[var(--color-foreground)]" : "text-black"
          }`}
          aria-label="GS. — Home"
        >
          GS
          <span className={scrolled ? "text-[var(--color-primary)]" : "text-black"}>.</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => scrollTo(link.href.slice(1))}
                aria-current={active === link.href ? "location" : undefined}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  scrolled
                    ? active === link.href
                      ? "bg-[var(--color-surface)] text-[var(--color-foreground)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    : active === link.href
                      ? "bg-black/10 text-black"
                      : "text-black/70 hover:text-black"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
            className={`inline-flex min-h-11 items-center gap-1 rounded-full border px-3 text-xs font-bold transition-colors ${
              scrolled
                ? "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                : "border-black/30 text-black/75 hover:border-black hover:text-black"
            }`}
            aria-label={
              locale === "pt" ? "Change language to English" : "Mudar idioma para português"
            }
          >
            <span
              className={locale === "pt" && scrolled ? "text-[var(--color-primary)]" : "text-black"}
            >
              PT
            </span>
            <span aria-hidden="true">/</span>
            <span
              className={locale === "en" && scrolled ? "text-[var(--color-primary)]" : "text-black"}
            >
              EN
            </span>
          </button>

          <button
            onClick={() => scrollTo("contato")}
            className={`hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all hover:-translate-y-0.5 md:flex ${
              scrolled
                ? "bg-[var(--color-primary)] text-black"
                : "bg-black text-[var(--color-primary)]"
            }`}
          >
            {t.nav.hire}
          </button>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className={`inline-flex size-11 items-center justify-center rounded-full border md:hidden ${
              scrolled
                ? "border-[var(--color-border)] text-[var(--color-foreground)]"
                : "border-black/30 text-black"
            }`}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-[var(--color-border)] bg-black/95 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => {
                      scrollTo(link.href.slice(1));
                      setMobileOpen(false);
                    }}
                    className="min-h-12 w-full rounded-xl px-4 text-left text-base text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
