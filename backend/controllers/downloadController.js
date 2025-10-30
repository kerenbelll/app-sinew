// backend/controllers/downloadController.js
import path from 'path';
import { fileURLToPath } from 'url';
import DownloadToken from '../models/DownloadToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadBook = async (req, res) => {
  const { token } = req.params;
  const tokenDoc = await DownloadToken.findOne({ token });

  if (!tokenDoc) return res.status(404).json({ message: 'Link inválido' });
  if (tokenDoc.used) return res.status(403).json({ message: 'Link ya usado' });
  if (tokenDoc.expiresAt < new Date()) return res.status(403).json({ message: 'Link expirado' });

  tokenDoc.used = true;
  await tokenDoc.save();

  // 👇 corregido para coincidir con el resto del backend
  const filePath = path.resolve(__dirname, '../protected-pdfs/libro.pdf');
  res.download(filePath, 'libro.pdf', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al descargar el archivo');
    }
  });
};