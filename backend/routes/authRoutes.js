// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * Rutas de autenticación y perfil.
 * Se montan en /api (ver index.js):
 *   POST   /api/users/register
 *   POST   /api/users/login
 *   GET    /api/users/profile   (protegida)
 */
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', auth, getProfile);

export default router;