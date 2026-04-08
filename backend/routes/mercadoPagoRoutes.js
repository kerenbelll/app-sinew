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

const norm = (v, def) => String(v || def).trim().replace(/\/$/, "");
const isHttps = (u) => /^https:\/\//i.test(u);
const isLocal = (u) => /localhost|127\.0\.0\.1/i.test(u);

const FRONTEND_URL = norm(process.env.FRONTEND_URL, "http://localhost:3000");
const BACKEND_URL = norm(process.env.BACKEND_URL, "http://localhost:5001");

const mpClient = process.env.MP_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
  : null;

const normalizeResourceType = (value) => {
  if (value === "masterclass") return "masterclass";
  if (value === "course") return "course";
  return "book";
};

const pickResourceFromPayment = (payment) => {
  const slug = payment?.metadata?.courseSlug || payment?.metadata?.slug || null;
  const type = normalizeResourceType(payment?.metadata?.type || payment?.metadata?.kind);

  if (slug) {
    return { slug, type };
  }

  const itemId = payment?.additional_info?.items?.[0]?.id;
  if (itemId && /^(course|masterclass):/i.test(itemId)) {
    const [kind, value] = itemId.split(":");
    return {
      slug: value || null,
      type: normalizeResourceType(kind.toLowerCase()),
    };
  }

  return { slug: null, type: "book" };
};

const pickResourceFromPreference = (pref) => {
  return {
    slug: pref?.metadata?.courseSlug || pref?.metadata?.slug || null,
    type: normalizeResourceType(pref?.metadata?.type || pref?.metadata?.kind),
  };
};

async function fulfillResourceAccess({
  userId,
  email,
  name,
  courseSlug,
  courseTitle,
  provider = "mercadopago",
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
      await sendCourseAccessEmail({
        toEmail: email,
        buyerName: (name || "").trim() || "¡Hola!",
        courseTitle: courseTitle || "Recurso SINEW",
        courseUrl,
      });
    } catch (e) {
      console.error("[MP] email recurso error:", e?.message || e);
    }
  }

  return { courseUrl };
}

async function fulfillBookDownload({ userId, email, name }) {
  if (!userId) return null;

  const token = crypto.randomBytes(32).toString("hex");
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

  return {
    downloadLink: thankYouUrl,
    rawDownload: `/api/download/${token}`,
  };
}

router.get("/ping", (_req, res) => {
  res.json({ ok: true, mp: !!mpClient, FRONTEND_URL, BACKEND_URL });
});

