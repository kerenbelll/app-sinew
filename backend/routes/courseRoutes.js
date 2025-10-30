// backend/routes/courseRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js";
import CourseAccess from "../models/CourseAccess.js";
import User from "../models/User.js";
import { sendCourseAccessEmail } from "../utils/mailer.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

/** Auth mínimo (opcional para endpoints protegidos) */
function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token && JWT_SECRET) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded?.id || decoded?.userId || null;
    }
  } catch {
    /* anónimo */
  }
  next();
}

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded?.id || decoded?.userId;
    if (!req.userId) return res.status(401).json({ error: "UNAUTHORIZED" });
    next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

/** GET /api/courses -> listado (público) */
router.get("/", async (_req, res) => {
  const list = await Course.find({})
    .select("slug title level short price currency thumbnail")
    .sort({ title: 1 });
  res.json(list);
});

/** GET /api/courses/:slug -> detalle (público, sin lessons para PRO) */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const isFree = String(course.level).toLowerCase() === "free";
  if (isFree) {
    return res.json(course);
  }
  // PRO: ocultar lessons
  const { lessons, ...rest } = course.toObject();
  return res.json(rest);
});

/** GET /api/courses/:slug/lessons -> requiere free o acceso concedido */
router.get("/:slug/lessons", authOptional, async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const isFree = String(course.level).toLowerCase() === "free";
  if (isFree) {
    return res.json(course.lessons || []);
  }

  // PRO: necesita user + acceso
  if (!req.userId) return res.status(401).json({ error: "LOGIN_REQUIRED" });

  const access = await CourseAccess.findOne({ userId: req.userId, courseSlug: slug });
  if (!access) return res.status(402).json({ error: "PAYMENT_REQUIRED" });

  return res.json(course.lessons || []);
});

/** POST /api/courses/:slug/buy-simulated -> concede acceso (testing sin pago real) */
router.post("/:slug/buy-simulated", authRequired, async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  try {
    await CourseAccess.create({
      userId: req.userId,
      courseSlug: slug,
      via: "manual",
    });
  } catch {
    // si ya existe, seguimos como OK
  }

  // enviar email con acceso simulado
  try {
    const user = await User.findById(req.userId).lean();
    if (user?.email) {
      const courseUrl = `${FRONTEND_URL}/cursos/${slug}?paid=1`;
      await sendCourseAccessEmail({
        toEmail: user.email,
        buyerName: user.name || "¡Hola!",
        courseTitle: course.title || "Curso SINEW",
        courseUrl,
      });
    }
  } catch (e) {
    console.error("[buy-simulated] email curso error:", e?.message || e);
  }

  res.json({ ok: true, granted: true, course: slug });
});

export default router;