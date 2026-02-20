import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2, Edit2, X, Plus, Calendar, MapPin, AlignLeft, CheckCircle, AlertCircle, Sparkles, Clock } from "lucide-react";

export default function CreateEvent() {
  const [event, setEvent] = useState({
    title: "",
    date: "",
    description: "",
    location: ""
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.title.trim() || !event.date) {
      setError("Please enter event title and date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const res = await api.put(`/events/${editingId}`, event);
        setEvents(events.map(ev => ev._id === editingId ? res.data : ev));
        setSuccess("Event updated successfully!");
        setEditingId(null);
      } else {
        const res = await api.post("/events", event);
        setEvents([res.data, ...events]);
        setSuccess("Event created successfully!");
      }
      setEvent({ title: "", date: "", description: "", location: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventToEdit) => {
    setEvent({
      title: eventToEdit.title,
      date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : "",
      description: eventToEdit.description || "",
      location: eventToEdit.location || ""
    });
    setEditingId(eventToEdit._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEvent({ title: "", date: "", description: "", location: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      setSuccess("Event deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={32} />
            {editingId ? "Modify Event" : "Create New Event"}
          </h2>
          <p className="text-gray-400 text-lg">Schedule and organize club gatherings and workshops.</p>
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Title</label>
            <div className="relative group/input">
              <Plus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Give it a catchy name"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Date & Time</label>
            <div className="relative group/input">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
              <input
                type="datetime-local"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 text-white">
            <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Location</label>
            <div className="relative group/input">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Venue or Link (e.g. Lab 402 or Zoom Link)"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 text-white">
            <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 ml-1">Description</label>
            <div className="relative group/input text-white">
              <AlignLeft size={18} className="absolute left-4 top-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
              <textarea
                placeholder="What is this event about?"
                value={event.description}
                onChange={(e) => setEvent({ ...event, description: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium"
                rows="4"
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
              {editingId ? "Update Event" : "Publish Event"}
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
          <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-blue-400 uppercase tracking-widest">
            {events.length} Live
          </span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-16 text-center text-gray-500">
            No events scheduled yet. Start by creating one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
              <div key={e._id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{e.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Calendar size={14} className="text-cyan-500/60" />
                      {new Date(e.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                      <Clock size={14} className="ml-1 text-cyan-500/60" />
                      {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {e.location && (
                    <div className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-xl self-start">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="text-xs text-gray-400 font-bold truncate">{e.location}</span>
                    </div>
                  )}

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                    {e.description || "No description provided."}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEdit(e)}
                    className="flex-1 bg-white/5 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="flex-1 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/30 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
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
