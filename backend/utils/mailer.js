import "dotenv/config";
import nodemailer from "nodemailer";
import { Resend } from "resend";

/** Sólo para logs (no se muestra en el correo) */
const MAILER_VERSION = "SINEW-MAILER-v4.0";

/* ===================== Entorno (leído en runtime) ===================== */
function env() {
  return {
    RESEND_KEY: process.env.RESEND_API_KEY || "",
    FROM_EMAIL: process.env.MAIL_FROM || "SINEW <no-reply@sineworg.com>",
    LOGO_URL: process.env.MAIL_LOGO_URL || "https://sineworg.com/logo.png",
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PORT: Number(process.env.SMTP_PORT || 587),
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
  };
}

/* Pequeño helper para logs */
function mask(s) {
  if (!s) return "";
  if (s.length <= 8) return s[0] + "…" + s.slice(-1);
  return s.slice(0, 4) + "…" + s.slice(-3);
}

/* Diagnóstico en arranque */
(function diag() {
  const { RESEND_KEY, FROM_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS } = env();
  const provider = RESEND_KEY
    ? "resend"
    : SMTP_HOST && SMTP_USER && SMTP_PASS
    ? "smtp"
    : "none";
  console.log(`[MAILER] loaded ${MAILER_VERSION}`);
  console.log(
    `[MAILER] provider=${provider} | FROM="${FROM_EMAIL}"${
      RESEND_KEY ? ` | RESEND_API_KEY=${mask(RESEND_KEY)}` : ""
    }`
  );
})();

/* ===================== Tokens de diseño (más sobrios) ===================== */
const T = {
  pageBg: "linear-gradient(180deg,#020617 0%,#020617 35%,#020617 100%)",
  cardBg: "#020617",          // ANTES era casi blanco: hacela bien oscura
  surface: "#020617",
  text: "#e5e7eb",
  dim: "#9ca3af",
  hairline: "rgba(148,163,184,0.28)",
  accentBar: "linear-gradient(90deg,#22c1c3,#0ea5e9)", // un poco más azul
  ctaA: "#0ea5e9",            // botón más azul
  ctaB: "#38bdf8",
  shadow: "0 28px 80px rgba(15,23,42,.85)",
  font: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  logoW: 140,
};

/* ===================== CTA bulletproof (Outlook friendly) ===================== */
function bulletproofButton(href, label) {
  const w = 260;
  const h = 46;
  const r = 999;
  return `
  <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}"
      style="height:${h}px;v-text-anchor:middle;width:${w}px;" arcsize="50%"
      strokecolor="${T.ctaA}" fillcolor="${T.ctaA}">
      <w:anchorlock/>
      <center style="color:#020617;font-family:Segoe UI, Arial, sans-serif;font-size:15px;font-weight:700;">
        ${label}
      </center>
    </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
    <a href="${href}" target="_blank" rel="noopener"
       style="display:inline-block;min-width:${w}px;height:${h}px;line-height:${h}px;
              padding:0 20px;border-radius:${r}px;text-decoration:none;text-align:center;
              font:600 15px ${T.font};color:#020617;
              background:linear-gradient(135deg,${T.ctaA},${T.ctaB});
              box-shadow:0 14px 40px rgba(34,193,195,.45)">
      ${label}
    </a>
  <!--<![endif]-->`;
}

