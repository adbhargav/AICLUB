import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Trash2, User, Mail, Hash, Calendar, Shield, GraduationCap, Clock, Users } from "lucide-react";

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/auth/users");
        setStudents(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/auth/users/${id}`);
      setStudents(students.filter(s => s._id !== id));
      setSuccess("User deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Retrieving student records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Registered Students</h2>
          <p className="text-gray-400 mt-1">Manage all registered accounts and their access levels.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <Users size={18} className="text-cyan-400" />
          <span className="text-white font-bold">{students.length}</span>
          <span className="text-gray-500 text-sm italic">Total</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
          <Shield size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-3">
          <Shield size={20} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
            <User size={32} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-lg">No students registered in the system yet.</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400">Student Info</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400">Academic Details</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400">Registration</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400">Role</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400">Joined</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-cyan-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-300 font-bold border border-white/10 group-hover:scale-110 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{student.name}</div>
                          <div className="text-gray-500 text-sm flex items-center gap-1">
                            <Mail size={12} /> {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="text-gray-300 text-sm flex items-center gap-2">
                          <GraduationCap size={14} className="text-blue-400" />
                          {student.branch || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-2">
                          <Clock size={14} className="text-purple-400" />
                          Year: {student.year || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-300 text-sm font-mono flex items-center gap-2">
                        <Hash size={14} className="text-teal-400" />
                        {student.registerNumber || "N/A"}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${student.role === 'admin'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${student.role === 'admin' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                        {student.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 transform hover:rotate-12 active:scale-95 border border-red-500/20"
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
