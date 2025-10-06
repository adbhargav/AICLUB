import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function ViewContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/contact");
        setContacts(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Failed to load contact messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">View Contacts</h2>
        <p className="text-gray-400 text-center">Loading contact messages...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-300">Contact Messages</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {contacts.length === 0 ? (
        <p className="text-gray-500 text-center">No contact messages received yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-blue-400">{contact.name}</h3>
                    <span className="text-sm text-gray-500">({contact.email})</span>
                  </div>
                  <p className="text-gray-300 mb-3">{contact.message}</p>
                  <div className="text-sm text-gray-500">
                    <p>Received: {new Date(contact.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-center transition"
                  >
                    Reply via Email
                  </a>
                  <span className="text-xs text-gray-400 text-center">
                    Click to open email client
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
