import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (!token || String(scheme).toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded?.id || decoded?.userId;
    if (!req.userId) return res.status(401).json({ message: 'Token inválido (sin userId)' });
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}