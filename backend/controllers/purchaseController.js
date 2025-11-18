// backend/controllers/purchaseController.js
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import paypal from '@paypal/checkout-server-sdk';

import DownloadToken from '../models/DownloadToken.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import CourseAccess from '../models/CourseAccess.js';
import { sendPurchaseEmail, sendCourseAccessEmail } from '../utils/mailer.js';

dotenv.config();

/* =========================
   Config
   ========================= */
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const hasPaypalCreds = !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;
const hasEmailCreds  = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

console.log(
  '[BOOT][purchaseController] PAYPAL:',
  hasPaypalCreds ? 'OK' : 'MISSING',
  '| SMTP:',
  hasEmailCreds ? 'OK' : 'MISSING'
);

const PAYPAL_ENV = String(process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const clientId = process.env.PAYPAL_CLIENT_ID || 'MISSING';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'MISSING';

const environment =
  PAYPAL_ENV === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Nodemailer (fallback/compatibilidad con otros mails simples)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: hasEmailCreds
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

/* =========================
   Helpers fulfillment
   ========================= */
async function fulfillCourseAccess({ userId, email, name, courseSlug, courseTitle }) {
  if (!courseSlug) return null;

  await CourseAccess.updateOne(
    { userId, courseSlug },
    {
      $setOnInsert: {
        userId,
        courseSlug,
        provider: 'paypal',
        grantedBy: 'paypal',
        grantedAt: new Date(),
      },
    },
    { upsert: true }
  );

  const courseUrl = `${FRONTEND_URL}/cursos/${courseSlug}?paid=1`;

  if (email) {
    try {
      const r = await sendCourseAccessEmail({
        toEmail: email,
        buyerName: (name || 'Alumno').trim(),
        courseTitle: courseTitle || 'Curso SINEW',
        courseUrl,
      });
      console.log('[Email] acceso curso →', r);
    } catch (e) {
      console.error('[Email] acceso curso error:', e?.message || e);
    }
  }

  return { courseUrl };
}

async function fulfillBookDownload({ userId, email, name, invoiceBuffer, invoiceName }) {
  // token 24h
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await DownloadToken.create({ userId, token, expiresAt, used: false });

  // Redirigimos al frontend para UX + autodownload
  const redirectTo = `${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(token)}`;

  // Enviar mail “compra libro”
  if (email) {
    try {
      const r = await sendPurchaseEmail({
        toEmail: email,
        buyerName: (name || 'Buyer').trim(),
        downloadLink: redirectTo,
        invoiceBuffer,
        invoiceName,
      });
      console.log('[Email] libro →', r);
    } catch (e) {
      console.error('[Email] libro error:', e?.message || e);

      // Fallback muy simple con nodemailer si falla el mailer principal
      if (hasEmailCreds) {
        try {
          await transporter.sendMail({
            from: `"SINEW" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Tu enlace de descarga del libro',
            html: `<p>Hola ${name || ''},</p>
                   <p>Gracias por tu compra. Descarga tu libro (24h):</p>
                   <a href="${redirectTo}">${redirectTo}</a>`,
          });
        } catch (e2) {
          console.error('[Email][fallback] libro error:', e2?.message || e2);
        }
      }
    }
  }

  return { redirectTo };
}

/* =========================
   CREATE ORDER
   ========================= */
/**
 * Crea orden de PayPal y devuelve approveUrl + links.
 * Espera (opcional) body:
 *  - items: [{ type, sku, name, quantity, unit_amount, currency }]
 *  - meta: { courseSlug, buyerEmail }
 *
 * También admite payload "simple":
 *  - price, currency, title, metadata, buyer
 */
export const createOrder = async (req, res) => {
  try {
    if (!hasPaypalCreds) {
      return res.status(500).json({ error: 'PayPal no configurado' });
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const meta  = req.body?.meta || {};

    // Compatibilidad con payload simple (price, currency, title, metadata, buyer)
    if (!items.length && req.body?.price) {
      const amountValue = Number(req.body.price ?? 35);
      const currency    = String(req.body.currency ?? 'USD').toUpperCase();
      const description = req.body.title || 'Producto SINEW';

      items.push({
        type: req.body.metadata?.type || 'book',
        sku:
          req.body.metadata?.courseSlug ||
          req.body.metadata?.slug ||
          'libro-001',
        name: description,
        quantity: 1,
        unit_amount: amountValue,
        currency,
      });

      if (!Object.keys(meta).length && req.body.metadata) {
        Object.assign(meta, req.body.metadata);
      }
    }

    // Defaults si no envían items
    const amountValue = Number(items?.[0]?.unit_amount ?? 35);
    const currency    = String(items?.[0]?.currency ?? 'USD').toUpperCase();
    const description = items?.[0]?.name || 'Producto SINEW';
    const customId    = meta?.courseSlug ? `course:${meta.courseSlug}` : 'libro-001';

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amountValue.toFixed(2),
          },
          description,
          custom_id: customId,
        },
      ],
      application_context: {
        user_action: 'PAY_NOW',
        brand_name: 'SINEW',
      },
    });

    const order = await paypalClient.execute(request);
    const links = order?.result?.links || [];
    const approveUrl = links.find((l) => l.rel === 'approve')?.href || null;

    return res.status(201).json({
      id: order?.result?.id,
      status: order?.result?.status,
      approveUrl,
      links,
    });
  } catch (error) {
    console.error('[PayPal] createOrder error:', error?.message || error);
    return res.status(500).json({ error: 'Error creando orden de PayPal' });
  }
};

/* =========================
   CAPTURE ORDER
   ========================= */
/**
 * Captura orden aprobada y cumple (curso o libro).
 * Espera body:
 *  - orderID (obligatorio)
 *  - courseSlug (opcional; si viene, se otorga acceso)
 *  - email / name (opcionales; fallback si no hay datos del payer)
 */
export const captureOrder = async (req, res) => {
  try {
    if (!hasPaypalCreds) {
      return res.status(500).json({ success: false, error: 'PayPal no configurado' });
    }

    const {
      orderID,
      courseSlug: courseSlugBody,
      email: emailFromBody,
      name: nameFromBody,
    } = req.body || {};

    if (!orderID) {
      return res.status(400).json({ success: false, error: 'Falta orderID' });
    }

    // 🔹 Normalizamos a una sola variable interna
    const orderId = orderID || req.body.orderId;

    // 1) Verificar estado actual
    const getReq = new paypal.orders.OrdersGetRequest(orderId);
    const before = await paypalClient.execute(getReq);

    if (before?.result?.status !== 'APPROVED') {
      return res
        .status(400)
        .json({ success: false, error: 'Orden no aprobada' });
    }

    // 2) Capturar
    const capReq = new paypal.orders.OrdersCaptureRequest(orderId);
    capReq.requestBody({});
    const capture = await paypalClient.execute(capReq);

    if (capture?.result?.status !== 'COMPLETED') {
      return res
        .status(400)
        .json({ success: false, error: 'Pago no completado' });
    }

    // 3) Datos de la compra
    const pu = capture.result.purchase_units?.[0];
    const pay = pu?.payments?.captures?.[0];

    const amountValue    = Number(pay?.amount?.value || 0);
    const amountCurrency = String(pay?.amount?.currency_code || 'USD').toUpperCase();

    const payer       = capture.result.payer || {};
    const paypalEmail = payer.email_address;
    const paypalName  = [payer?.name?.given_name, payer?.name?.surname]
      .filter(Boolean)
      .join(' ');

    const finalEmail = emailFromBody || paypalEmail || null;
    const finalName  = (nameFromBody || paypalName || 'Buyer').trim();

    const customId             = pu?.custom_id || '';
    const courseSlugFromCustom =
      customId.startsWith('course:') ? customId.split(':')[1] : null;
    const courseSlug = courseSlugFromCustom || courseSlugBody || null;

    // 4) Upsert user si hay email (o usa req.user si tu auth lo exige)
    let userId = req?.user?.id || null;

    if (!userId && finalEmail) {
      let user = await User.findOne({ email: finalEmail });
      if (!user) {
        user = await User.create({
          name: finalName,
          email: finalEmail,
          passwordHash: 'TEMP',
        });
      }
      userId = user._id;
    }

    // 5) Registrar compra
    await Purchase.create({
      userId,
      bookId: courseSlug ? undefined : 'libro-001',
      price: amountValue,
      currency: amountCurrency,
      status: 'paid',
      provider: 'paypal',
      orderId, // 🔹 acá usamos la variable definida
      purchaseDate: new Date(),
      metadata: { courseSlug },
    });

    // 6) Cumplir
    if (courseSlug) {
      await fulfillCourseAccess({
        userId,
        email: finalEmail,
        name: finalName,
        courseSlug,
        courseTitle: pu?.description,
      });

      return res.json({
        success: true,
        redirectTo: `${FRONTEND_URL}/cursos/${courseSlug}?paid=1`,
      });
    } else {
      // libro: podés adjuntar factura si la generás (buffer)
      const { redirectTo } = await fulfillBookDownload({
        userId,
        email: finalEmail,
        name: finalName,
        // invoiceBuffer,
        // invoiceName: `Factura-PP-${orderId}.pdf`,
      });

      return res.json({ success: true, redirectTo });
    }
  } catch (error) {
    console.error('[PayPal] captureOrder error raw:', {
      message: error?.message,
      name: error?.name,
      details: error?.details,
      statusCode: error?.statusCode,
    });
    return res
      .status(500)
      .json({ success: false, error: 'Error capturando pago' });
  }
};