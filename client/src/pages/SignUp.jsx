import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Hash,
  Camera,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    year: "",
    registerNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
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

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("branch", formData.branch);
      data.append("year", formData.year);
      data.append("registerNumber", formData.registerNumber);
      data.append("password", formData.password);
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      await api.post("/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-32 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full max-w-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-2xl shadow-purple-500/20 mb-6 transform hover:rotate-6 transition-transform">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Club</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">Innovation begins with your account</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full -mr-32 -mt-32 group-hover:opacity-100 opacity-0 transition-opacity"></div>

          {(error || success) && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${error ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-green-500/10 border border-green-500/20 text-green-400"
              }`}>
              {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <p className="text-sm font-bold">{error || success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-[32px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-purple-500/50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" />
                  ) : (
                    <ImageIcon size={40} className="text-gray-600 group-hover/avatar:text-purple-400 transition-colors" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-500 transition-colors border border-white/10">
                  <Camera size={20} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Optional Profile Photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group/input">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group/input">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Branch</label>
                <div className="relative group/input">
                  <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="branch"
                    placeholder="e.g. CSE"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Year</label>
                <div className="relative group/input">
                  <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium appearance-none"
                  >
                    <option value="" className="bg-[#050505]">Select Year</option>
                    <option value="1st Year" className="bg-[#050505]">1st Year</option>
                    <option value="2nd Year" className="bg-[#050505]">2nd Year</option>
                    <option value="3rd Year" className="bg-[#050505]">3rd Year</option>
                    <option value="4th Year" className="bg-[#050505]">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Register Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reg Number</label>
                <div className="relative group/input">
                  <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="registerNumber"
                    placeholder="21XXXXXX"
                    value={formData.registerNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4 md:col-span-2">
                {/* Password */}
                <div className="space-y-2 mb-6 md:mb-0">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group/input">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative group/input">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-transform group-hover/btn:scale-105 duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <footer className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-gray-500">
              Already exploring?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-white font-black hover:text-purple-400 transition-colors inline-flex items-center gap-1 group/link"
              >
                Sign In Instead
                <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
