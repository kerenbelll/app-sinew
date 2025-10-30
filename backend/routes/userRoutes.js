// backend/routes/userRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendResetEmail } from '../utils/mailer.js';

const router = express.Router();

/* =========================
   Config + helpers
   ========================= */
const JWT_SECRET   = process.env.JWT_SECRET || 'dev_secret_change_me';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

// JWT
function issueToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware: requiere "Authorization: Bearer <token>"
function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');

  if (!token) {
    console.warn(`[auth] 401 en ${req.method} ${req.originalUrl} – sin Authorization`);
    return res.status(401).json({ message: 'UNAUTHORIZED', reason: 'missing_token' });
  }
  if (scheme !== 'Bearer') {
    console.warn(`[auth] 401 en ${req.method} ${req.originalUrl} – esquema inválido: ${scheme}`);
    return res.status(401).json({ message: 'UNAUTHORIZED', reason: 'invalid_scheme' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (e) {
    console.warn(`[auth] 401 en ${req.method} ${req.originalUrl} – token inválido/expirado`);
    return res.status(401).json({ message: 'UNAUTHORIZED', reason: 'invalid_or_expired' });
  }
}

/* =========================
   POST /api/users/register
   ========================= */
router.post('/register', async (req, res) => {
  try {
    let { name = '', email, password = '' } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Falta email o password' });
    }

    email = String(email).trim().toLowerCase();
    name  = String(name || '').trim();

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }
    const weak = password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password);
    if (weak) {
      return res.status(422).json({
        message: 'La contraseña debe tener al menos 8 caracteres e incluir letras y números.',
      });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const token = issueToken(user);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: { id: user._id, name: user.name || '', email: user.email },
    });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }
    console.error('[users/register] error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

/* =========================
   POST /api/users/login
   ========================= */
router.post('/login', async (req, res) => {
  try {
    let { email, password = '' } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Falta email o password' });
    }
    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = issueToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name || '', email: user.email },
    });
  } catch (err) {
    console.error('[users/login] error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

/* =========================
   GET /api/users/profile  (protegido)
   ========================= */
router.get('/profile', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('_id name email createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json({
      id: user._id,
      name: user.name || '',
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error('[users/profile] error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

/* =========================
   POST /api/users/forgot-password
   ========================= */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Falta email' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Respuesta indistinta (no revelamos existencia)
    if (!user) {
      return res.json({ message: 'Si el email está registrado, te enviamos instrucciones.' });
    }

    // Generar token (hash guardado, raw enviado por email)
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await PasswordReset.create({ userId: user._id, tokenHash, expiresAt, used: false });

    const resetUrl = `${FRONTEND_URL}/reset-password/${rawToken}`;

    try {
      await sendResetEmail({
        toEmail: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (mailErr) {
      console.error('[forgot-password] sendResetEmail error:', mailErr?.message || mailErr);
      return res.status(500).json({ error: 'No pudimos enviar el email de recuperación' });
    }

    return res.json({ message: 'Si el email está registrado, te enviamos instrucciones.' });
  } catch (err) {
    console.error('[users/forgot-password] error:', err);
    return res.status(500).json({ error: 'No pudimos procesar la solicitud' });
  }
});

/* =========================
   POST /api/users/reset-password
   ========================= */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password = '' } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ error: 'Falta token o password' });
    }

    const weak = password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password);
    if (weak) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres e incluir letras y números.',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetDoc = await PasswordReset.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }

    const user = await User.findById(resetDoc.userId).select('+passwordHash');
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();

    resetDoc.used = true;
    await resetDoc.save();

    // Invalidar otros tokens vigentes
    await PasswordReset.updateMany(
      { userId: user._id, used: false, expiresAt: { $gt: new Date() } },
      { $set: { used: true } }
    );

    return res.json({ message: 'Contraseña actualizada correctamente. Ya podés iniciar sesión.' });
  } catch (err) {
    console.error('[users/reset-password] error:', err);
    return res.status(500).json({ error: 'No se pudo restablecer la contraseña' });
  }
});

/* Debug simple */
router.get('/test', (_req, res) => res.json({ ok: true, from: 'userRoutes' }));


/* =========================
   GET /api/users/reset-password/validate/:token
   ========================= */
router.get("/reset-password/validate/:token", async (req, res) => {
  try {
    const raw = req.params.token || "";
    if (!raw) return res.json({ ok: false });
    const tokenHash = (await import("crypto")).createHash("sha256").update(raw).digest("hex");
    const PasswordReset = (await import("../models/PasswordReset.js")).default;
    const doc = await PasswordReset.findOne({ tokenHash, used: false, expiresAt: { $gt: new Date() } }).lean();
    return res.json({ ok: !!doc });
  } catch {
    return res.json({ ok: false });
  }
});

export default router;