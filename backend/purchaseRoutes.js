// backend/routes/purchaseRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import crypto from "crypto";

import User from "../models/User.js";
import Book from "../models/Book.js";
import Purchase from "../models/Purchase.js";
import DownloadToken from "../models/DownloadToken.js";
import { sendPurchaseEmail } from "../utils/mailer.js";

const router = express.Router();

const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
const JWT_SECRET    = process.env.JWT_SECRET;

/* Auth mínimo */
const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No autorizado (falta token)" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId    = decoded?.id || decoded?.userId;
    if (!req.userId) return res.status(401).json({ message: "Token inválido (sin userId)" });
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};

/* PDF de factura */
async function buildInvoicePdf({ invoiceNumber, user, book, amount, currency }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text("SINEW - Factura / Comprobante", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Nro: ${invoiceNumber}`);
      doc.text(`Fecha: ${new Date().toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(12).text("Datos del cliente:", { underline: true });
      doc.moveDown(0.2);
      doc.text(`Nombre: ${user?.name || "-"}`);
      doc.text(`Email: ${user?.email || "-"}`);
      doc.moveDown();

      doc.fontSize(12).text("Detalle:", { underline: true });
      doc.moveDown(0.2);
      doc.text(`Producto: ${book?.title || "Libro digital"}`);
      doc.text(`Precio: ${currency} ${Number(amount).toFixed(2)}`);
      doc.moveDown(2);

      doc.fontSize(10).text("Gracias por su compra.", { align: "center" });
      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

/* POST /api/purchase/buy/:bookId (simulado) */
router.post("/buy/:bookId", authMiddleware, async (req, res) => {
  try {
    if (!JWT_SECRET) return res.status(500).json({ message: "Falta JWT_SECRET en .env" });

    const { bookId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Libro no encontrado" });

    const amount   = Number(book.price || 13.0);
    const currency = (book.currency || "USD").toUpperCase();
    const orderId  = `SIM-${Date.now()}`;

    await Purchase.create({
      userId: user._id,
      bookId: book._id,
      price: amount,
      currency,
      status: "paid",
      provider: "manual",
      orderId,
      purchaseDate: new Date(),
    });

    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await DownloadToken.create({ userId: user._id, token, expiresAt, used: false });

    const thankYouUrl = `${FRONTEND_URL}/gracias?status=success&download=${encodeURIComponent(token)}`;

    const invoiceNumber = `S-${new Date().toISOString().slice(0,10)}-${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`;
    const invoicePdf    = await buildInvoicePdf({ invoiceNumber, user, book, amount, currency });

    let emailed = false;
    try {
      const r = await sendPurchaseEmail({
        toEmail: user.email,
        buyerName: (user.name || "").trim() || "¡Hola!",
        downloadLink: thankYouUrl,
        invoiceBuffer: invoicePdf,
        invoiceName: `Factura-${invoiceNumber}.pdf`,
      });
      emailed = !!r?.ok;
    } catch (mailErr) {
      console.error("[purchaseRoutes] mailer error:", mailErr?.message || mailErr);
    }

    return res.json({
      ok: true,
      message: emailed ? "Compra ok. Enviamos tu email." : "Compra ok, el email no se pudo enviar.",
      emailed,
      downloadLink: thankYouUrl,
      rawDownload: `/api/download/${token}`,
    });
  } catch (error) {
    console.error("[purchaseRoutes] Error:", error?.message || error);
    return res.status(500).json({ message: "Error en la compra" });
  }
});

export default router;