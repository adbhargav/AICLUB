import express from "express";
import Event from "../models/Event.js";
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

// Create event
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  const { title, description, date, location } = req.body;
  try {
    if (req.file) {
      // Upload to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/events",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
          }
          
          try {
            const event = await Event.create({ 
              title, 
              description, 
              date, 
              location, 
              imageURL: result.secure_url,
              cloudinaryId: result.public_id
            });
            res.status(201).json(event);
          } catch (dbError) {
            console.error("Database error:", dbError);
            await cloudinary.uploader.destroy(result.public_id);
            res.status(500).json({ message: "Failed to save event data" });
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const event = await Event.create({ title, description, date, location });
      res.status(201).json(event);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update event
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  const { title, description, date, location } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (event.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(event.cloudinaryId);
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion error:", cloudinaryError);
        }
      }
      
      // Upload new image to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/events",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
          }
          
          event.imageURL = result.secure_url;
          event.cloudinaryId = result.public_id;
          await event.save();
          res.json(event);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await event.save();
      res.json(event);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete event
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Delete from Cloudinary if cloudinaryId exists
    if (event.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(event.cloudinaryId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
