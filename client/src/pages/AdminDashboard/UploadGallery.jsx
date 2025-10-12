import React, { useState, useEffect } from "react";

export default function UploadGallery() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetch("https://aiclub-y4ox.onrender.com/api/gallery")
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Upload image
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image to upload.");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setUploading(true);
      const res = await fetch("https://aiclub-y4ox.onrender.com/api/gallery", {
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
        alert("✅ Image uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      setUploading(false);
      console.error("Upload failed:", error);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGallery(gallery.filter((img) => img._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Start editing image metadata
  const startEdit = (img) => {
    setEditingId(img._id);
    setEditTitle(img.title || "");
    setEditDescription(img.description || "");
  };

  // Update image metadata
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${editingId}`, {
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
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-blue-300 text-center">
        Upload Gallery Image
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto mb-10 bg-gray-800 p-6 rounded-xl border border-gray-700">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
          rows="2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="p-2 bg-gray-700 rounded-lg border border-gray-600 cursor-pointer"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 hover:bg-blue-600 transition py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {/* Gallery Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((img) => (
          <div key={img._id} className="relative group rounded-lg overflow-hidden border-2 border-blue-400 p-2">
            <img
              src={img.imageURL}
              alt={img.title || "Gallery"}
              className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300"
            />
            {editingId === img._id ? (
              <form onSubmit={handleUpdate} className="bg-gray-900 bg-opacity-80 absolute inset-0 flex flex-col justify-center items-center p-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mb-2 p-2 rounded bg-gray-800 text-white border"
                  placeholder="Edit title"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mb-2 p-2 rounded bg-gray-800 text-white border"
                  placeholder="Edit description"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Save</button>
                  <button type="button" className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                {img.title && (
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-center py-1 text-sm">
                    {img.title}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => startEdit(img)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(img._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
