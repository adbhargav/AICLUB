import React, { useState, useEffect } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("https://aiclub-y4ox.onrender.com/api/gallery");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-blue-950 text-white min-h-screen px-4 py-16 font-sans">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-8 shadow-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-400 drop-shadow">
            Gallery
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-indigo-100 leading-relaxed font-medium">
            Explore the memorable moments from our AI Club events, workshops, and hackathons.
          </p>
        </div>
      </section>

      {/* Image Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {images.map((item, idx) => (
          <div
            key={item._id || idx}
            className="group cursor-pointer transform hover:scale-[1.04] transition-all duration-300 rounded-3xl overflow-hidden relative"
            onClick={() => setSelectedImage(item.imageURL)}
          >
            {/* Use aspect-square for perfect fit */}
            <div className="relative aspect-square w-full">
              <img
                src={item.imageURL}
                alt={item.title || `Gallery Image ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl border-2 border-indigo-800 group-hover:border-blue-400"
              />
            </div>
            {item.title && (
              <p className="text-center mt-3 text-indigo-100 text-base font-semibold">
                {item.title}
              </p>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-all duration-300 rounded-3xl"></div>
          </div>
        ))}
      </section>

      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl border-4 border-blue-400 object-contain"
          />
        </div>
      )}
    </div>
  );
}
