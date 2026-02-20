import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2, Github, User, Mail, Calendar, ExternalLink, AlertCircle, CheckCircle, FolderKanban, Sparkles } from "lucide-react";

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
    if (!window.confirm("Are you sure you want to delete this project submission?")) return;

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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Scanning repositories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderKanban className="text-indigo-400" size={32} />
            Student Projects
          </h2>
          <p className="text-gray-400 text-lg">Review and manage technical submissions from club members.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 self-start">
          <Sparkles size={18} className="text-indigo-400" />
          <span className="text-white font-bold">{projects.length}</span>
          <span className="text-gray-500 text-sm font-medium">Submissions</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4 px-2">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <CheckCircle size={20} />
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[2.5rem] p-24 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FolderKanban size={32} className="text-white/20" />
          </div>
          <p className="text-gray-500 text-xl font-medium">No project submissions yet.</p>
          <p className="text-gray-600 mt-2">Projects will appear here once students submit them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors"></div>

              <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Project Info */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        Technical Build
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm lg:text-base max-w-3xl">
                      {project.description || "No project description provided."}
                    </p>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <User size={18} className="text-gray-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Student Name</p>
                        <p className="text-white font-bold truncate">{project.student?.name || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-gray-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</p>
                        <p className="text-white font-bold truncate text-sm">{project.student?.email || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Calendar size={18} className="text-gray-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Submission Date</p>
                        <p className="text-white font-bold truncate">
                          {new Date(project.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-3 shrink-0 lg:w-56">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                  >
                    <Github size={18} />
                    <span>Open Code</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/30 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    <Trash2 size={18} />
                    <span>Archive</span>
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
