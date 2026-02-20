import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2, Edit2, X, Bell, AlignLeft, Calendar, Link as LinkIcon, CheckCircle, AlertCircle, Send, Sparkles } from "lucide-react";

export default function IssueNotices() {
  const [notice, setNotice] = useState({ title: "", description: "", date: "", link: "" });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notice.title.trim()) {
      setError("Please enter notice title");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const res = await api.put(`/notices/${editingId}`, notice);
        setNotices(notices.map(n => n._id === editingId ? res.data : n));
        setSuccess("Notice updated successfully!");
        setEditingId(null);
      } else {
        const res = await api.post("/notices", notice);
        setNotices([res.data, ...notices]);
        setSuccess("Notice created successfully!");
      }
      setNotice({ title: "", description: "", date: "", link: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save notice");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (noticeToEdit) => {
    setNotice({
      title: noticeToEdit.title,
      description: noticeToEdit.description || "",
      date: noticeToEdit.date ? new Date(noticeToEdit.date).toISOString().slice(0, 16) : "",
      link: noticeToEdit.link || ""
    });
    setEditingId(noticeToEdit._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNotice({ title: "", description: "", date: "", link: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter(n => n._id !== id));
      setSuccess("Notice deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-400" size={32} />
            {editingId ? "Update Notice" : "Issue New Notice"}
          </h2>
          <p className="text-gray-400 text-lg">Send important updates and announcements to the club.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-amber-400 ml-1">Subject</label>
            <div className="relative group/input">
              <Bell size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-amber-400 transition-colors" />
              <input
                type="text"
                placeholder="Important: Upcoming Deadline"
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2 border-white">
            <label className="text-xs font-bold uppercase tracking-widest text-amber-400 ml-1">Optional Date</label>
            <div className="relative group/input text-white">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-amber-400 transition-colors" />
              <input
                type="datetime-local"
                value={notice.date}
                onChange={(e) => setNotice({ ...notice, date: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 text-white">
            <label className="text-xs font-bold uppercase tracking-widest text-amber-400 ml-1">External Link</label>
            <div className="relative group/input">
              <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-amber-400 transition-colors" />
              <input
                type="url"
                placeholder="https://..."
                value={notice.link}
                onChange={(e) => setNotice({ ...notice, link: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 text-white">
            <label className="text-xs font-bold uppercase tracking-widest text-amber-400 ml-1">Notice Content</label>
            <div className="relative group/input text-white">
              <AlignLeft size={18} className="absolute left-4 top-5 text-gray-500 group-focus-within/input:text-amber-400 transition-colors" />
              <textarea
                placeholder="Details of the announcement..."
                value={notice.description}
                onChange={(e) => setNotice({ ...notice, description: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium"
                rows="4"
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-2xl font-bold shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
              <Send size={18} />
              {editingId ? "Update Notice" : "Broadcast Notice"}
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
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h3 className="text-2xl font-bold text-white">Published Notices</h3>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest">
            {notices.length} Total
          </span>
        </div>

        {notices.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-16 text-center text-gray-500">
            No notices published yet. Broadcoast one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((n) => (
              <div key={n._id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{n.title}</h4>
                      {n.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium font-mono">
                          <Calendar size={14} className="text-amber-500/60" />
                          {new Date(n.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white rounded-xl transition-all"
                        title="View Link"
                      >
                        <LinkIcon size={18} />
                      </a>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[3rem]">
                    {n.description || "No description provided."}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEdit(n)}
                    className="flex-1 bg-white/5 hover:bg-amber-500/10 text-gray-400 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="flex-1 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/30 p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
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
