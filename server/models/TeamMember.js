import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  branch: { type: String },
  year: { type: String },
  profileImageURL: { type: String },
  cloudinaryId: { type: String }, // Cloudinary public_id for deletion
  contact: { type: String }
}, { timestamps: true });

export default mongoose.model("TeamMember", teamSchema);
