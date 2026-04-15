// backend/index.js
import 'dotenv/config'; // 👈 primero
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

/* ───────── Config básica ───────── */
const PORT = Number(process.env.PORT || 5001);
const NODE_ENV = (process.env.NODE_ENV || 'production').toLowerCase();

/* ───────── CORS ───────── */
const defaultOrigins = [
  'https://sineworg.com',
  'https://www.sineworg.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = CORS_ORIGINS.length ? CORS_ORIGINS : defaultOrigins;

const corsOptions = {
  origin(origin, callback) {
    // Permite herramientas sin Origin (curl/Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Responde sin CORS para orígenes no permitidos (el navegador bloqueará)
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* ───────── Mongo ───────── */
const MONGO_URI = process.env.MONGO_URI || '';
const ALLOW_NO_DB = String(process.env.ALLOW_NO_DB || 'false').toLowerCase() === 'true';

/* ───────── Middlewares ───────── */
app.set('trust proxy', 1);
app.use(express.json());

/* ───────── Salud ───────── */
app.get('/health', (_req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    ok: true,
    env: NODE_ENV,
    dbState: state,
    db: state === 1 ? 'connected' : state === 2 ? 'connecting' : 'not_connected',
  });
});

/* ───────── Rutas ───────── */
import authRoutes from './routes/authRoutes.js';           // ✅ router de auth
import bookRoutes from './routes/bookRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import paypalRoutes from './routes/paypalRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mercadoPagoRoutes from './routes/mercadoPagoRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import redNetworkRoutes from "./routes/redNetworkRoutes.js";

app.use("/api/red-network", redNetworkRoutes);

// Montaje seguro
function safeUse(prefix, router, label) {
  try {
    app.use(prefix, router);
    console.log(`✅ Mounted ${label} -> ${prefix}`);
  } catch (e) {
    console.error(`❌ No se pudo montar ${label} en ${prefix}:`, e?.message || e);
  }
}

/**
 * IMPORTANTE:
 * - authRoutes se monta en '/api' y dentro define '/users/register', '/users/login', '/users/profile'
 * - userRoutes NO debe volver a definir register/login/profile (solo endpoints de usuario extra, ej: /users/me/courses)
 */
safeUse('/api',          authRoutes,         'authRoutes');      // ✅
safeUse('/api/book',     bookRoutes,         'bookRoutes');
safeUse('/api/contact',  contactRoutes,      'contactRoutes');
safeUse('/api/download', downloadRoutes,     'downloadRoutes');
safeUse('/api/users',    userRoutes,         'userRoutes');      // ⚠️ sin register/login/profile aquí
safeUse('/api/paypal',   paypalRoutes,       'paypalRoutes');
safeUse('/api/purchase', purchaseRoutes,     'purchaseRoutes');
safeUse('/api/mp',       mercadoPagoRoutes,  'mercadoPagoRoutes');
safeUse('/api/courses',  courseRoutes,       'courseRoutes');

/* ───────── Debug de rutas ───────── */
function flattenRoutes(stack, base = '') {
  const out = [];
  for (const layer of stack) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods || {}).map(m => m.toUpperCase());
      out.push({ base: base || '/', path: layer.route.path, methods });
      continue;
    }
    if (layer.name === 'router' && layer.handle?.stack) {
      let nextBase = base;
      if (layer.regexp) {
        const src = layer.regexp.toString();
        nextBase = src
          .replace(/^\/\^\^?\\\//, '/')
          .replace(/^\/\^\\\//, '/')
          .replace(/\\\/\?\(\?\=\\\/\|\$\)\/i$/, '')
          .replace(/\\\/\(\?:\(\?\=\\\/\|\$\)\)\?\/i$/, '')
          .replace(/\\\//g, '/')
          .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/g, ':param')
          .replace(/\(\?:\[\^\\\/]\+\?\)/g, ':param')
          .replace(/\/\?\(\?\=\\\/\|\$\)\//, '/')
          .replace(/\/i$/, '')
          .replace(/\$$/, '');
        if (!nextBase.startsWith('/')) nextBase = base || '/';
      }
      out.push(...flattenRoutes(layer.handle.stack, nextBase));
    }
  }
  return out;
}

app.get('/__routes', (_req, res) => {
  try {
    const routes = flattenRoutes(app._router?.stack || []);
    res.json(routes);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

/* ───────── Arranque ───────── */
function startServer(label = '') {
  app.listen(PORT, () => {
    console.log(`${label}Servidor corriendo en http://localhost:${PORT}`);
  });
}

console.log('[BOOT] index.js');
console.log('[BOOT] NODE_ENV =', NODE_ENV);
console.log('[BOOT] PORT     =', PORT);
console.log('[BOOT] CORS origins =', ALLOWED_ORIGINS.join(', ') || '(none)');
console.log('[BOOT] MONGO_URI set =', MONGO_URI ? 'YES' : 'NO');

if (!MONGO_URI) {
  if (!ALLOW_NO_DB && NODE_ENV !== 'development') {
    console.error('❌ MONGO_URI no configurado. Aborto en producción.');
    process.exit(1);
  }
  console.warn('⚠️ MONGO_URI no configurado. Levantando sin DB (solo dev).');
  startServer('');
} else {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => { console.log('✅ MongoDB conectado'); startServer(''); })
    .catch((err) => {
      console.error('❌ Error al conectar a MongoDB:', err?.message || err);
      if (!ALLOW_NO_DB && NODE_ENV !== 'development') {
        console.error('Abortando porque ALLOW_NO_DB es false.');
        process.exit(1);
      }
      console.warn('⚠️ Levantando server sin DB (endpoints con Mongo pueden fallar).');
      startServer('');
    });

  mongoose.connection.on('error', (e) => console.error('Mongo error:', e?.message || e));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
}

export default app;