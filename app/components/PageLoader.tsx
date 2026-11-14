"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type LoaderPhase = "loading" | "exiting" | "done";

const SESSION_KEY = "gs-loader-seen";
const MAX_WAIT = 3500; // trava de segurança: nunca prende o visitante além disso

/**
 * full  → primeira visita da sessão (contador + cortina completa)
 * quick → visita repetida ou prefers-reduced-motion (curto e discreto)
 * min   → tempo mínimo do contador · ready → libera o hero (page-ready) · done → remove o loader
 */
const TIMING = {
  full: { min: 1000, ready: 500, done: 1300 },
  quick: { min: 350, ready: 250, done: 800 },
} as const;

export default function PageLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quick = seen || reduceMotion;
    const timing = quick ? TIMING.quick : TIMING.full;
    root.dataset.mode = quick ? "quick" : "full";

    const previousOverflow = document.body.style.overflow;
    document.body.classList.remove("page-ready");
    document.body.style.overflow = "hidden";

    // O contador reflete o carregamento real: fontes, imagem do retrato e evento load.
    const TOTAL = 3;
    let tasks = 0;
    const mark = () => {
      tasks += 1;
    };

    if (document.fonts?.ready) document.fonts.ready.then(mark, mark);
    else mark();

    const image = root.querySelector("img");
    if (!image || image.complete) {
      mark();
    } else {
      image.addEventListener("load", mark, { once: true });
      image.addEventListener("error", mark, { once: true });
    }

    if (document.readyState === "complete") mark();
    else window.addEventListener("load", mark, { once: true });

    const timers: number[] = [];
    const start = performance.now();
    let frame = 0;
    let last = 0;
    let shown = 0;
    let finished = false;

    const render = (value: number) => {
      root.style.setProperty("--p", value.toFixed(1));
      counter.textContent = String(Math.round(value)).padStart(3, "0");
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      render(100);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}

      setPhase("exiting");
      // o hero começa a entrar enquanto a cortina ainda está subindo
      timers.push(
        window.setTimeout(() => {
          document.body.style.overflow = previousOverflow;
          document.body.classList.add("page-ready");
        }, timing.ready),
      );
      timers.push(window.setTimeout(() => setPhase("done"), timing.done));
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const elapsed = now - start;

      const timeProgress = Math.min(1, elapsed / timing.min);
      const eased = 1 - (1 - timeProgress) ** 3;
      // enquanto algo ainda carrega, o contador "espera" em até ~92%
      const taskProgress = tasks / TOTAL;
      const cap = taskProgress >= 1 ? 1 : 0.12 + taskProgress * 0.8;
      const target = Math.min(eased, cap) * 100;

      shown += (target - shown) * (1 - Math.exp(-dt / 90));

      if (target >= 100 && shown > 99.2) {
        finish();
        return;
      }
      render(shown);

      if (elapsed > MAX_WAIT) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", mark);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("page-ready");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      className={`page-loader${phase === "exiting" ? " page-loader-exiting" : ""}`}
      data-mode="full"
      role="status"
      aria-live="polite"
      aria-label="Carregando portfólio"
      aria-busy={phase === "loading"}
    >
      <div className="page-loader-top" aria-hidden="true">
        <span className="page-loader-logo">
          GS<span>.</span>
        </span>
        <span className="page-loader-meta">Gabriel de Souza</span>
      </div>

      <div className="page-loader-center">
        <div className="page-loader-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="page-loader-track" cx="50" cy="50" r="48.5" fill="none" />
            <circle
              className="page-loader-arc"
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              pathLength={100}
            />
          </svg>
          <div className="page-loader-portrait">
            <Image
              src="/Gemini_Generated_Image_.png"
              alt="Gabriel de Souza"
              fill
              priority
              /* mesmo `sizes` do Hero → o navegador baixa UMA versão da imagem e reaproveita */
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 75vw, 48vw"
              className="page-loader-image"
            />
          </div>
        </div>
      </div>

      <div className="page-loader-bottom" aria-hidden="true">
        <div className="page-loader-counter">
          <span ref={counterRef}>000</span>
          <small>%</small>
        </div>
        <span className="page-loader-meta page-loader-role">Frontend · Fullstack</span>
      </div>

      <div className="page-loader-bar" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}