import express from "express";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js";
import CourseAccess from "../models/CourseAccess.js";
import User from "../models/User.js";
import { sendCourseAccessEmail } from "../utils/mailer.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (token && JWT_SECRET) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded?.id || decoded?.userId || null;
    } else {
      req.userId = null;
    }
  } catch {
    req.userId = null;
  }

  next();
}

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded?.id || decoded?.userId || null;

    if (!req.userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

router.get("/", async (_req, res) => {
  try {
    const list = await Course.find({})
      .select("slug kind isArchive title level short price currency thumbnail")
      .sort({ kind: 1, isArchive: 1, title: 1 })
      .lean();

    res.json(list);
  } catch (error) {
    console.error("[courses:list]", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).lean();

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const isFree = String(course.level).toLowerCase() === "free";

    if (isFree) {
      return res.json(course);
    }

    const { lessons, materials, ...rest } = course;
    return res.json(rest);
  } catch (error) {
    console.error("[courses:detail]", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.get("/:slug/lessons", authOptional, async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).lean();

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const isFree = String(course.level).toLowerCase() === "free";

    if (isFree) {
      return res.json(course.lessons || []);
    }

    if (!req.userId) {
      return res.status(401).json({ error: "LOGIN_REQUIRED" });
    }

    const access = await CourseAccess.findOne({
      userId: req.userId,
      courseSlug: slug,
    }).lean();

    if (!access) {
      return res.status(402).json({ error: "PAYMENT_REQUIRED" });
    }

    return res.json(course.lessons || []);
  } catch (error) {
    console.error("[courses:lessons]", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.get("/:slug/materials", authOptional, async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).lean();

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const isFree = String(course.level).toLowerCase() === "free";

    if (isFree) {
      return res.json(course.materials || []);
    }

    if (!req.userId) {
      return res.status(401).json({ error: "LOGIN_REQUIRED" });
    }

    const access = await CourseAccess.findOne({
      userId: req.userId,
      courseSlug: slug,
    }).lean();

    if (!access) {
      return res.status(402).json({ error: "PAYMENT_REQUIRED" });
    }

    return res.json(course.materials || []);
  } catch (error) {
    console.error("[courses:materials]", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.post("/:slug/buy-simulated", authRequired, async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).lean();

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const isFree = String(course.level).toLowerCase() === "free";
    if (isFree) {
      return res.status(400).json({ error: "RESOURCE_IS_FREE" });
    }

    try {
      await CourseAccess.create({
        userId: req.userId,
        courseSlug: slug,
        courseId: course._id,
        grantedBy: "simulated",
        provider: "simulated",
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
    }

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
      console.error("[courses:buy-simulated][email]", e?.message || e);
    }

    res.json({ ok: true, granted: true, course: slug });
  } catch (error) {
    console.error("[courses:buy-simulated]", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

export default router;