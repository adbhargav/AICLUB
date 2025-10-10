import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2 } from "lucide-react";

export default function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setSuccess("Project deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">View Projects</h2>
        <p className="text-gray-400 text-center">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-300">Student Projects</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-300 rounded-lg">
          {success}
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center">No projects submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-gray-300 text-sm mb-2">
                      {project.description}
                    </p>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Submitted by: {project.student?.name || "Unknown"}</p>
                    <p>Email: {project.student?.email || "N/A"}</p>
                    <p>
                      Submitted:{" "}
                      {new Date(project.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-center transition"
                  >
                    View on GitHub
                  </a>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} /> Delete Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
