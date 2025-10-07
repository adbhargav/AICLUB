import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

// Sign Up
router.post("/signup", upload.single("profileImage"), async (req, res) => {
  const { name, registerNumber, branch, year, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (req.file) {
      // Upload to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rgm-ai-club/users",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload profile image" });
          }
          
          try {
            const user = await User.create({
              name,
              registerNumber,
              branch,
              year,
              email,
              password: hashedPassword,
              profileImageURL: result.secure_url,
              cloudinaryId: result.public_id,
            });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret_key_for_development", { expiresIn: "7d" });
            return res.status(201).json({ token, user });
          } catch (dbError) {
            console.error("Database error:", dbError);
            await cloudinary.uploader.destroy(result.public_id);
            return res.status(500).json({ message: "Failed to create user" });
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const user = await User.create({
        name,
        registerNumber,
        branch,
        year,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret_key_for_development", { expiresIn: "7d" });
      res.status(201).json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret_key_for_development", { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Users (Admin only)
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User (Admin only)
router.put("/users/:id", protect, admin, async (req, res) => {
  const { name, email, branch, year, registerNumber, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.branch = branch || user.branch;
    user.year = year || user.year;
    user.registerNumber = registerNumber || user.registerNumber;
    user.role = role || user.role;

    await user.save();
    const updatedUser = await User.findById(req.params.id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User (Admin only)
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
