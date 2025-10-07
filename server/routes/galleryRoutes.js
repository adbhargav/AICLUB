import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create (Upload) Image to Cloudinary
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    console.log("Uploading image to Cloudinary...");
    
    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "rgm-ai-club/gallery",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ 
            message: "Failed to upload image to Cloudinary",
            error: error.message 
          });
        }
        
        console.log("Cloudinary upload successful:", result.public_id);
        
        try {
          const newImage = await Gallery.create({
            title: req.body.title || "",
            description: req.body.description || "",
            imageURL: result.secure_url,
            cloudinaryId: result.public_id,
          });
          
          console.log("Image saved to database:", newImage._id);
          return res.status(201).json({ success: true, data: newImage });
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Delete uploaded image from Cloudinary if DB save fails
          try {
            await cloudinary.uploader.destroy(result.public_id);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
          return res.status(500).json({ 
            message: "Failed to save image data",
            error: dbError.message 
          });
        }
      }
    );
    
    // Handle stream errors
    uploadStream.on('error', (streamError) => {
      console.error("Stream error:", streamError);
      if (!res.headersSent) {
        return res.status(500).json({ 
          message: "Stream error during upload",
          error: streamError.message 
        });
      }
    });
    
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Server error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ 
        message: "Server error",
        error: err.message 
      });
    }
  }
});

// Get All Images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Image Metadata (title, description)
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Image not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    
    // Delete from Cloudinary if cloudinaryId exists
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        // Continue with DB deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;