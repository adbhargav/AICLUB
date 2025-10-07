import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNumber: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  profileImageURL: { type: String },
  cloudinaryId: { type: String }, // Cloudinary public_id for deletion
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student","admin"], default: "student" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
