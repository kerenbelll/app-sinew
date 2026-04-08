import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import paypal from "@paypal/checkout-server-sdk";

import DownloadToken from "../models/DownloadToken.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import CourseAccess from "../models/CourseAccess.js";
import { sendPurchaseEmail, sendCourseAccessEmail } from "../utils/mailer.js";

dotenv.config();

/* =========================
   Config
   ========================= */
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
const hasPaypalCreds = !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;
const hasEmailCreds = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

console.log(
  "[BOOT][purchaseController] PAYPAL:",
  hasPaypalCreds ? "OK" : "MISSING",
  "| SMTP:",
  hasEmailCreds ? "OK" : "MISSING"
);

const PAYPAL_ENV = String(process.env.PAYPAL_ENV || "sandbox").toLowerCase();
const clientId = process.env.PAYPAL_CLIENT_ID || "MISSING";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "MISSING";

const environment =
  PAYPAL_ENV === "live"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const paypalClient = new paypal.core.PayPalHttpClient(environment);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: hasEmailCreds
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

/* =========================
   Helpers
   ========================= */
function normalizeResourceType(value) {
  if (value === "masterclass") return "masterclass";
  if (value === "course") return "course";
  return "book";
}

function parseCustomId(customId = "") {
  if (!customId || typeof customId !== "string") {
    return { type: "book", slug: null };
  }

  const match = customId.match(/^(course|masterclass):(.+)$/i);
  if (!match) {
    return { type: "book", slug: null };
  }

  return {
    type: normalizeResourceType(match[1].toLowerCase()),
    slug: match[2] || null,
  };
}

/* =========================
   Fulfillment
   ========================= */
async function fulfillResourceAccess({
  userId,
  email,
  name,
  courseSlug,
  courseTitle,
  provider = "paypal",
}) {
  if (!courseSlug || !userId) return null;

  await CourseAccess.updateOne(
    { userId, courseSlug },
    {
      $set: {
        userId,
        courseSlug,
        provider,
        grantedBy: provider,
        grantedAt: new Date(),
      },
    },
    { upsert: true }
  );

  const courseUrl = `${FRONTEND_URL}/cursos/${courseSlug}?paid=1`;

  if (email) {
    try {
      const result = await sendCourseAccessEmail({
        toEmail: email,
        buyerName: (name || "Alumno").trim(),
        courseTitle: courseTitle || "Recurso SINEW",
        courseUrl,
      });
      console.log("[Email] acceso recurso →", result);
    } catch (e) {
      console.error("[Email] acceso recurso error:", e?.message || e);
    }
  }

  return { courseUrl };
}

