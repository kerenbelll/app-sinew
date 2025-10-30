// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = decoded;
    req.userId = decoded?.id || decoded?.userId;
    if (!req.userId) return res.status(401).json({ message: 'Token inválido (sin userId)' });
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}