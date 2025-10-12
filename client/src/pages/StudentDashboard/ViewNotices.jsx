import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center">Loading notices...</p>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-blue-300">Latest Notices</h2>

      {notices.length === 0 ? (
        <p className="text-gray-500 text-center">No notices available right now.</p>
      ) : (
        <ul className="space-y-4">
          {notices.map((notice) => (
            <li
              key={notice._id}
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <h3 className="text-lg font-semibold text-blue-400">{notice.title}</h3>

              {notice.date && (
                <p className="text-gray-400 text-sm">
                  {new Date(notice.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {notice.description && (
                <p className="text-gray-300 mt-2">{notice.description}</p>
              )}

              {notice.link && (
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline mt-2 block"
                >
                  
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
