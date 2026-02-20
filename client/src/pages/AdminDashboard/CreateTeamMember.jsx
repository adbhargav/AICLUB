import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2, Edit2, X, User, Briefcase, GraduationCap, Phone, Camera, CheckCircle, AlertCircle, Plus, Sparkles, Send } from "lucide-react";

export default function CreateTeamMember() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    branch: "",
    year: "",
    contact: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/team");
        setMembers(res.data);
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("role", form.role);
      data.append("branch", form.branch);
      data.append("year", form.year);
      data.append("contact", form.contact);
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      if (editingId) {
        const res = await api.put(`/team/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers(members.map(m => m._id === editingId ? res.data : m));
        setSuccess("Team member updated successfully!");
        setEditingId(null);
      } else {
        const res = await api.post("/team", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers([res.data, ...members]);
        setSuccess("Team member created successfully!");
      }

      setForm({ name: "", role: "", branch: "", year: "", contact: "" });
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      setError(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      branch: member.branch || "",
      year: member.year || "",
      contact: member.contact || "",
    });
    setImagePreview(member.profileImageURL);
    setEditingId(member._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", role: "", branch: "", year: "", contact: "" });
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member from the team?")) return;

    try {
      await api.delete(`/team/${id}`);
      setMembers(members.filter(m => m._id !== id));
      setSuccess("Team member removed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team member");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={32} />
            {editingId ? "Edit Profile" : "Onboard Team"}
          </h2>
          <p className="text-gray-400 text-lg">Manage core members and leadership of the AI Club.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

        {/* Notifications */}
        <div className="space-y-4 mb-8">
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Avatar Side */}
          <div className="flex flex-col items-center justify-center space-y-6 lg:border-r border-white/10">
            <div className="relative group/avatar">
              <div className="w-40 h-40 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-cyan-400/50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-300" />
                ) : (
                  <User size={64} className="text-white/10" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={32} className="text-white/70" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 right-0 p-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-2xl shadow-xl shadow-cyan-500/20 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <Plus size={20} />
              </label>
            </div>
            <div className="text-center">
              <h4 className="text-white font-bold opacity-80 uppercase tracking-widest text-xs">Profile Image</h4>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG or WebP (Max 2MB)</p>
            </div>
          </div>

          {/* Details Side */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Full Name</label>
              <div className="relative group/input text-white">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-white">
              <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Designation</label>
              <div className="relative group/input">
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Technical Head"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-white">
                <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Branch</label>
                <div className="relative group/input">
                  <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    name="branch"
                    placeholder="CSE"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2 text-white">
                <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Year</label>
                <input
                  type="text"
                  name="year"
                  placeholder="3rd Year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 text-white">
              <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Contact Link/Social</label>
              <div className="relative group/input text-white">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  name="contact"
                  placeholder="LinkedIn or Portfolio URL"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                <Send size={18} />
                {editingId ? "Save Profile" : "Add to Team"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Team Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h3 className="text-2xl font-bold text-white">Club Roster</h3>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-widest">
            {members.length} Members
          </span>
        </div>

        {members.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-16 text-center text-gray-500">
            No team members added yet. Build your squad!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member._id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2rem] p-6 transition-all duration-500 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors"></div>

                <div className="flex gap-5 relative">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-cyan-500/30 transition-colors bg-white/5 shadow-2xl">
                      <img
                        src={member.profileImageURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name)}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{member.name}</h4>
                    <p className="text-cyan-500/80 text-xs font-bold uppercase tracking-wider">{member.role}</p>
                    <div className="space-y-0.5 pt-1">
                      {member.branch && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <GraduationCap size={12} className="text-gray-600" />
                          {member.branch} {member.year && `• ${member.year}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 bg-white/5 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="flex-1 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/5 hover:border-red-500/30 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
