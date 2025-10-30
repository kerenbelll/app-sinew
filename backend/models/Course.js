// backend/models/Course.js
import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },
    title: { type: String, required: true },
    level: { type: String, enum: ["free", "pro"], default: "free" },
    short: { type: String },
    long: { type: String },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    thumbnail: { type: String },
    lessons: [LessonSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);