router.get("/whoami", async (_req, res) => {
  try {
    const r = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    const j = await r.json();

    res.json({
      ok: true,
      seller_id: j?.id,
      nickname: j?.nickname,
      email: j?.email,
      test_user: j?.test_data?.test_user === true,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

router.post("/create-preference", async (req, res) => {
  try {
    if (!mpClient) {
      return res.status(500).json({ error: "Mercado Pago no configurado" });
    }

    const {
      price = 12900,
      currency = "ARS",
      title = "Producto SINEW",
      buyer = {},
      metadata = {},
    } = req.body || {};

    const unitPrice = Number(price);
    const currencyId = String(currency).toUpperCase();
    const buyerName = buyer?.name || "";
    const buyerEmail = buyer?.email || "";

    const resourceType = normalizeResourceType(metadata?.type || metadata?.kind);
    const resourceSlug = metadata?.courseSlug || metadata?.slug || null;

    const itemId =
      resourceType !== "book" && resourceSlug
        ? `${resourceType}:${resourceSlug}`
        : "book:libro-001";

    const externalReference = itemId;
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
      items: [
        {
          id: itemId,
          title,
          quantity: 1,
          currency_id: currencyId,
          unit_price: unitPrice,
          description: title,
        },
      ],
      payer: {
        name: buyerName,
        email: buyerEmail || `test_${Date.now()}@testuser.com`,
      },
      back_urls,
      external_reference: externalReference,
      metadata: {
        ...metadata,
        type: resourceType,
        kind: resourceType,
        courseSlug: resourceSlug,
        slug: resourceSlug,
        itemId,
        title,
      },
      ...(backendIsPublic
        ? {
            notification_url: `${BACKEND_URL}/api/mp/webhook`,
            auto_return: "approved",
          }
        : {}),
    };

    const result = await preference.create({ body });
    const responseBody = result?.body || result;

    return res.status(201).json({
      id: responseBody.id,
      init_point: responseBody.init_point,
      sandbox_init_point: responseBody.sandbox_init_point,
    });
  } catch (err) {
    console.error("[MP] create-preference error:", err?.message || err);
    return res.status(500).json({
      error: "MP_CREATE_PREFERENCE_FAILED",
      message: err?.message || "Error",
    });
  }
});

router.get("/return", async (req, res) => {
  try {
    if (!mpClient) return res.status(500).send("MP no configurado");

    const { payment_id, preference_id } = req.query;
    if (!payment_id) {
      return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=missing_payment_id`);
    }

    const paymentSdk = new Payment(mpClient);
    const paymentData = await paymentSdk.get({ id: String(payment_id) });

    if ((paymentData.status || "").toLowerCase() !== "approved") {
      return res.redirect(`${FRONTEND_URL}/gracias?status=not_approved`);
    }

    let resource = pickResourceFromPayment(paymentData);

    if (!resource.slug && preference_id) {
      try {
        const pref = await new Preference(mpClient).get({ id: String(preference_id) });
        resource = pickResourceFromPreference(pref);
      } catch (e) {
        console.warn("[MP return] no se pudo leer preference:", e?.message || e);
      }
    }

    const courseSlug = resource.slug;
    const resourceType = resource.type;

    let email =
      paymentData.payer?.email ||
      paymentData.additional_info?.payer?.email ||
      paymentData.external_reference ||
      "";

    if (!email) email = `mp+${paymentData.id}@sinew.test`;

    const name =
      paymentData.payer?.first_name ||
      paymentData.payer?.name ||
      paymentData.additional_info?.payer?.first_name ||
      "Cliente MP";

    const amountValue = paymentData.transaction_amount;
    const amountCurrency = paymentData.currency_id || "ARS";
    const orderId = paymentData.id;
    const resourceTitle =
      paymentData.description ||
      paymentData.metadata?.title ||
      (courseSlug ? "Recurso SINEW" : "Libro SINEW");

    let userId;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: (name || "").trim(),
          email,
          passwordHash: "TEMP",
        });
      }
      userId = user._id;
    } catch (e) {
      console.error("[MP return] upsert user error:", e?.message || e);
    }

    try {
      await Purchase.create({
        userId,
        bookId: resourceType === "book" ? "libro-001" : undefined,
        price: Number(amountValue),
        currency: amountCurrency,
        status: "paid",
        provider: "mercadopago",
        orderId: String(orderId),
        purchaseDate: new Date(),
        metadata: {
          type: resourceType,
          courseSlug,
        },
      });
    } catch (e) {
      if (e?.code !== 11000) {
        console.error("[MP] return create purchase error:", e?.message || e);
        return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=server_error`);
      }
    }

    if (courseSlug) {
      await fulfillResourceAccess({
        userId,
        email,
        name,
        courseSlug,
        courseTitle: resourceTitle,
        provider: "mercadopago",
      });

      return res.redirect(`${FRONTEND_URL}/cursos/${courseSlug}?paid=1&success=1`);
    }

    const downloadResult = await fulfillBookDownload({ userId, email, name });

    return res.redirect(
      `${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(
        downloadResult?.rawDownload || ""
      )}`
    );
  } catch (err) {
    console.error("[MP] return error:", err?.message || err);
    return res.redirect(`${FRONTEND_URL}/gracias?status=error&error=server_error`);
  }
});

router.all("/webhook", async (req, res) => {
  try {
    if (!mpClient) {
      return res.status(500).json({ received: true, error: "MP_NOT_CONFIGURED" });
    }

    const topic = (req.query?.topic || req.body?.topic || req.body?.type || "")
      .toString()
      .toLowerCase();

    const id = (req.query?.id || req.body?.id || req.body?.data?.id || "")
      .toString();

    if (!topic || !id) {
      console.warn("[MP webhook] request sin topic/id válidos", {
        query: req.query,
        body: req.body,
      });
      return res.json({ received: true });
    }

    const paymentSdk = new Payment(mpClient);

    const processApprovedPayment = async (paymentData) => {
      if (!paymentData || (paymentData.status || "").toLowerCase() !== "approved") {
        return false;
      }

      const resource = pickResourceFromPayment(paymentData);
      const courseSlug = resource.slug;
      const resourceType = resource.type;

      let email =
        paymentData.payer?.email ||
        paymentData.additional_info?.payer?.email ||
        paymentData.external_reference ||
        "";

      if (!email) email = `mp+${paymentData.id}@sinew.test`;

      const name =
        paymentData.payer?.first_name ||
        paymentData.payer?.name ||
        paymentData.additional_info?.payer?.first_name ||
        "Cliente MP";

      let userId;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: (name || "").trim(),
            email,
            passwordHash: "TEMP",
          });
        }
        userId = user._id;
      } catch (e) {
        console.error("[MP webhook] upsert user error:", e?.message || e);
      }

      try {
        await Purchase.create({
          userId,
          bookId: resourceType === "book" ? "libro-001" : undefined,
          price: Number(paymentData.transaction_amount),
          currency: paymentData.currency_id || "ARS",
          status: "paid",
          provider: "mercadopago",
          orderId: String(paymentData.id),
          purchaseDate: new Date(),
          metadata: {
            type: resourceType,
            courseSlug,
          },
        });
        console.log("[MP webhook] purchase insertada", paymentData.id);
      } catch (e) {
        if (e?.code === 11000) {
          console.log("[MP webhook] purchase ya existía", paymentData.id);
        } else {
          console.error("[MP webhook] error insert purchase:", e?.message || e);
          return res.json({ received: true, ok: false });
        }
      }

      const resourceTitle =
        paymentData.description ||
        paymentData.metadata?.title ||
        (courseSlug ? "Recurso SINEW" : "Libro SINEW");

      if (courseSlug) {
        await fulfillResourceAccess({
          userId,
          email,
          name,
          courseSlug,
          courseTitle: resourceTitle,
          provider: "mercadopago",
        });
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
      const response = await fetch(`https://api.mercadopago.com/merchant_orders/${id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });

      if (!response.ok) {
        console.error("[MP webhook] merchant_orders fetch error", response.status, response.statusText);
        return res.json({ received: true, ok: false, topic: "merchant_order" });
      }

      const merchantOrder = await response.json();

      if (Array.isArray(merchantOrder.payments) && merchantOrder.payments.length) {
        for (const paymentItem of merchantOrder.payments) {
          try {
            const fullPayment = await paymentSdk.get({ id: String(paymentItem.id) });
            await processApprovedPayment(fullPayment);
          } catch (e) {
            console.error(
              "[MP webhook] error trayendo payment",
              paymentItem?.id,
              e?.message || e
            );
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