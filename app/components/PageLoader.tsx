"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type LoaderPhase = "loading" | "exiting" | "done";

const MIN_DURATION = 1400; // tempo mínimo na tela (ms)
const EXIT_DURATION = 700; // duração da saída (ms)
const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function PageLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.classList.remove("page-ready");
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let frame = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      setPhase("exiting");
      document.body.classList.add("page-ready");
      doneTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        setPhase("done");
      }, EXIT_DURATION);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const pageLoaded = document.readyState === "complete";
      // Avança de forma suave até 90%; só chega a 100% quando a página carregou
      const eased = 1 - Math.pow(1 - Math.min(elapsed / MIN_DURATION, 1), 3);
      const target = pageLoaded ? 100 : Math.min(eased * 100, 90);
      setProgress((p) => Math.max(p, Math.round(target)));

      if (elapsed >= MIN_DURATION && pageLoaded) {
        exitTimer = window.setTimeout(finish, 150);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`page-loader${phase === "exiting" ? " page-loader-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando portfólio"
      aria-busy={phase === "loading"}
    >
      {/* Duas cortinas que se abrem na saída */}
      <div className="page-loader-curtain page-loader-curtain-top" aria-hidden="true" />
      <div className="page-loader-curtain page-loader-curtain-bottom" aria-hidden="true" />
      <div className="page-loader-grid" aria-hidden="true" />

      <div className="page-loader-content">
        <div className="page-loader-stage">
          <svg
            className="page-loader-ring"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle className="page-loader-ring-track" cx="50" cy="50" r={RING_RADIUS} />
            <circle
              className="page-loader-ring-bar"
              cx="50"
              cy="50"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress / 100)}
            />
          </svg>

          <div className="page-loader-portrait">
            <Image
              src="/Gemini_Generated_Image_.png"
              alt="Gabriel de Souza"
              fill
              priority
              sizes="(max-width: 767px) 60vw, 300px"
              className="page-loader-image"
            />
          </div>
        </div>

        <p className="page-loader-counter" aria-hidden="true">
          {String(progress).padStart(3, "0")}
          <span>%</span>
        </p>
      </div>
    </div>
  );
}