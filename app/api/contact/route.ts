import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da solicitação inválido." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ error: "Corpo da solicitação inválido." }, { status: 400 });
  }

  const { name, email, subject, message, captchaToken } = payload;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !subject.trim() ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  if (typeof captchaToken !== "string" || !captchaToken) {
    return NextResponse.json(
      { code: "CAPTCHA_REQUIRED", error: "Conclua a verificação antes de enviar." },
      { status: 400 },
    );
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return NextResponse.json(
      { code: "CAPTCHA_UNAVAILABLE", error: "Verificação antispam não configurada." },
      { status: 503 },
    );
  }

  let verificationResponse: Response;
  try {
    verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: turnstileSecret, response: captchaToken }),
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      { code: "CAPTCHA_UNAVAILABLE", error: "Não foi possível validar a verificação." },
      { status: 502 },
    );
  }

  let verification: unknown;
  try {
    verification = await verificationResponse.json();
  } catch {
    return NextResponse.json(
      { code: "CAPTCHA_UNAVAILABLE", error: "Resposta inválida do serviço de verificação." },
      { status: 502 },
    );
  }

  if (
    !verificationResponse.ok ||
    !isRecord(verification) ||
    verification.success !== true ||
    verification.hostname !== req.nextUrl.hostname ||
    verification.action !== "contact"
  ) {
    return NextResponse.json(
      { code: "CAPTCHA_INVALID", error: "Verificação inválida. Tente novamente." },
      { status: 403 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Envio de mensagens não configurado." }, { status: 503 });
  }

  const resend = new Resend(resendApiKey);
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeSubject = escapeHtml(subject.trim());
  const safeMessage = escapeHtml(message.trim());

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: "gabweb95@gmail.com",
    replyTo: email.trim(),
    subject: `[Portfolio] ${subject.trim()}`,
    text: `Nome: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#00C8FF;margin-bottom:8px">Nova mensagem do portfólio</h2>
        <hr style="border-color:#1A3548;margin-bottom:20px"/>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Assunto:</strong> ${safeSubject}</p>
        <hr style="border-color:#1A3548;margin:20px 0"/>
        <p style="white-space:pre-line">${safeMessage}</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
