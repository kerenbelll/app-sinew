// backend/routes/downloadRoutes.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import DownloadToken from "../models/DownloadToken.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const FILE_PATH  = path.join(__dirname, "..", "protected-pdfs", "libro.pdf");

/** Valida token: devuelve el record o null si inválido/expirado/ya usado */
async function validateToken(token) {
  if (!token) return null;
  const record = await DownloadToken.findOne({ token });
  if (!record) return null;
  if (record.used) return null;
  if (record.expiresAt < new Date()) return null;
  return record;
}

/** HEAD: no consume el token, solo devuelve headers */
router.head("/:token", async (req, res) => {
  try {
    const record = await validateToken(req.params.token);
    if (!record) return res.status(401).json({ error: "Link inválido o expirado" });

    const stat = await fs.stat(FILE_PATH);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="libro.pdf"');
    res.setHeader("Content-Length", stat.size);
    return res.status(200).end();
  } catch (err) {
    console.error("[Download][HEAD] error:", err);
    return res.status(500).end();
  }
});

/** GET: consume el token y descarga el PDF */
router.get("/:token", async (req, res) => {
  try {
    const record = await validateToken(req.params.token);
    if (!record) return res.status(401).json({ error: "Link inválido o expirado" });

    record.used = true;
    await record.save();

    return res.download(FILE_PATH, "libro.pdf");
  } catch (err) {
    console.error("[Download][GET] error:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;