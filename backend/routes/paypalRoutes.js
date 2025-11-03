// backend/routes/paypalRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createOrder, captureOrder } from '../controllers/purchaseController.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const PAYPAL_ENV = String(process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const hasPaypalCreds = !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;

console.log(`[BOOT][paypalRoutes] mode=${PAYPAL_ENV} | PAYPAL=${hasPaypalCreds ? 'OK' : 'MISSING'}`);

// Auth opcional/obligatorio según tu criterio:
function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded?.id || decoded?.userId, email: decoded?.email };
    if (!req.user.id) return res.status(401).json({ error: 'UNAUTHORIZED' });
    next();
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

router.get('/ping', (_req, res) => {
  res.json({ ok: true, mode: PAYPAL_ENV, paypal: hasPaypalCreds });
});

// Crear orden: podés no exigir login aquí si querés permitir “pre-orden” anónima.
// Si preferís exigir login, cambiá a `authRequired, createOrder`.
router.post('/create-order', createOrder);

// Capturar: recomendado exigir login para atar acceso al usuario logueado.
// Si tu `captureOrder` ya resuelve por email del payer, podrías quitar el auth.
router.post('/capture-order', authRequired, captureOrder);

export default router;