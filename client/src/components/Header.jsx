import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  LogIn,
  Home,
  Info,
  Image as ImageIcon,
  Phone,
  Users,
  ChevronRight,
  Sparkles,
  User as UserIcon
} from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "student" or "admin"
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/signin");
  };

  const dashboardPath = role === "admin" ? "/admin" : "/student-dashboard";
  const dashboardLabel = role === "admin" ? "Admin Portal" : "Student Hub";

  const menuItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "About", to: "/about", icon: Info },
    { name: "Gallery", to: "/gallery", icon: ImageIcon },
    { name: "Team", to: "/team", icon: Users },
    { name: "Contact", to: "/contact", icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
        ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-500/40 transition-colors"></div>
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-xl group-hover:border-cyan-500/50 transition-colors">
              <img
                src="/rgmcet-logo.jpg"
                alt="Logo"
                className="h-9 w-9 object-contain rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
              AI <span className="text-cyan-400 group-hover:text-white transition-colors">CLUB</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 group-hover:text-gray-300 transition-colors">Innovate. Integrate.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-inner">
          {!token && menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide ${isActive(item.to)
                ? "bg-white/10 text-cyan-400 shadow-lg border border-white/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon size={16} className={isActive(item.to) ? "text-cyan-400" : "opacity-60"} />
              {item.name}
            </Link>
          ))}
          {token && (
            <div className="px-5 py-2.5 text-cyan-400 font-black text-sm tracking-[0.2em] uppercase">
              Dashboard Active
            </div>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath}
                className="group relative flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 border border-white/20"
              >
                <LayoutDashboard size={16} />
                <span>{dashboardLabel}</span>
                <ChevronRight size={14} className="opacity-50 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

              <button
                onClick={handleLogout}
                className="p-3 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all duration-300 active:scale-90 shadow-lg"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

              {user.name && (
                <div className="flex items-center gap-3 pl-2 group">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 font-black shadow-xl group-hover:border-cyan-500/50 transition-colors">
                    <UserIcon size={18} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2.5 px-8 py-3 bg-white text-black hover:bg-cyan-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
            >
              <LogIn size={16} />
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          {token && (
            <Link to={dashboardPath} className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <LayoutDashboard size={20} />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-colors active:scale-90"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-[300px] bg-neutral-950 lg:hidden shadow-2xl transition-transform duration-500 ease-out border-l border-white/10 z-[101] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <span className="text-xl font-black text-white tracking-tight">NAVIGATION</span>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {!token && menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive(item.to)
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}

          {token && (
            <div className="px-6 py-4 mb-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
              <p className="text-cyan-400 font-black text-xs uppercase tracking-widest">Dashboard Active</p>
              <p className="text-gray-500 text-xs mt-1 italic">Public pages are restricted during active sessions.</p>
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-white/5">
            {token ? (
              <div className="space-y-2">
                <Link
                  to={dashboardPath}
                  className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 font-bold group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-4">
                    <LayoutDashboard size={20} className="text-cyan-400" />
                    <span>{dashboardLabel}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-4 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold shadow-xl shadow-cyan-500/20"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={20} />
                Sign In / Up
              </Link>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        {token && (
          <div className="p-6 border-t border-white/5 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
