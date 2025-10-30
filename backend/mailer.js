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
  console.log(`[MAILER] provider=${provider} | FROM="${FROM_EMAIL}"${RESEND_KEY ? ` | RESEND_API_KEY=${mask(RESEND_KEY)}` : ''}`);
})();

/* ===================== Estilos/Token de diseño ===================== */
const T = {
  pageBg: 'linear-gradient(180deg,#f8fbff 0%,#f2f9ff 40%,#ffffff 100%)',
  cardBg: '#ffffff',
  text: '#0f172a',     // slate-900
  dim: '#334155',      // slate-700
  hairline: '#e6eef5',
  ctaA: '#06beb6',
  ctaB: '#48b1bf',
  shadow: '0 14px 42px rgba(2, 6, 23, .08)',
};

/* ===================== CTA bulletproof (con VML para Outlook) ===================== */
function bulletproofButton(href, label) {
  const width = 260;
  const height = 46;
  return `
  <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
      href="${href}" arcsize="12%" strokecolor="${T.ctaA}" fillcolor="${T.ctaA}"
      style="height:${height}px;v-text-anchor:middle;width:${width}px;">
      <w:anchorlock/>
      <center style="color:#ffffff;font-family:Segoe UI, Arial, sans-serif;font-size:16px;font-weight:700;">
        ${label}
      </center>
    </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
    <a href="${href}" target="_blank" rel="noreferrer"
       style="display:inline-block;min-width:${width}px;line-height:${height}px;height:${height}px;
              padding:0 20px;border-radius:12px;text-decoration:none;text-align:center;
              font:700 16px 'Segoe UI',Arial,sans-serif;color:#ffffff;
              background:linear-gradient(135deg,${T.ctaA},${T.ctaB});
              box-shadow:0 8px 22px rgba(6,190,182,.25);">
      ${label}
    </a>
  <!--<![endif]-->`;
}

/* ===================== Layout base (sin versión en el cuerpo) ===================== */
function baseContainer(innerHtml, { preheader = '', title = '' } = {}) {
  const year = new Date().getFullYear();
  const { LOGO_URL } = env();

  return `
  <div style="margin:0;padding:24px;background:${T.pageBg};
              color-scheme:light;supported-color-schemes:light;">
    <!-- Preheader (oculto en cuerpo, visible en preview de inbox) -->
    <div style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      ${preheader}
    </div>

    <center>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="max-width:680px;margin:0 auto;">
        <tr>
          <td align="center" style="padding:8px 8px 14px 8px;">
            <img src="${LOGO_URL}" alt="SINEW" width="120"
                 style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto;">
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:0 12px 24px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:${T.cardBg};border:1px solid ${T.hairline};border-radius:16px;box-shadow:${T.shadow};">
              <tr>
                <td bgcolor="#ffffff" style="padding:28px 28px 8px 28px;">
                  ${title ? `<h1 style="margin:0 0 8px;font:700 22px 'Segoe UI',Arial,sans-serif;color:${T.text};">${title}</h1>` : ''}
                  <div style="font:400 15px/1.7 'Segoe UI',Arial,sans-serif;color:${T.dim};">
                    ${innerHtml}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 28px 26px 28px;">
                  <hr style="border:none;border-top:1px solid ${T.hairline};margin:0 0 14px 0;">
                  <p style="margin:0;text-align:center;font:400 12px 'Segoe UI',Arial,sans-serif;color:#64748b;">
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
function purchaseTemplate({ buyerName = '', downloadLink }) {
  const name = (buyerName || '').trim() || 'Hola';
  const inner = `
    <p style="margin:0 0 10px;color:${T.text}"><strong>${name}</strong>, ¡gracias por tu compra!</p>
    <p style="margin:0 0 12px;">Tu enlace de descarga está listo. Es de <strong>un solo uso</strong> y vence en <strong>24 horas</strong>.</p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(downloadLink, 'Descargar ahora')}
    </div>
    <p style="margin:14px 0 0;font-size:13px;">¿Problemas con la descarga? Respondé a este correo y te ayudamos.</p>
  `;
  return baseContainer(inner, {
    preheader: 'Tu descarga está lista. Gracias por comprar en SINEW.',
    title: 'Tu compra está lista',
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

function resetTemplate({ name = '', resetUrl }) {
  const who = (name || '').trim() || 'Hola';
  const inner = `
    <p style="margin:0 0 10px;color:${T.text}"><strong>${who}</strong></p>
    <p style="margin:0 0 12px;">Para restablecer tu contraseña, hacé clic en el botón. El enlace vence en 1 hora.</p>
    <div style="text-align:center;margin:22px 0 8px;">
      ${bulletproofButton(resetUrl, 'Restablecer contraseña')}
    </div>
    <p style="margin:14px 0 0;font-size:13px;">Si no solicitaste este cambio, ignorá este mensaje.</p>
  `;
  return baseContainer(inner, {
    preheader: 'Solicitud de restablecimiento de contraseña',
    title: 'Seguridad de tu cuenta',
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
  const subject = `Acceso confirmado – ${courseTitle}`;
  const html = courseAccessTemplate({ buyerName, courseTitle, courseUrl });
  return deliver({ to: toEmail, subject, html });
}

export async function sendResetEmail({ toEmail, name, resetUrl }) {
  const subject = 'Restablecer contraseña';
  const html = resetTemplate({ name, resetUrl });
  return deliver({ to: toEmail, subject, html });
}