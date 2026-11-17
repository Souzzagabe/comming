"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n-context";

const CONSENT_KEY = "gs-cookie-consent-v1";

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setVisible(localStorage.getItem(CONSENT_KEY) === null);
      } catch (error) {
        console.error("Could not read cookie consent preference.", error);
        setVisible(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function chooseConsent(choice: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
      setVisible(false);
      setStorageError(false);
    } catch (error) {
      console.error("Could not save cookie consent preference.", error);
      setStorageError(true);
    }
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={t.cookieConsent.region}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_-12px_40px_rgb(0_0_0/35%)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
          {t.cookieConsent.message}{" "}
          <a
            href="/politica-de-cookies"
            className="font-semibold text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-light)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
          >
            {t.cookieConsent.policy}
          </a>
        </p>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => chooseConsent("rejected")}
            className="min-h-11 rounded-full border border-[var(--color-border)] px-5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            {t.cookieConsent.reject}
          </button>
          <button
            type="button"
            onClick={() => chooseConsent("accepted")}
            className="min-h-11 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-background)] transition-colors hover:bg-[var(--color-primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            {t.cookieConsent.accept}
          </button>
        </div>

        {storageError && (
          <p role="alert" className="text-sm text-[var(--color-primary-light)]">
            {t.cookieConsent.storageError}
          </p>
        )}
      </div>
    </aside>
  );
}
