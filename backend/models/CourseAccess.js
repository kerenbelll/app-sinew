import mongoose from "mongoose";

const CourseAccessSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseSlug: { type: String, required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    grantedBy: {
      type: String,
      enum: ["purchase", "manual", "simulated", "admin", "gift", "mercadopago", "paypal"],
      default: "purchase",
    },
    provider: { type: String },
    grantedAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  {
    collection: "course_access",
    timestamps: true,
  }
);

CourseAccessSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

export default mongoose.models.CourseAccess || mongoose.model("CourseAccess", CourseAccessSchema);