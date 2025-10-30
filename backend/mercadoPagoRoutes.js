// backend/routes/mercadoPagoRoutes.js
import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

import Purchase from "../models/Purchase.js";
import DownloadToken from "../models/DownloadToken.js";
import User from "../models/User.js";
import CourseAccess from "../models/CourseAccess.js";
import { sendPurchaseEmail, sendCourseAccessEmail } from "../utils/mailer.js";

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

dotenv.config();
const router = express.Router();

/* Helpers */
const norm    = (v, def) => String(v || def).trim().replace(/\/$/, "");
const isHttps = (u) => /^https:\/\//i.test(u);
const isLocal = (u) => /localhost|127\.0\.0\.1/i.test(u);

/* URLs */
const FRONTEND_URL = norm(process.env.FRONTEND_URL, "http://localhost:3000");
const BACKEND_URL  = norm(process.env.BACKEND_URL,  "http://localhost:5001");

/* MP Client */
const mpClient = process.env.MP_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
  : null;

/* Helpers curso */
const pickCourseSlugFromPayment = (p) => {
  if (p?.metadata?.courseSlug) return p.metadata.courseSlug;
  const itemId = p?.additional_info?.items?.[0]?.id;
  if (itemId && /^course:/i.test(itemId)) return itemId.split(":")[1];
  return null;
};
const pickCourseSlugFromPreference = (pref) =>
  pref?.metadata?.courseSlug || pref?.metadata?.slug || null;

/* Fulfillment curso */
async function fulfillCourseAccess({ userId, email, name, courseSlug, courseTitle }) {
  if (!courseSlug) return null;
  await CourseAccess.updateOne(
    { userId, courseSlug },
    { $set: { userId, courseSlug, provider: "mercadopago", grantedAt: new Date() } },
    { upsert: true }
  );
  const courseUrl = `${FRONTEND_URL}/cursos/${courseSlug}?paid=1`;
  if (email) {
    try {
      const r = await sendCourseAccessEmail({
        toEmail: email,
        buyerName: (name || "").trim() || "¡Hola!",
        courseTitle: courseTitle || "Curso SINEW",
        courseUrl,
      });
      console.log("[MP] mail curso:", r);
    } catch (e) {
      console.error("[MP] email curso error:", e?.message || e);
    }
  }
  return { courseUrl };
}

/* Fulfillment libro */
async function fulfillBookDownload({ userId, email, name }) {
  const token     = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await DownloadToken.create({ userId, token, expiresAt, used: false });

  const thankYouUrl = `${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(token)}`;

  if (email) {
    try {
      await sendPurchaseEmail({
        toEmail: email,
        buyerName: (name || "").trim() || "¡Hola!",
        downloadLink: thankYouUrl,
      });
    } catch (e) {
      console.error("[MP] email libro error:", e?.message || e);
    }
  }
  return { token, thankYouUrl, rawDownload: `/api/download/${token}` };
}

/* Ping */
router.get("/ping", (_req, res) => {
  res.json({ ok: true, mp: !!mpClient, FRONTEND_URL, BACKEND_URL });
});

