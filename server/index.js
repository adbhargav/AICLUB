import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import { seedAdmin } from "./adminseed.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",           // Vite dev
      "http://localhost:5174",           // Vite dev
      "https://aiclub-rosy.vercel.app"  // Vercel frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser
app.use(express.json());

// Connect to MongoDB and seed admin
const initializeApp = async () => {
  try {
    await connectDB();
    await seedAdmin();
    console.log("MongoDB connected and admin seeded");
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};

initializeApp();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

// Default route
app.get("/", (req, res) => res.send("AI Club API is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
