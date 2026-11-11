"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type LoaderPhase = "loading" | "exiting" | "done";

export default function PageLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.classList.remove("page-ready");
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("exiting"), 750);
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.add("page-ready");
      setPhase("done");
    }, 1000);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("page-ready");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`page-loader${phase === "exiting" ? " page-loader-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando portfólio"
      aria-busy="true"
    >
      <div className="page-loader-content">
        <div className="page-loader-portrait">
          <Image
            src="/Gemini_Generated_Image_.png"
            alt="Gabriel de Souza"
            fill
            priority
            sizes="(max-width: 767px) 78vw, 360px"
            className="page-loader-image"
          />
        </div>
        <div className="page-loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