/* Crear preferencia (MLA sandbox friendly) */
router.post("/create-preference", async (req, res) => {
  try {
    if (!mpClient) return res.status(500).json({ error: "Mercado Pago no configurado" });

    const { price = 12900, currency = "ARS", title = "Producto SINEW", buyer = {}, metadata = {} } = req.body || {};
    const unitPrice  = Number(price);
    const currencyId = String(currency || "ARS").toUpperCase();

    // Sandbox MLA: nombre APRO, DNI y mail de test user (ideal)
    const buyerName  = (buyer?.name || "APRO").trim();
    const buyerEmail = (buyer?.email && buyer.email.includes("@"))
      ? buyer.email
      : `test_${Date.now()}@sinew.test`;

    const courseSlug = metadata?.courseSlug || (metadata?.type === "course" ? metadata?.slug : null) || null;
    const itemId     = courseSlug ? `course:${courseSlug}` : "libro-001";
    const external_reference = courseSlug ? `course:${courseSlug}` : "book:libro-001";

    const backendIsPublic = isHttps(BACKEND_URL) && !isLocal(BACKEND_URL);
    const back_urls = backendIsPublic
      ? {
          success: `${BACKEND_URL}/api/mp/return`,
          failure: `${FRONTEND_URL}/gracias?status=failure`,
          pending: `${FRONTEND_URL}/gracias?status=pending`,
        }
      : {
          success: `${FRONTEND_URL}/gracias?status=success`,
          failure: `${FRONTEND_URL}/gracias?status=failure`,
          pending: `${FRONTEND_URL}/gracias?status=pending`,
        };

    const preference = new Preference(mpClient);
    const body = {
      items: [{
        id: itemId,
        title,
        quantity: 1,
        currency_id: currencyId,   // ← ARS
        unit_price: unitPrice,
        description: title,
      }],
      payer: {
        name:  buyerName,
        email: buyerEmail,
        identification: { type: "DNI", number: "12345678" },
      },
      payment_methods: {
        installments: 1,
        default_installments: 1,
      },
      back_urls,
      external_reference,
      metadata: { ...metadata, courseSlug, itemId, title },
      ...(backendIsPublic ? {
        notification_url: `${BACKEND_URL}/api/mp/webhook`,
        auto_return: "approved",
      } : {}),
    };

    const result = await preference.create({ body });
    return res.status(201).json({
      id:         result?.id         || result?.body?.id,
      init_point: result?.init_point || result?.body?.init_point,
    });
  } catch (err) {
    console.error("[MP] create-preference error:", err?.message || err);
    return res.status(500).json({ error: "MP_CREATE_PREFERENCE_FAILED", message: err?.message || "Error" });
  }
});

