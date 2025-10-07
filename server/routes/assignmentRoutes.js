import express from "express";
import Assignment from "../models/Assignment.js";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Give assignment
router.post("/", protect, admin, upload.single("file"), async (req, res) => {
  const { title, description, dueDate, link } = req.body;
  try {
    if (req.file) {
      // Upload to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/assignments",
          resource_type: "auto", // Supports PDFs, docs, images, etc.
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload file" });
          }
          
          try {
            const assignment = await Assignment.create({ 
              title, 
              description, 
              dueDate, 
              fileURL: result.secure_url,
              cloudinaryId: result.public_id,
              link 
            });
            return res.status(201).json(assignment);
          } catch (dbError) {
            console.error("Database error:", dbError);
            await cloudinary.uploader.destroy(result.public_id);
            return res.status(500).json({ message: "Failed to create assignment" });
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const assignment = await Assignment.create({ title, description, dueDate, link });
      res.status(201).json(assignment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update assignment
router.put("/:id", protect, admin, upload.single("file"), async (req, res) => {
  const { title, description, dueDate, link } = req.body;
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.link = link || assignment.link;

    if (req.file) {
      // Delete old file from Cloudinary if exists
      if (assignment.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(assignment.cloudinaryId, { resource_type: "raw" });
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion error:", cloudinaryError);
        }
      }
      
      // Upload new file to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/assignments",
          resource_type: "auto",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload file" });
          }
          
          assignment.fileURL = result.secure_url;
          assignment.cloudinaryId = result.public_id;
          await assignment.save();
          res.json(assignment);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await assignment.save();
      res.json(assignment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete assignment
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Delete from Cloudinary if cloudinaryId exists
    if (assignment.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(assignment.cloudinaryId, { resource_type: "raw" });
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
