import express from "express";
import Project from "../models/Project.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Submit a new project (Student)
 * @access  Private (Student)
 */
router.post("/", protect, async (req, res) => {
  const { title, description, githubLink } = req.body;

  if (!title || !githubLink) {
    return res.status(400).json({ message: "Title and GitHub link are required." });
  }

  try {
    const project = await Project.create({
      student: req.user._id,
      title,
      description,
      githubLink,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Error submitting project:", err);
    res.status(500).json({ message: "Failed to submit project." });
  }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects (Public view)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("student", "name email registerNumber branch year")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
});

/**
 * @route   GET /api/projects/admin
 * @desc    Get all projects (Admin view with all details)
 * @access  Private/Admin
 */
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("student", "name email registerNumber branch year")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching admin projects:", err);
    res.status(500).json({ message: "Failed to fetch admin projects." });
  }
});

/**
 * @route   GET /api/projects/my-projects
 * @desc    Get logged-in student's own projects
 * @access  Private (Student)
 */
router.get("/my-projects", protect, async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching student projects:", err);
    res.status(500).json({ message: "Failed to fetch your projects." });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project (Admin only)
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, async (req, res) => {
  const { title, description, githubLink } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.title = title || project.title;
    project.description = description || project.description;
    project.githubLink = githubLink || project.githubLink;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Failed to update project." });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project (Admin only)
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project." });
  }
});

export default router;
