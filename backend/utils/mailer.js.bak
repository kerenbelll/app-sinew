// backend/utils/mailer.js
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/** Sólo para logs (no se muestra en el correo) */
const MAILER_VERSION = 'SINEW-MAILER-v3.4';

/* ===================== Entorno (leído en runtime) ===================== */
function env() {
  return {
    RESEND_KEY: process.env.RESEND_API_KEY || '',
    FROM_EMAIL: process.env.MAIL_FROM || 'SINEW <no-reply@sineworg.com>',
    LOGO_URL: process.env.MAIL_LOGO_URL || 'https://sineworg.com/logo.png',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: Number(process.env.SMTP_PORT || 587),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
  };
}

/* Pequeño helper para logs */
function mask(s) {
  if (!s) return '';
  if (s.length <= 8) return s[0] + '…' + s.slice(-1);
  return s.slice(0, 4) + '…' + s.slice(-3);
}

/* Diagnóstico en arranque */
(function diag() {
  const { RESEND_KEY, FROM_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS } = env();
  const provider = RESEND_KEY
    ? 'resend'
    : (SMTP_HOST && SMTP_USER && SMTP_PASS ? 'smtp' : 'none');
  console.log(`[MAILER] loaded ${MAILER_VERSION}`);
  console.log(
    `[MAILER] provider=${provider} | FROM="${FROM_EMAIL}"${
      RESEND_KEY ? ` | RESEND_API_KEY=${mask(RESEND_KEY)}` : ''
    }`
  );
})();

/* ===================== Estilos/Token de diseño ===================== */
const T = {
  pageBg: 'linear-gradient(180deg,#0b1222 0%,#0d1b2a 45%,#121a2f 100%)',
  cardBg: '#0f172a',
  surface: '#0b1222',
  text: '#e2e8f0',
  dim: '#94a3b8',
  hairline: 'rgba(255,255,255,0.08)',
  ctaA: '#98f5e1',
  ctaB: '#c1fff4',
  shadow: '0 24px 80px rgba(0,0,0,.45)',
  font: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  logoW: 120,
};

/* ===================== CTA bulletproof (con VML para Outlook) ===================== */
function bulletproofButton(href, label) {
  const w = 280, h = 48, r = 14;
  return `
  <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}"
      style="height:${h}px;v-text-anchor:middle;width:${w}px;" arcsize="${r}%"
      strokecolor="${T.ctaA}" fillcolor="${T.ctaA}">
      <w:anchorlock/>
      <center style="color:#0b1222;font-family:Segoe UI, Arial, sans-serif;font-size:16px;font-weight:700;">
        ${label}
      </center>
    </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
    <a href="${href}" target="_blank" rel="noopener"
       style="display:inline-block;min-width:${w}px;height:${h}px;line-height:${h}px;padding:0 18px;
              border-radius:${r}px;text-decoration:none;text-align:center;
              font:700 16px ${T.font};color:#0b1222;
              background:linear-gradient(135deg,${T.ctaA},${T.ctaB});
              box-shadow:0 10px 30px rgba(152,245,225,.28)">
      ${label}
    </a>
  <!--<![endif]-->`;
}

