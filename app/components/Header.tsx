"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const SECTION_IDS = ["home", "sobre", "experiencia", "servicos", "contato"] as const;
const FOCUSABLE = "a[href], button:not([disabled])";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");

  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeIndexRef = useRef(0);

  const isPt = locale === "pt";
  const labels = {
    nav: isPt ? "Navegação principal" : "Main navigation",
    menu: "Menu",
    open: isPt ? "Abrir menu" : "Open menu",
    close: isPt ? "Fechar menu" : "Close menu",
    language: isPt ? "Idioma" : "Language",
  };

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#sobre", label: t.nav.about },
    { href: "#experiencia", label: isPt ? "Experiência" : "Experience" },
    { href: "#servicos", label: t.nav.services },
    { href: "#contato", label: t.nav.contact },
  ];

  const activeIndex = Math.max(
    0,
    navLinks.findIndex((link) => link.href === active),
  );

  /** Move o "pill" deslizante para o link informado (sem re-render). */
  const moveIndicator = useCallback((index: number) => {
    const list = listRef.current;
    const link = linkRefs.current[index];
    if (!list || !link) return;
    list.style.setProperty("--ix", `${link.offsetLeft}px`);
    list.style.setProperty("--iw", `${link.offsetWidth}px`);
    linkRefs.current.forEach((el, i) => {
      if (el) el.dataset.current = String(i === index);
    });
  }, []);

  // Scroll: fundo ao rolar, esconde ao descer / mostra ao subir, e último item no fim da página.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 240);
        lastY = y;
      }
      if (y <= 0) setHidden(false);

      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
        setActive("#contato");
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Seção ativa: um único observer para todas as seções.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Indicador deslizante: acompanha o link ativo e re-mede se a largura mudar (idioma, fonte).
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    moveIndicator(activeIndex);
  }, [activeIndex, moveIndicator]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => moveIndicator(activeIndexRef.current);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure);

    // primeira posição sem animar a partir de 0
    const frame = requestAnimationFrame(() => {
      measure();
      list.dataset.ready = "true";
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [moveIndicator]);

  // Menu mobile: trava scroll, foco, Esc, Tab preso e fecha ao ir para desktop.
  useEffect(() => {
    if (!mobileOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = [headerRef.current, menuRef.current]
        .flatMap((container) =>
          container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)) : [],
        )
        .filter((el) => el.getClientRects().length > 0);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (current === first || !nodes.includes(current as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !nodes.includes(current as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [mobileOpen]);

  // Com o menu aberto o fundo é amarelo → o header usa o tema claro.
  const theme = scrolled && !mobileOpen ? "dark" : "light";

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-theme={theme}
        data-compact={scrolled ? "true" : "false"}
        data-hidden={hidden && !mobileOpen ? "true" : "false"}
      >
        <nav
          aria-label={labels.nav}
          className="site-header-bar mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <a href="#home" className="site-logo" aria-label="GS. — Home">
            GS<span>.</span>
          </a>

          <ul
            ref={listRef}
            className="site-nav hidden items-center gap-1 md:flex"
            onPointerLeave={() => moveIndicator(activeIndexRef.current)}
            onBlur={() => moveIndicator(activeIndexRef.current)}
          >
            <li className="site-nav-indicator" aria-hidden="true" />
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  aria-current={active === link.href ? "location" : undefined}
                  className="site-nav-link"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") moveIndicator(i);
                  }}
                  onFocus={() => moveIndicator(i)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <div role="group" aria-label={labels.language} className="site-lang">
              {(["pt", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  lang={code}
                  aria-pressed={locale === code}
                  onClick={() => setLocale(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <a href="#contato" className="site-cta hidden items-center gap-1.5 md:inline-flex">
              {t.nav.hire}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="site-toggle md:hidden"
              aria-label={mobileOpen ? labels.close : labels.open}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span className="site-burger" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Fora do <header>: o backdrop-filter dele criaria um containing block e
          quebraria o `position: fixed` do overlay. */}
      <nav
        id="mobile-navigation"
        ref={menuRef}
        aria-label={labels.menu}
        data-open={mobileOpen ? "true" : "false"}
        className="site-menu md:hidden"
      >
        <ul className="site-menu-list">
          {navLinks.map((link, i) => (
            <li key={link.href} style={vars({ "--i": i })}>
              <a
                href={link.href}
                aria-current={active === link.href ? "location" : undefined}
                onClick={() => setMobileOpen(false)}
                className="site-menu-link"
              >
                <span className="site-menu-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="site-menu-foot" style={vars({ "--i": navLinks.length })}>
          <a href="#contato" onClick={() => setMobileOpen(false)} className="site-menu-cta">
            {t.nav.hire}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href="mailto:gabweb95@gmail.com" className="site-menu-mail">
            gabweb95@gmail.com
          </a>
        </div>
      </nav>
    </>
  );
}