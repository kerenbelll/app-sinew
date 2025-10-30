// models/DownloadToken.js (ESM)
import mongoose from 'mongoose';

const DownloadTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, unique: true, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

const DownloadToken = mongoose.model('DownloadToken', DownloadTokenSchema);
export default DownloadToken;
