// backend/models/RedNetworkLead.js
import mongoose from "mongoose";

const redNetworkLeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    church: { type: String, trim: true, default: "" },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    interests: { type: [String], default: [] },
  },
  { timestamps: true }
);

const RedNetworkLead = mongoose.model("RedNetworkLead", redNetworkLeadSchema);

export default RedNetworkLead;