/* Return (redirect del checkout) */
router.get("/return", async (req, res) => {
  try {
    if (!mpClient) return res.status(500).send("MP no configurado");

    const { payment_id, preference_id } = req.query;
    if (!payment_id) {
      return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=missing_payment_id`);
    }

    const payment = new Payment(mpClient);
    const data = await payment.get({ id: String(payment_id) });
    if ((String(data?.status) || "").toLowerCase() !== "approved") {
      return res.redirect(`${FRONTEND_URL}/gracias?status=not_approved`);
    }

    let courseSlug = pickCourseSlugFromPayment(data);
    if (!courseSlug && preference_id) {
      try {
        const pref = await new Preference(mpClient).get({ id: String(preference_id) });
        courseSlug = pickCourseSlugFromPreference(pref);
      } catch (e) {
        console.warn("[MP return] no se pudo leer preference:", e?.message || e);
      }
    }

    let email =
      data.payer?.email ||
      data.additional_info?.payer?.email ||
      data.external_reference || "";
    if (!email) email = `mp+${data.id}@sinew.test`;

    const name =
      data.payer?.first_name ||
      data.payer?.name ||
      data.additional_info?.payer?.first_name ||
      "Cliente MP";

    const amountValue    = data.transaction_amount;
    const amountCurrency = data.currency_id || "ARS";
    const orderId        = data.id;
    const courseTitle    = data.description || data.metadata?.title || (courseSlug ? "Curso SINEW" : "Libro SINEW");

    // upsert user
    let userId;
    try {
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ name: (name || "").trim(), email, passwordHash: "TEMP" });
      userId = user._id;
    } catch (e) {
      console.error("[MP return] upsert user error:", e?.message || e);
    }

    // compra (idempotente simple)
    try {
      await Purchase.create({
        userId,
        bookId: courseSlug ? undefined : "libro-001",
        price: Number(amountValue),
        currency: amountCurrency,
        status: "paid",
        provider: "mercadopago",
        orderId: String(orderId),
        purchaseDate: new Date(),
        metadata: { courseSlug },
      });
    } catch (e) {
      if (e?.code !== 11000) {
        console.error("[MP] return create purchase error:", e?.message || e);
        return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=server_error`);
      }
    }

    if (courseSlug) {
      await fulfillCourseAccess({ userId, email, name, courseSlug, courseTitle });
      return res.redirect(`${FRONTEND_URL}/cursos/${courseSlug}?paid=1&success=1`);
    } else {
      const { token } = await fulfillBookDownload({ userId, email, name });
      return res.redirect(`${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(token)}`);
    }
  } catch (err) {
    console.error("[MP] return error:", err?.message || err);
    return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=server_error`);
  }
});

/* Webhook */
router.all("/webhook", async (req, res) => {
  try {
    if (!mpClient) return res.status(500).json({ received:true, error:"MP_NOT_CONFIGURED" });

    const topic = (req.query?.topic || req.body?.topic || req.body?.type || "").toString().toLowerCase();
    const id    = (req.query?.id || req.body?.id || req.body?.data?.id || "").toString();
    if (!topic || !id) {
      console.warn("[MP webhook] request sin topic/id válidos", { query: req.query, body: req.body });
      return res.json({ received: true });
    }

    const paymentSdk = new Payment(mpClient);

    const processApprovedPayment = async (pay) => {
      if (!pay || (String(pay?.status) || "").toLowerCase() !== "approved") return false;

      let courseSlug = pickCourseSlugFromPayment(pay);

      let email =
        pay.payer?.email ||
        pay.additional_info?.payer?.email ||
        pay.external_reference || "";
      if (!email) email = `mp+${pay.id}@sinew.test`;

      const name =
        pay.payer?.first_name ||
        pay.payer?.name ||
        pay.additional_info?.payer?.first_name ||
        "Cliente MP";

      let userId;
      try {
        let user = await User.findOne({ email });
        if (!user) user = await User.create({ name: (name || "").trim(), email, passwordHash: "TEMP" });
        userId = user._id;
      } catch (e) {
        console.error("[MP webhook] upsert user error:", e?.message || e);
      }

      try {
        await Purchase.create({
          userId,
          bookId: courseSlug ? undefined : "libro-001",
          price: Number(pay.transaction_amount),
          currency: pay.currency_id || "ARS",
          status: "paid",
          provider: "mercadopago",
          orderId: String(pay.id),
          purchaseDate: new Date(),
          metadata: { courseSlug },
        });
        console.log("[MP webhook] purchase insertada", pay.id);
      } catch (e) {
        if (e?.code === 11000) {
          console.log("[MP webhook] purchase ya existía", pay.id);
        } else {
          console.error("[MP webhook] error insert purchase:", e?.message || e);
          return res.json({ received: true, ok: false });
        }
      }

      const courseTitle = pay.description || (courseSlug ? "Curso SINEW" : "Libro SINEW");
      if (courseSlug) {
        await fulfillCourseAccess({ userId, email, name, courseSlug, courseTitle });
      } else {
        await fulfillBookDownload({ userId, email, name });
      }
      return true;
    };

    if (topic === "payment") {
      const info = await paymentSdk.get({ id: String(id) });
      await processApprovedPayment(info);
      return res.json({ received: true, ok: true, topic: "payment" });
    }

    if (topic === "merchant_order") {
      const r = await fetch(`https://api.mercadopago.com/merchant_orders/${id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      if (!r.ok) {
        console.error("[MP webhook] merchant_orders fetch error", r.status, r.statusText);
        return res.json({ received: true, ok: false, topic: "merchant_order" });
      }
      const mo = await r.json();

      if (Array.isArray(mo.payments) && mo.payments.length) {
        for (const p of mo.payments) {
          try {
            const full = await paymentSdk.get({ id: String(p.id) });
            await processApprovedPayment(full);
          } catch (e) {
            console.error("[MP webhook] error trayendo payment", p?.id, e?.message || e);
          }
        }
      } else {
        console.log("[MP webhook] merchant_order sin payments aún", id);
      }
      return res.json({ received: true, ok: true, topic: "merchant_order" });
    }

    console.log("[MP webhook] topic no manejado:", topic, { id });
    return res.json({ received: true });
  } catch (err) {
    console.error("[MP webhook error]", err?.message || err);
    return res.json({ received: true, error: true });
  }
});

export default router;