async function fulfillBookDownload({ userId, email, name, invoiceBuffer, invoiceName }) {
  if (!userId) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await DownloadToken.create({ userId, token, expiresAt, used: false });

  const redirectTo = `${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(token)}`;

  if (email) {
    try {
      const result = await sendPurchaseEmail({
        toEmail: email,
        buyerName: (name || "Buyer").trim(),
        downloadLink: redirectTo,
        invoiceBuffer,
        invoiceName,
      });
      console.log("[Email] libro →", result);
    } catch (e) {
      console.error("[Email] libro error:", e?.message || e);

      if (hasEmailCreds) {
        try {
          await transporter.sendMail({
            from: `"SINEW" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Tu enlace de descarga del libro",
            html: `<p>Hola ${name || ""},</p>
                   <p>Gracias por tu compra. Descarga tu libro (24h):</p>
                   <a href="${redirectTo}">${redirectTo}</a>`,
          });
        } catch (e2) {
          console.error("[Email][fallback] libro error:", e2?.message || e2);
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
 * Crea orden de PayPal.
 * Espera body:
 * - items: [{ type, sku, name, quantity, unit_amount, currency }]
 * - meta: { courseSlug, buyerEmail, type }
 *
 * Compatibilidad:
 * - price, currency, title, metadata, buyer
 */
export const createOrder = async (req, res) => {
  try {
    if (!hasPaypalCreds) {
      return res.status(500).json({ error: "PayPal no configurado" });
    }

    const items = Array.isArray(req.body?.items) ? [...req.body.items] : [];
    const meta = req.body?.meta || {};

    if (!items.length && req.body?.price) {
      const amountValue = Number(req.body.price ?? 35);
      const currency = String(req.body.currency ?? "USD").toUpperCase();
      const description = req.body.title || "Producto SINEW";
      const metadataType = normalizeResourceType(req.body.metadata?.type || req.body.metadata?.kind);
      const metadataSlug =
        req.body.metadata?.courseSlug || req.body.metadata?.slug || "libro-001";

      items.push({
        type: metadataType,
        sku: metadataSlug,
        name: description,
        quantity: 1,
        unit_amount: amountValue,
        currency,
      });

      if (!Object.keys(meta).length && req.body.metadata) {
        Object.assign(meta, req.body.metadata);
      }
    }

    const firstItem = items?.[0] || {};
    const amountValue = Number(firstItem.unit_amount ?? 35);
    const currency = String(firstItem.currency ?? "USD").toUpperCase();
    const description = firstItem.name || "Producto SINEW";
    const itemType = normalizeResourceType(firstItem.type || meta.type || meta.kind);
    const itemSlug = firstItem.sku || meta.courseSlug || meta.slug || "libro-001";

    const customId =
      itemType === "book"
        ? "book:libro-001"
        : `${itemType}:${itemSlug}`;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
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
        user_action: "PAY_NOW",
        brand_name: "SINEW",
      },
    });

    const order = await paypalClient.execute(request);
    const links = order?.result?.links || [];
    const approveUrl = links.find((l) => l.rel === "approve")?.href || null;

    return res.status(201).json({
      id: order?.result?.id,
      status: order?.result?.status,
      approveUrl,
      links,
    });
  } catch (error) {
    console.error("[PayPal] createOrder error:", error?.message || error);
    return res.status(500).json({ error: "Error creando orden de PayPal" });
  }
};

/* =========================
   CAPTURE ORDER
   ========================= */
/**
 * Captura orden aprobada y cumple libro/recurso.
 * Espera body:
 * - orderID
 * - courseSlug (opcional)
 * - type (opcional: course | masterclass | book)
 * - email
 * - name
 */
export const captureOrder = async (req, res) => {
  try {
    if (!hasPaypalCreds) {
      return res.status(500).json({ success: false, error: "PayPal no configurado" });
    }

    const {
      orderID,
      orderId: legacyOrderId,
      courseSlug: courseSlugBody,
      type: typeFromBody,
      email: emailFromBody,
      name: nameFromBody,
    } = req.body || {};

    const finalOrderId = orderID || legacyOrderId;

    if (!finalOrderId) {
      return res.status(400).json({ success: false, error: "Falta orderID" });
    }

    const getReq = new paypal.orders.OrdersGetRequest(finalOrderId);
    const before = await paypalClient.execute(getReq);

    if (before?.result?.status !== "APPROVED") {
      return res.status(400).json({ success: false, error: "Orden no aprobada" });
    }

    const capReq = new paypal.orders.OrdersCaptureRequest(finalOrderId);
    capReq.requestBody({});
    const capture = await paypalClient.execute(capReq);

    if (capture?.result?.status !== "COMPLETED") {
      return res.status(400).json({ success: false, error: "Pago no completado" });
    }

    const purchaseUnit = capture.result.purchase_units?.[0];
    const pay = purchaseUnit?.payments?.captures?.[0];

    const amountValue = Number(pay?.amount?.value || 0);
    const amountCurrency = String(pay?.amount?.currency_code || "USD").toUpperCase();

    const payer = capture.result.payer || {};
    const paypalEmail = payer.email_address || null;
    const paypalName = [payer?.name?.given_name, payer?.name?.surname]
      .filter(Boolean)
      .join(" ");

    const finalEmail = emailFromBody || paypalEmail || null;
    const finalName = (nameFromBody || paypalName || "Buyer").trim();

    const customId = purchaseUnit?.custom_id || "";
    const parsedCustom = parseCustomId(customId);

    const resourceType =
      parsedCustom.type !== "book"
        ? parsedCustom.type
        : normalizeResourceType(typeFromBody);

    const courseSlug = parsedCustom.slug || courseSlugBody || null;

    let userId = req?.user?.id || null;

    if (!userId && finalEmail) {
      let user = await User.findOne({ email: finalEmail });
      if (!user) {
        user = await User.create({
          name: finalName,
          email: finalEmail,
          passwordHash: "TEMP",
        });
      }
      userId = user._id;
    }

    await Purchase.create({
      userId,
      bookId: courseSlug ? undefined : "libro-001",
      price: amountValue,
      currency: amountCurrency,
      status: "paid",
      provider: "paypal",
      orderId: finalOrderId,
      purchaseDate: new Date(),
      metadata: {
        type: courseSlug ? resourceType : "book",
        courseSlug,
      },
    });

    if (courseSlug) {
      await fulfillResourceAccess({
        userId,
        email: finalEmail,
        name: finalName,
        courseSlug,
        courseTitle: purchaseUnit?.description,
        provider: "paypal",
      });

      return res.json({
        success: true,
        redirectTo: `${FRONTEND_URL}/cursos/${courseSlug}?paid=1`,
      });
    }

    const downloadResult = await fulfillBookDownload({
      userId,
      email: finalEmail,
      name: finalName,
    });

    return res.json({
      success: true,
      redirectTo: downloadResult?.redirectTo || `${FRONTEND_URL}/gracias?status=success`,
    });
  } catch (error) {
    console.error("[PayPal] captureOrder error raw:", {
      message: error?.message,
      name: error?.name,
      details: error?.details,
      statusCode: error?.statusCode,
    });

    return res.status(500).json({
      success: false,
      error: "Error capturando pago",
    });
  }
};