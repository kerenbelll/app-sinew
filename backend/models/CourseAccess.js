// backend/models/CourseAccess.js
import mongoose from "mongoose";

const CourseAccessSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseSlug: { type: String, required: true, index: true },
    courseId:   { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    // NUEVO: para registrar quién otorgó y por qué medio
    grantedBy: {
      type: String,
      enum: ["purchase", "manual", "simulated", "admin", "gift", "mercadopago", "paypal"],
      default: "purchase",
    },
    provider:   { type: String },         // ej: "mercadopago" | "paypal"
    grantedAt:  { type: Date },           // fecha explícita del otorgamiento

    notes:      { type: String },
  },
  {
    collection: "course_access",
    timestamps: true, // createdAt / updatedAt
  }
);

// Único por usuario/curso
CourseAccessSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

export default mongoose.model("CourseAccess", CourseAccessSchema);