"use client";

import { useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";

const EMAIL = "gabweb95@gmail.com";
const WHATSAPP_NUMBER = "5551989125407";

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

type Draft = { name: string; email: string; subject: string; message: string };

/**
 * Contato 100% estático: nenhuma rota /api, nenhum serviço externo.
 * O formulário monta a mensagem e entrega para o app de e-mail ou WhatsApp
 * do visitante. Funciona em qualquer hospedagem (inclusive export estático).
 */
export default function Contact() {
  const { t, locale } = useI18n();
  const isPt = locale === "pt";
  const formRef = useRef<HTMLFormElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [done, setDone] = useState(false);
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [humanError, setHumanError] = useState("");

  const copy = {
    viaWhatsApp: isPt ? "Enviar pelo WhatsApp" : "Send via WhatsApp",
    hint: isPt
      ? "O envio abre seu app de e-mail ou WhatsApp com a mensagem pronta — nada passa por servidores de terceiros."
      : "Sending opens your email or WhatsApp app with the message ready — nothing goes through third-party servers.",
    wa: isPt
      ? "Olá, gostaria de um orçamento"
      : "Hi, I'd like to request a quote",
  };

  function readDraft(): Draft | null {
    const form = formRef.current;
    if (!form) return null;
    if (!form.reportValidity()) return null;
    const data = new FormData(form);

    // honeypot: campo invisível que só robôs preenchem
    if (String(data.get("website") ?? "") !== "") return null;

    if (!humanConfirmed) {
      setHumanError(t.contact.captcha_required);
      return null;
    }
    return {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
  }

  function flagDone() {
    setDone(true);
    setHumanConfirmed(false);
    setHumanError("");
    formRef.current?.reset();
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setDone(false), 5000);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = readDraft();
    if (!draft) return;

    const body = `${draft.message}\n\n—\n${draft.name} <${draft.email}>`;
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    flagDone();
  }

  function handleWhatsApp() {
    const draft = readDraft();
    if (!draft) return;

    const text = `${draft.subject}\n\n${draft.message}\n\n— ${draft.name} (${draft.email})`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    flagDone();
  }

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
            className="title-3d max-w-3xl font-black leading-[1.05] tracking-tight text-balance"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
          >
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-muted)]">{t.contact.description}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-5 lg:gap-12">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
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

            <label className="contact-human flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
              <span className="flex items-center gap-3 text-sm text-[var(--color-foreground)]">
                <input
                  type="checkbox"
                  checked={humanConfirmed}
                  onChange={(event) => {
                    setHumanConfirmed(event.target.checked);
                    if (event.target.checked) setHumanError("");
                  }}
                  aria-invalid={Boolean(humanError)}
                  aria-describedby={humanError ? "human-error" : undefined}
                  className="size-5 cursor-pointer accent-[var(--color-primary)]"
                />
                {t.contact.human_confirmation}
              </span>
              <ShieldCheck
                size={22}
                aria-hidden="true"
                className={humanConfirmed ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}
              />
            </label>

            {humanError && (
              <p id="human-error" className="text-sm text-red-400" role="alert">
                {humanError}
              </p>
            )}

            <p className="text-xs leading-relaxed text-[var(--color-muted)]">{copy.hint}</p>

            <p className="sr-only" role="status" aria-live="polite">
              {done ? t.contact.success : ""}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className={`magnetic-button group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 text-center text-sm font-bold text-black transition-[background-color,box-shadow,transform] hover:shadow-lg hover:shadow-[var(--color-primary)]/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)] active:scale-[0.98] sm:w-auto sm:px-8 ${
                  done ? "bg-[#25d366]" : "bg-[var(--color-primary)]"
                }`}
              >
                {done ? t.contact.success : t.contact.send}
                {done ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Send
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#25d366]/40 px-5 py-3 text-sm font-semibold text-[#25d366] transition-colors hover:bg-[#25d366]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366] sm:w-auto sm:px-6"
              >
                <MessageCircle size={16} aria-hidden="true" />
                {copy.viaWhatsApp}
              </button>
            </div>
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
                    href={`mailto:${EMAIL}`}
                    className="break-all text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)]"
                  >
                    {EMAIL}
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.wa)}`}
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