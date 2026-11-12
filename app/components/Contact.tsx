"use client";

import Script from "next/script";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
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

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/* text-base no mobile evita o zoom automático do iOS ao focar o campo */
const FIELD =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-base text-[var(--color-foreground)] transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 sm:text-sm";
const LABEL = "mb-2 block text-sm font-medium text-[var(--color-foreground)]/80";

/** Luz do hover que segue o cursor dentro do card (só mouse). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export default function Contact() {
  const { t } = useI18n();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  // O script do Cloudflare só é baixado quando a pessoa começa a preencher o formulário.
  const [loadCaptcha, setLoadCaptcha] = useState(false);
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

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  function resetCaptcha() {
    setCaptchaToken("");
    setHumanConfirmed(false);
    if (turnstileId.current && window.turnstile) {
      window.turnstile.reset(turnstileId.current);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ((siteKey && !captchaToken) || (!siteKey && !humanConfirmed)) {
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
          humanConfirmed,
        }),
      });
      const result: { success?: boolean; error?: string; code?: string } = await response.json();

      if (!response.ok || !result.success) {
        if (
          result.code === "CAPTCHA_REQUIRED" ||
          result.code === "CAPTCHA_INVALID" ||
          result.code === "HUMAN_VERIFICATION_REQUIRED"
        ) {
          setCaptchaError(t.contact.captcha_required);
        } else if (result.code === "CAPTCHA_UNAVAILABLE") {
          setCaptchaError(t.contact.captcha_unavailable);
        } else {
          setSubmitError(t.contact.send_error);
        }
        resetCaptcha();
        return;
      }

      setSubmitted(true);
      form.reset();
      resetCaptcha();
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError(t.contact.send_error);
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  }

  const blocked =
    Boolean((siteKey && !captchaToken) || (!siteKey && !humanConfirmed)) || loading || submitted;

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="section-glow-top relative scroll-reveal overflow-hidden py-16 sm:py-20 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 40% at 18% 70%, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 md:px-14">
        <div className="contact-reveal" style={vars({ "--i": 0 })}>
          <div className="mb-3 flex items-center gap-3">
            <div
              className="h-px w-8 bg-gradient-to-r from-[var(--color-primary)] to-transparent"
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              {t.contact.label}
            </span>
          </div>
          <h2
            id="contato-title"
            className="max-w-3xl font-black leading-[1.05] tracking-tight text-balance"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
          >
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-muted)]">{t.contact.description}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-5 lg:gap-12">
          <form
            onSubmit={handleSubmit}
            onFocus={() => setLoadCaptcha(true)}
            style={vars({ "--i": 1 })}
            className="contact-reveal relative min-w-0 space-y-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors focus-within:border-[var(--color-primary)]/35 sm:p-6 md:p-8 lg:col-span-3"
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
                <label htmlFor="name" className={LABEL}>
                  {t.contact.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={FIELD}
                  placeholder={t.contact.name_placeholder}
                />
              </div>
              <div>
                <label htmlFor="email" className={LABEL}>
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={FIELD}
                  placeholder={t.contact.email_placeholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={LABEL}>
                {t.contact.subject}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                autoComplete="off"
                className={FIELD}
                placeholder={t.contact.subject_placeholder}
              />
            </div>

            <div>
              <label htmlFor="message" className={LABEL}>
                {t.contact.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className={`${FIELD} min-h-32 resize-y`}
                placeholder={t.contact.message_placeholder}
              />
            </div>

            {siteKey && (
              <>
                {loadCaptcha && (
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                    strategy="afterInteractive"
                    onReady={() => setTurnstileReady(true)}
                    onError={() => setCaptchaError(t.contact.captcha_unavailable)}
                  />
                )}
                {/* espaço reservado assim que o foco acontece → sem salto de layout */}
                <div ref={turnstileRef} className={loadCaptcha ? "min-h-[65px]" : "hidden"} />
                {captchaError && (
                  <p className="text-sm text-red-400" role="alert">
                    {captchaError}
                  </p>
                )}
              </>
            )}

            {!siteKey && (
              <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
                <span className="flex items-center gap-3 text-sm text-[var(--color-foreground)]">
                  <input
                    type="checkbox"
                    checked={humanConfirmed}
                    onChange={(event) => {
                      setHumanConfirmed(event.target.checked);
                      setCaptchaError("");
                    }}
                    aria-invalid={Boolean(captchaError)}
                    aria-describedby={captchaError ? "captcha-error" : undefined}
                    className="size-5 cursor-pointer accent-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                  />
                  {t.contact.human_confirmation}
                </span>
                <ShieldCheck
                  size={22}
                  aria-hidden="true"
                  className={
                    humanConfirmed ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
                  }
                />
              </label>
            )}

            {captchaError && !siteKey && (
              <p id="captcha-error" className="text-sm text-red-400" role="alert">
                {captchaError}
              </p>
            )}

            {submitError && (
              <p className="text-sm text-red-400" role="alert">
                {submitError}
              </p>
            )}

            {/* anuncia o sucesso para leitores de tela */}
            <p className="sr-only" role="status" aria-live="polite">
              {submitted ? t.contact.success : ""}
            </p>

            <button
              type="submit"
              disabled={blocked}
              className={`magnetic-button group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 text-center text-sm font-bold text-black transition-[background-color,box-shadow,transform,opacity] hover:shadow-lg hover:shadow-[var(--color-primary)]/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)] active:scale-[0.98] disabled:cursor-not-allowed sm:w-auto sm:px-8 ${
                submitted ? "bg-[#25d366]" : "bg-[var(--color-primary)] disabled:opacity-60"
              }`}
            >
              {submitted ? t.contact.success : loading ? t.contact.sending : t.contact.send}
              {submitted ? (
                <Check size={16} aria-hidden="true" />
              ) : loading ? (
                <Loader2 size={16} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              ) : (
                <Send
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              )}
            </button>
          </form>

          <div
            className="contact-reveal min-w-0 space-y-5 lg:col-span-2 lg:space-y-6"
            style={vars({ "--i": 2 })}
          >
            <div
              onPointerMove={trackPointer}
              className="about-card space-y-5 p-5 sm:space-y-6 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">Email</h3>
                  <a
                    href="mailto:gabweb95@gmail.com"
                    className="break-all text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)]"
                  >
                    gabweb95@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
                  <MapPin size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.contact.location_label}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{t.contact.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
                  <Clock size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.contact.response_time_label}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{t.contact.response_time}</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/5551989125407?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/8 px-5 py-4 font-semibold text-[#25d366] transition-[background-color,transform] hover:bg-[#25d366]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366] motion-safe:hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <MessageCircle
                  size={22}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
                WhatsApp
              </span>
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}