/* ===================== Layout base ===================== */
function baseContainer(innerHtml, { preheader = "", title = "" } = {}) {
  const year = new Date().getFullYear();
  const { LOGO_URL } = env();

  return `
  <div style="margin:0;padding:32px 16px;background:${T.pageBg};
              color-scheme:dark;supported-color-schemes:dark;">
    <!-- Preheader oculto -->
    <div style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">
      ${preheader}
    </div>

    <center>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:720px;margin:0 auto;">
        <!-- Logo -->
        <tr>
          <td align="left" style="padding:0 4px 18px;">
            <img src="${LOGO_URL}" alt="SINEW" width="${T.logoW}"
                 style="display:block;border:0;outline:none;margin:0;">
          </td>
        </tr>

        <tr>
          <td style="padding:0 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
              style="background:${T.cardBg};border:1px solid ${T.hairline};
                     border-radius:20px;box-shadow:${T.shadow};overflow:hidden;">
              
              <!-- Barra superior -->
              <tr>
                <td style="padding:0;">
                  <div style="height:4px;width:100%;background:${T.accentBar};"></div>
                </td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="padding:22px 26px 6px;">
                  ${
                    title
                      ? `
                    <h1 style="
                      margin:0 0 4px;
                      font:700 21px/1.3 ${T.font};
                      color:${T.text};
                      letter-spacing:.2px;">
                      ${title}
                    </h1>
                  `
                      : ""
                  }
                  <p style="margin:0;font:500 12px/1.6 ${T.font};color:${T.dim};text-transform:uppercase;letter-spacing:.22em;">
                    SINEW • Formación & Comunidad
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:18px 26px 10px;">
                  <div style="font:400 15px/1.7 ${T.font};color:${T.dim};">
                    ${innerHtml}
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 26px 22px;">
                  <hr style="border:none;border-top:1px solid ${T.hairline};margin:0 0 12px;">
                  <p style="margin:0 0 2px;font:400 11px/1.6 ${T.font};color:${T.dim};text-align:center;">
                    Este correo se envió automáticamente desde SINEW.
                  </p>
                  <p style="margin:0;font:400 11px/1.6 ${T.font};color:${T.dim};text-align:center;">
                    © ${year} SINEW — Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </center>
  </div>`;
}

/* ===================== Plantillas ===================== */

function resetTemplate({ name = "", resetUrl }) {
  const who = (name || "").trim() || "Hola";
  const inner = `
    <p style="margin:0 0 10px;color:${T.text};font-weight:600;font-size:15px;">
      ${who},
    </p>
    <p style="margin:0 0 14px;">
      Recibimos una solicitud para <strong>restablecer tu contraseña</strong>.
      Hacé clic en el botón para continuar. El enlace es válido por <strong>1 hora</strong>.
    </p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(resetUrl, "Restablecer contraseña")}
    </div>
    <p style="margin:16px 0 0;font-size:13px;">
      Si vos no hiciste esta solicitud, podés ignorar este mensaje. Tu cuenta seguirá estando segura.
    </p>
  `;
  return baseContainer(inner, {
    preheader: "Restablecé tu contraseña de SINEW (enlace válido por 1 hora).",
    title: "Seguridad de tu cuenta",
  });
}

function courseAccessTemplate({ buyerName = "", courseTitle = "Tu curso", courseUrl }) {
  const name = (buyerName || "").trim() || "Hola";
  const inner = `
    <p style="margin:0 0 10px;color:${T.text};font-weight:600;font-size:15px;">
      ${name},
    </p>
    <p style="margin:0 0 10px;">
      Tu acceso a <strong>${courseTitle}</strong> fue confirmado correctamente.
    </p>
    <p style="margin:0 0 14px;">
      Podés entrar al contenido cuando quieras desde el siguiente botón:
    </p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(courseUrl, "Entrar al curso")}
    </div>
    <p style="margin:16px 0 0;font-size:13px;">
      También vas a poder acceder desde tu perfil, usando el mismo correo con el que realizaste la compra.
    </p>
  `;
  return baseContainer(inner, {
    preheader: `Acceso confirmado: ${courseTitle}`,
    title: "Acceso a tu curso",
  });
}

