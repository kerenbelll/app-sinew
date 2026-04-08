import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const MaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["pdf", "doc", "other"],
      default: "pdf",
    },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    kind: {
      type: String,
      enum: ["course", "masterclass"],
      default: "course",
      required: true,
      index: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
      required: true,
      index: true,
    },
    short: { type: String, default: "", trim: true },
    long: { type: String, default: "", trim: true },
    price: { type: Number, default: 0, min: 0 },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },
    thumbnail: { type: String, default: "", trim: true },
    lessons: { type: [LessonSchema], default: [] },
    materials: { type: [MaterialSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);