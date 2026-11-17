"use client";

import Link from "next/link";
import { useI18n } from "@/app/contexts/i18n-context";

export default function CookiePolicyContent() {
  const { t, locale } = useI18n();
  const policy = t.cookiePolicy;
  const sections = [
    { title: policy.whatAreTitle, body: policy.whatAreBody },
    { title: policy.currentUseTitle, body: policy.currentUseBody },
    { title: policy.choicesTitle, body: policy.choicesBody },
    { title: policy.thirdPartiesTitle, body: policy.thirdPartiesBody },
    { title: policy.contactTitle, body: policy.contactBody },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-10 text-[var(--color-foreground)] sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[var(--color-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
        >
          ← {policy.backToSite}
        </Link>

        <header className="mt-8 border-b border-[var(--color-border)] pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            {policy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{policy.title}</h1>
          <p className="mt-5 leading-relaxed text-[var(--color-muted)]">{policy.intro}</p>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {policy.updated}: {locale === "pt" ? "17 de novembro de 2026" : "November 17, 2026"}
          </p>
        </header>

        <div className="mt-8 space-y-8">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm leading-relaxed text-[var(--color-muted)]">
          {policy.disclaimer}
        </p>
      </article>
    </main>
  );
}
