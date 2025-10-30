// backend/models/DownloadToken.js
import mongoose from "mongoose";

const DownloadTokenSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    token:     { type: String, unique: true, required: true },
    expiresAt: { type: Date, required: true, index: true },
    used:      { type: Boolean, default: false, index: true },
  },
  {
    collection: "downloadtokens",
    timestamps: true,
  }
);

// (Opcional) TTL automático si querés purgar expirados desde Mongo
// OJO: solo funciona si la colección se crea con este índice y el daemon TTL está activo.
// DownloadTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("DownloadToken", DownloadTokenSchema);