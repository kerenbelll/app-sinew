// backend/controllers/purchaseController.js
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import paypal from '@paypal/checkout-server-sdk';
import DownloadToken from '../models/DownloadToken.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const hasPaypalCreds = !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;
const hasEmailCreds = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

console.log('[BOOT] PAYPAL:', hasPaypalCreds ? 'OK' : 'MISSING', '| SMTP:', hasEmailCreds ? 'OK' : 'MISSING');

// PayPal
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Crear orden
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para comprar' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'EUR', value: '29.99' },
          description: 'Libro digital - SINEW'
        },
      ],
    });

    const order = await paypalClient.execute(request);
    console.log('[PayPal] Order created:', order.result.id);
    res.status(201).json({ id: order.result.id });
  } catch (error) {
    console.error('[PayPal] createOrder error:', error);
    res.status(500).json({ error: 'Error creando orden de PayPal' });
  }
};

// Capturar orden
export const captureOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para completar el pago' });
    }

    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'Falta orderID' });

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await paypalClient.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Pago no completado' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    // Guardar compra
    await Purchase.create({
      userId,
      bookId: 'libro-001',
      price: 29.99,
      currency: 'EUR',
      status: 'paid',
      orderId: orderID,
      purchaseDate: new Date(),
    });

    // Token de descarga
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await DownloadToken.create({ userId, token, expiresAt, used: false });
    const downloadLink = `${FRONTEND_URL}/api//download/${token}`;

    // Email con enlace
    await transporter.sendMail({
      from: `"SINEW" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Tu enlace de descarga del libro',
      html: `<p>Hola ${user.name || ''},</p>
             <p>Gracias por tu compra. Descarga tu libro aquí (válido 24h):</p>
             <a href="${downloadLink}">Descargar libro</a>`,
    });

    res.json({ message: 'Pago confirmado, revisa tu email para el enlace de descarga' });
  } catch (error) {
    console.error('[PayPal] captureOrder error:', error);
    res.status(500).json({ error: 'Error capturando pago' });
  }
};
