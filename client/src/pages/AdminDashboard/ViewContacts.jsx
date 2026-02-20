import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Mail, Trash2, Send, User, Clock, MessageSquare, AlertCircle } from "lucide-react";

export default function ViewContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsAdmin(user?.role === "admin");

    const fetchContacts = async () => {
      try {
        const res = await api.get("/contact");
        setContacts(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(
          err.response?.status === 401 || err.response?.status === 403
            ? "Access denied. Admins only."
            : "Failed to load contact messages. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete contact message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Contact Messages</h2>
          <p className="text-gray-400 mt-1">Review and respond to inquiries from the community.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-400" />
          <span className="text-white font-bold">{contacts.length}</span>
          <span className="text-gray-500 text-sm italic">Messages</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-16 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-50">
            <Send size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl font-medium">No inquiries received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <User size={24} className="text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Mail size={14} className="text-cyan-500" />
                        {contact.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium bg-white/5 px-3 py-1.5 rounded-full">
                    <Clock size={12} />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 min-h-[100px]">
                  <p className="text-gray-300 leading-relaxed italic">
                    "{contact.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/20 rounded-xl transition-all duration-300 font-bold text-sm active:scale-95"
                  >
                    <Send size={16} />
                    Respond
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all duration-300 active:scale-90"
                      title="Delete Thread"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
