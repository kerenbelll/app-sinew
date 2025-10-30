// backend/routes/bookRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Book from '../models/Book.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Listar libros
router.get('/', async (_req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener libros' });
  }
});

// Generar token de descarga (10m)
router.post('/generate-token', (req, res) => {
  const { bookId, userId } = req.body;
  if (!bookId || !userId) return res.status(400).json({ message: 'Falta bookId o userId' });

  const token = jwt.sign({ bookId, userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
  res.json({ token });
});

// Descargar libro protegido local (si usás archivos locales)
router.get('/download/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const book = await Book.findById(decoded.bookId);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });

    // Ajustá si querés servir un archivo distinto por libro
    const pdfPath = path.join(__dirname, '..', 'protected-pdfs', 'libro.pdf');
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error al enviar PDF:', err);
        res.status(500).json({ message: 'Error al enviar PDF' });
      }
    });
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
});

export default router;