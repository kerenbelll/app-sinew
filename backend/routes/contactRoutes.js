// backend/routes/contactRoutes.js
import express from 'express';
import sendMessage from '../controllers/contactController.js';

const router = express.Router();

// Preflight (CORS manual si querés mantenerlo)
router.options('/send', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

router.post('/send', sendMessage);

export default router;