import React, { useState, useEffect } from "react";
import { Upload, Trash2, Edit2, X, Image as ImageIcon, CheckCircle, AlertCircle, FileText, Sparkles, Send } from "lucide-react";

export default function UploadGallery() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "https://aiclub-y4ox.onrender.com/api/gallery";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        setGallery([data.data || data, ...gallery]);
        setTitle("");
        setDescription("");
        setImageFile(null);
        setPreviewURL(null);
        setSuccess("Image uploaded successfully!");
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setUploading(false);
      setError("Network error. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this memory forever?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGallery(gallery.filter((img) => img._id !== id));
        setSuccess("Image deleted successfully.");
      } else {
        setError("Delete failed");
      }
    } catch (err) {
      setError("Error deleting image.");
    }
  };

  const startEdit = (img) => {
    setEditingId(img._id);
    setEditTitle(img.title || "");
    setEditDescription(img.description || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery(
          gallery.map((img) =>
            img._id === editingId ? { ...img, ...data.data } : img
          )
        );
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setSuccess("Updated successfully!");
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Error updating image details.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-purple-400" size={32} />
            Gallery Management
          </h2>
          <p className="text-gray-400 text-lg">Curate the club's visual journey and event memories.</p>
        </div>
      </div>

      {/* Upload/Edit Form */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          {/* Left Side: Inputs */}
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-1">
                {editingId ? "Edit Title" : "Image Title"}
              </label>
              <div className="relative group/input">
                <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Hackathon 2024 Winners"
                  value={editingId ? editTitle : title}
                  onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-1">Description</label>
              <textarea
                placeholder="Details or context for this image..."
                value={editingId ? editDescription : description}
                onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                rows="3"
              />
            </div>

            {!editingId && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-1">Select Media</label>
                <div className="relative group/file">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-gray-400 hover:text-white transition-all cursor-pointer group-hover:border-purple-500/30"
                  >
                    <Upload size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">{imageFile ? imageFile.name : "Choose an image file"}</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  editingId ? <Send size={18} /> : <Upload size={18} />
                )}
                {editingId ? "Save Changes" : "Upload Memory"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </form>

          {/* Right Side: Preview */}
          <div className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-[2rem] border border-white/5 min-h-[300px]">
            {previewURL || editingId ? (
              <div className="relative group/preview w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={previewURL || gallery.find(i => i._id === editingId)?.imageURL}
                  alt="Preview"
                  className="w-full h-full object-cover animate-in zoom-in-95 duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon size={48} className="text-white/50" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
                  <ImageIcon size={32} className="text-white/20" />
                </div>
                <p className="text-gray-500 font-medium">No image selected for preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h3 className="text-2xl font-bold text-white">Project Snapshots</h3>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-purple-400 uppercase tracking-widest">
            {gallery.length} Images
          </span>
        </div>

        {gallery.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-16 text-center text-gray-500">
            Gallery is empty. Upload your first club memory!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((img) => (
              <div key={img._id} className="group relative rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 active:scale-95">
                <img
                  src={img.imageURL}
                  alt={img.title || "Gallery"}
                  className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-bold text-lg leading-tight mb-1">{img.title || "Untitled"}</h4>
                    <p className="text-gray-300 text-xs line-clamp-2 mb-4">{img.description || "No description provided."}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(img)}
                        className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 backdrop-blur-md text-red-400 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Badge */}
                {!img.title && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    AI Memory
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