/** Compra de libro / producto descargable */
function purchaseTemplate({ buyerName = "", downloadLink = "#" }) {
  const name = (buyerName || "").trim() || "Hola";
  const inner = `
    <p style="margin:0 0 10px;color:${T.text};font-weight:600;font-size:15px;">
      ${name},
    </p>
    <p style="margin:0 0 12px;">
      ¡Gracias por tu compra! Tu enlace de descarga está listo.
    </p>
    <p style="margin:0 0 14px;">
      El enlace es de <strong>un solo uso</strong> y se mantendrá activo durante <strong>24 horas</strong>.
    </p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(downloadLink, "Descargar ahora")}
    </div>
    <p style="margin:16px 0 0;font-size:13px;">
      Si el botón no funciona, copiá y pegá esta dirección en tu navegador:
      <br/>
      <span style="color:${T.ctaA};word-break:break-all;">${downloadLink}</span>
    </p>
  `;
  return baseContainer(inner, {
    preheader: "Gracias por tu compra – Tu descarga está lista.",
    title: "Tu descarga está lista",
  });
}

/* ===================== Utilidades de envío ===================== */

function toText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSMTP() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env();
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendViaResend({ to, subject, html, attachments }) {
  const { RESEND_KEY, FROM_EMAIL } = env();
  if (!RESEND_KEY) {
    throw new Error("Sin proveedor de email configurado (RESEND_API_KEY)");
  }
  const resend = new Resend(RESEND_KEY);

  const payload = {
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text: toText(html),
  };

  if (attachments && attachments.length) {
    payload.attachments = attachments.map((a) => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content)
        ? a.content.toString("base64")
        : a.content,
      contentType: a.contentType || "application/octet-stream",
    }));
  }

  const r = await resend.emails.send(payload);
  console.log(
    `[MAILER] via resend → "${subject}" → ${
      Array.isArray(to) ? to.join(", ") : to
    }`
  );
  return { ok: true, via: "resend", id: r?.id || null };
}

async function sendViaSMTP({ to, subject, html, attachments }) {
  const { FROM_EMAIL } = env();
  const smtp = buildSMTP();
  if (!smtp) throw new Error("Sin proveedor de email configurado (SMTP_*)");

  const r = await smtp.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text: toText(html),
    attachments,
  });
  console.log(
    `[MAILER] via smtp   → "${subject}" → ${
      Array.isArray(to) ? to.join(", ") : to
    }`
  );
  return { ok: true, via: "smtp", id: r?.messageId || null };
}

async function deliver({ to, subject, html, attachments = [] }) {
  const { RESEND_KEY, SMTP_HOST } = env();
  console.log(
    `[MAILER] ${MAILER_VERSION} → "${subject}" → ${
      Array.isArray(to) ? to.join(", ") : to
    }`
  );
  try {
    if (RESEND_KEY) {
      return await sendViaResend({ to, subject, html, attachments });
    }
    if (SMTP_HOST) {
      return await sendViaSMTP({ to, subject, html, attachments });
    }
    throw new Error(
      "Sin proveedor de email configurado (RESEND_API_KEY o SMTP_*)"
    );
  } catch (e) {
    console.error("[MAILER] error:", e?.message || e);
    throw e;
  }
}

/* ===================== API pública (mismas firmas) ===================== */

export async function sendPurchaseEmail({
  toEmail,
  buyerName,
  downloadLink,
  invoiceBuffer,
  invoiceName,
}) {
  const subject = "Gracias por tu compra – Tu descarga está lista";
  const html = purchaseTemplate({ buyerName, downloadLink });
  const attachments = [];

  if (invoiceBuffer) {
    attachments.push({
      filename: invoiceName || "Factura.pdf",
      content: invoiceBuffer,
      contentType: "application/pdf",
    });
  }
  return deliver({ to: toEmail, subject, html, attachments });
}

export async function sendCourseAccessEmail({
  toEmail,
  buyerName,
  courseTitle,
  courseUrl,
}) {
  const safeTitle = courseTitle || "Curso SINEW";
  const subject = `Acceso confirmado – ${safeTitle}`;
  const html = courseAccessTemplate({
    buyerName,
    courseTitle: safeTitle,
    courseUrl,
  });
  return deliver({ to: toEmail, subject, html });
}

export async function sendResetEmail({ toEmail, name, resetUrl }) {
  const subject = "Restablecer contraseña";
  const html = resetTemplate({ name, resetUrl });
  return deliver({ to: toEmail, subject, html });
}