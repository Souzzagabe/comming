"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");

  const navLinks = [
    { href: "#home",     label: t.nav.home     },
    { href: "#sobre",    label: t.nav.about    },
    { href: "#servicos", label: t.nav.services },
    { href: "#contato",  label: t.nav.contact  },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "sobre", "servicos", "contato"];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-[var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={54}
            className="h-9 sm:h-11 md:h-14 w-auto object-contain"
            priority
          />
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative px-3.5 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  active === link.href
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all"
            aria-label="Toggle language"
          >
            <span className={locale === "pt" ? "text-[var(--color-primary)]" : ""}>PT</span>
            <span className="text-[var(--color-border)]">/</span>
            <span className={locale === "en" ? "text-[var(--color-primary)]" : ""}>EN</span>
          </button>

          <a
            href="#contato"
            className="hidden md:flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/8 px-5 py-2 text-xs font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/70"
          >
            {t.nav.hire}
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-card)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[var(--color-background)]/96 backdrop-blur-xl border-b border-[var(--color-border)]"
          >
            <ul className="flex flex-col items-center gap-1 py-6 px-4">
              {navLinks.map((link) => (
                <li key={link.href} className="w-full max-w-xs">
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-center py-3 rounded-xl text-base transition-colors ${
                      active === link.href
                        ? "bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

