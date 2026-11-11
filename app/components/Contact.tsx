"use client";

import { motion, useInView } from "framer-motion";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Send, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

interface TurnstileOptions {
  sitekey: string;
  action: "contact";
  theme: "dark";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export default function Contact() {
  const { t } = useI18n();
  const ref = useRef(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderTurnstile = useCallback(() => {
    if (!siteKey || !window.turnstile || !turnstileRef.current || turnstileId.current) return;

    turnstileId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      action: "contact",
      theme: "dark",
      callback: (token) => {
        setCaptchaToken(token);
        setCaptchaError("");
      },
      "expired-callback": () => {
        setCaptchaToken("");
        setCaptchaError(t.contact.captcha_required);
      },
      "error-callback": () => {
        setCaptchaToken("");
        setCaptchaError(t.contact.captcha_unavailable);
      },
    });
  }, [siteKey, t.contact.captcha_required, t.contact.captcha_unavailable]);

  useEffect(() => {
    if (!turnstileReady) return;
    renderTurnstile();

    return () => {
      if (turnstileId.current && window.turnstile) {
        window.turnstile.remove(turnstileId.current);
        turnstileId.current = null;
      }
    };
  }, [renderTurnstile, turnstileReady]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (siteKey && !captchaToken) {
      setCaptchaError(t.contact.captcha_required);
      return;
    }

    setLoading(true);
    setSubmitError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          website: formData.get("website"),
          captchaToken: captchaToken || undefined,
        }),
      });
      const result: { success?: boolean; error?: string; code?: string } = await response.json();

      if (!response.ok || !result.success) {
        if (result.code === "CAPTCHA_REQUIRED" || result.code === "CAPTCHA_INVALID") {
          setCaptchaError(t.contact.captcha_required);
        } else if (result.code === "CAPTCHA_UNAVAILABLE") {
          setCaptchaError(t.contact.captcha_unavailable);
        } else {
          setSubmitError(t.contact.send_error);
        }
        setCaptchaToken("");
        if (turnstileId.current && window.turnstile) {
          window.turnstile.reset(turnstileId.current);
        }
        return;
      }

      setSubmitted(true);
      form.reset();
      setCaptchaToken("");
      if (turnstileId.current && window.turnstile) {
        window.turnstile.reset(turnstileId.current);
      }
      window.setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError(t.contact.send_error);
      setCaptchaToken("");
      if (turnstileId.current && window.turnstile) {
        window.turnstile.reset(turnstileId.current);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contato" className="relative scroll-reveal py-24 md:py-32 section-glow-top">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
            <span className="text-xs font-mono text-[var(--color-primary)] tracking-[0.25em] uppercase">
              {t.contact.label}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black">{t.contact.title}</h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">{t.contact.description}</p>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:gap-12 lg:grid-cols-5">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:col-span-3 space-y-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8"
          >
            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-[var(--color-foreground)]/80"
                >
                  {t.contact.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/70 transition-all"
                  placeholder={t.contact.name_placeholder}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-[var(--color-foreground)]/80"
                >
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/70 transition-all"
                  placeholder={t.contact.email_placeholder}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-2 text-[var(--color-foreground)]/80"
              >
                {t.contact.subject}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/70 transition-all"
                placeholder={t.contact.subject_placeholder}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2 text-[var(--color-foreground)]/80"
              >
                {t.contact.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/70 transition-all"
                placeholder={t.contact.message_placeholder}
              />
            </div>

            {siteKey && (
              <>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="lazyOnload"
                  onReady={() => setTurnstileReady(true)}
                  onError={() => setCaptchaError(t.contact.captcha_unavailable)}
                />
                <div ref={turnstileRef} />
                {captchaError && (
                  <p className="text-sm text-red-400" role="alert">
                    {captchaError}
                  </p>
                )}
              </>
            )}

            {submitError && (
              <p className="text-sm text-red-400" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={Boolean(siteKey && !captchaToken) || loading || submitted}
              className="magnetic-button group relative flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              {submitted ? t.contact.success : loading ? t.contact.sending : t.contact.send}
              <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="portfolio-card space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 p-2.5 text-[var(--color-primary)]">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Email</h4>
                  <p className="text-sm text-[var(--color-muted)]">gabweb95@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/8 p-2.5 text-[var(--color-secondary)]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.contact.location_label}</h4>
                  <p className="text-sm text-[var(--color-muted)]">{t.contact.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/8 p-2.5 text-[var(--color-accent)]">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.contact.response_time_label}</h4>
                  <p className="text-sm text-[var(--color-muted)]">{t.contact.response_time}</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/5551989125407?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/8 p-5 text-[#25d366] font-semibold transition-all hover:bg-[#25d366]/15 hover:scale-[1.02]"
            >
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
