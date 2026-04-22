"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import pt from "@/locales/pt.json";
import en from "@/locales/en.json";

type Locale = "pt" | "en";
type Translations = typeof pt;

const dictionaries: Record<Locale, Translations> = { pt, en };

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  return (
    <I18nContext.Provider
      value={{ locale, t: dictionaries[locale], setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
