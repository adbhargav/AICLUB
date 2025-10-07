import express from "express";
import TeamMember from "../models/TeamMember.js";
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

// Add team member
router.post("/", protect, admin, upload.single("profileImage"), async (req, res) => {
  const { name, role, branch, year, contact } = req.body;
  try {
    if (req.file) {
      // Upload to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/team",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
          }
          
          try {
            const member = await TeamMember.create({ 
              name, 
              role, 
              branch, 
              year, 
              contact, 
              profileImageURL: result.secure_url,
              cloudinaryId: result.public_id
            });
            res.status(201).json(member);
          } catch (dbError) {
            console.error("Database error:", dbError);
            await cloudinary.uploader.destroy(result.public_id);
            res.status(500).json({ message: "Failed to save team member data" });
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const member = await TeamMember.create({ name, role, branch, year, contact });
      res.status(201).json(member);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all team members
router.get("/", async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update team member
router.put("/:id", protect, admin, upload.single("profileImage"), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const { name, role, branch, year, contact } = req.body;

    member.name = name || member.name;
    member.role = role || member.role;
    member.branch = branch || member.branch;
    member.year = year || member.year;
    member.contact = contact || member.contact;

    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (member.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(member.cloudinaryId);
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion error:", cloudinaryError);
        }
      }
      
      // Upload new image to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/team",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
          }
          
          member.profileImageURL = result.secure_url;
          member.cloudinaryId = result.public_id;
          await member.save();
          res.json(member);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await member.save();
      res.json(member);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete team member
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Delete from Cloudinary if cloudinaryId exists
    if (member.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(member.cloudinaryId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