/* ===================== Layout base (sin versión en el cuerpo) ===================== */
function baseContainer(innerHtml, { preheader = '', title = '' } = {}) {
  const year = new Date().getFullYear();
  const { LOGO_URL } = env();

  return `
  <div style="margin:0;padding:32px;background:${T.pageBg};
              color-scheme:dark;supported-color-schemes:dark;">
    <!-- Preheader oculto -->
    <div style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">
      ${preheader}
    </div>

    <center>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:720px;margin:0 auto">
        <tr>
          <td align="left" style="padding:0 12px 18px">
            <img src="${LOGO_URL}" alt="SINEW" width="${T.logoW}"
                 style="display:block;border:0;outline:none;margin:0">
          </td>
        </tr>

        <tr>
          <td style="padding:0 12px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
              style="background:${T.cardBg};border:1px solid ${T.hairline};border-radius:18px;box-shadow:${T.shadow};overflow:hidden">
              <!-- Header “glass” -->
              <tr>
                <td style="background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
                           border-bottom:1px solid ${T.hairline};padding:22px 28px">
                  ${title ? `
                    <h1 style="margin:0;font:700 22px/1 ${T.font};color:${T.text};letter-spacing:.2px">
                      ${title}
                    </h1>` : ''}
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:26px 28px 8px">
                  <div style="font:400 15px/1.75 ${T.font};color:${T.dim}">${innerHtml}</div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:22px 28px 26px">
                  <hr style="border:none;border-top:1px solid ${T.hairline};margin:0 0 12px">
                  <p style="margin:0;text-align:center;font:400 12px ${T.font};color:#9aa7b5">
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
function resetTemplate({ name = '', resetUrl }) {
  const who = (name || '').trim() || 'Hola';
  const inner = `
    <p style="margin:0 0 10px;color:${T.text};font-weight:600">${who}</p>
    <p style="margin:0 0 14px">
      Para restablecer tu contraseña, hacé clic en el botón. El enlace vence en <strong>1 hora</strong>.
    </p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(resetUrl, 'Restablecer contraseña')}
    </div>
    <p style="margin:16px 0 0;font-size:13px;color:${T.dim}">
      Si no solicitaste este cambio, podés ignorar este mensaje.
    </p>`;
  return baseContainer(inner, {
    preheader: 'Restablecé tu contraseña de SINEW (vence en 1 hora).',
    title: 'Seguridad de tu cuenta',
  });
}

function courseAccessTemplate({ buyerName = '', courseTitle = 'Tu curso', courseUrl }) {
  const name = (buyerName || '').trim() || 'Hola';
  const inner = `
    <p style="margin:0 0 10px;color:${T.text}">
      <strong>${name}</strong>, tu acceso a <strong>${courseTitle}</strong> fue confirmado.
    </p>
    <p style="margin:0 0 12px;">Entrá cuando quieras desde el siguiente botón:</p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(courseUrl, 'Entrar al curso')}
    </div>
    <p style="margin:14px 0 0;font-size:13px;">Si necesitás asistencia, respondé a este correo.</p>
  `;
  return baseContainer(inner, {
    preheader: `Acceso confirmado: ${courseTitle}`,
    title: '¡Bienvenido!',
  });
}

/** NUEVO: plantilla para compra de libro (enlace de descarga) */
function purchaseTemplate({ buyerName = '', downloadLink = '#' }) {
  const name = (buyerName || '').trim() || '¡Hola!';
  const inner = `
    <p style="margin:0 0 10px;color:${T.text};font-weight:600">${name}</p>
    <p style="margin:0 0 14px">
      ¡Gracias por tu compra! Tu enlace de descarga (válido por <strong>24 horas</strong>) está abajo.
    </p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(downloadLink, 'Descargar libro')}
    </div>
    <p style="margin:14px 0 0;font-size:13px;">
      Si el botón no funciona, copiá y pegá esta URL en tu navegador:
      <br/>
      <span style="color:${T.ctaA};word-break:break-all">${downloadLink}</span>
    </p>
  `;
  return baseContainer(inner, {
    preheader: 'Gracias por tu compra – Tu descarga está lista',
    title: 'Tu descarga está lista',
  });
}

/* ===================== Utilidades de envío ===================== */
function toText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
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
  if (!RESEND_KEY) throw new Error('Sin proveedor de email configurado (RESEND_API_KEY)');
  const resend = new Resend(RESEND_KEY);

  const payload = {
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text: toText(html),
  };

  if (attachments?.length) {
    // Resend acepta Buffer -> base64
    payload.attachments = attachments.map(a => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
      contentType: a.contentType || 'application/octet-stream',
    }));
  }

  const r = await resend.emails.send(payload);
  console.log(`[MAILER] via resend → "${subject}" → ${Array.isArray(to) ? to.join(', ') : to}`);
  return { ok: true, via: 'resend', id: r?.id || null };
}

async function sendViaSMTP({ to, subject, html, attachments }) {
  const { FROM_EMAIL } = env();
  const smtp = buildSMTP();
  if (!smtp) throw new Error('Sin proveedor de email configurado (SMTP_*)');

  const r = await smtp.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text: toText(html),
    attachments,
  });
  console.log(`[MAILER] via smtp   → "${subject}" → ${Array.isArray(to) ? to.join(', ') : to}`);
  return { ok: true, via: 'smtp', id: r?.messageId || null };
}

async function deliver({ to, subject, html, attachments = [] }) {
  const { RESEND_KEY, SMTP_HOST } = env();
  console.log(`[MAILER] ${MAILER_VERSION} → "${subject}" → ${Array.isArray(to) ? to.join(', ') : to}`);
  try {
    if (RESEND_KEY) return await sendViaResend({ to, subject, html, attachments });
    if (SMTP_HOST)  return await sendViaSMTP({ to, subject, html, attachments });
    throw new Error('Sin proveedor de email configurado (RESEND_API_KEY o SMTP_*)');
  } catch (e) {
    console.error('[MAILER] error:', e?.message || e);
    throw e;
  }
}

/* ===================== API pública ===================== */
export async function sendPurchaseEmail({ toEmail, buyerName, downloadLink, invoiceBuffer, invoiceName }) {
  const subject = 'Gracias por tu compra – Tu descarga está lista';
  const html = purchaseTemplate({ buyerName, downloadLink });
  const attachments = [];

  if (invoiceBuffer) {
    attachments.push({
      filename: invoiceName || 'Factura.pdf',
      content: invoiceBuffer,
      contentType: 'application/pdf',
    });
  }
  return deliver({ to: toEmail, subject, html, attachments });
}

export async function sendCourseAccessEmail({ toEmail, buyerName, courseTitle, courseUrl }) {
  const safeTitle = courseTitle || 'Curso SINEW'; // 👈 evita "undefined"
  const subject = `Acceso confirmado – ${safeTitle}`;
  const html = courseAccessTemplate({ buyerName, courseTitle: safeTitle, courseUrl });
  return deliver({ to: toEmail, subject, html });
}

export async function sendResetEmail({ toEmail, name, resetUrl }) {
  const subject = 'Restablecer contraseña';
  const html = resetTemplate({ name, resetUrl });
  return deliver({ to: toEmail, subject, html });
}