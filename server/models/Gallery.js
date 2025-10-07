import mongoose from "mongoose";

const gallerySchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    imageURL: { type: String, required: true }, // Cloudinary URL
    cloudinaryId: { type: String }, // Cloudinary public_id for deletion
    type: { type: String, default: "image" },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
