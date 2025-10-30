// backend/models/PasswordReset.js
import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  // Guardamos el TOKEN **hasheado** por seguridad
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  used: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default mongoose.model('PasswordReset', PasswordResetSchema);