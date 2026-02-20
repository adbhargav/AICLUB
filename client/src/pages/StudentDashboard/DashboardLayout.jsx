import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  MessageSquare,
  Calendar,
  FolderKanban,
  BarChart3,
  LayoutDashboard,
  X,
  Menu,
  LogOut,
  ChevronRight,
  Sparkles,
  GraduationCap
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { to: "profile", label: "My Profile", icon: User, color: "text-violet-400" },
    { to: "assignments", label: "Assignments", icon: BookOpen, color: "text-blue-400" },
    { to: "notices", label: "Notice Board", icon: MessageSquare, color: "text-cyan-400" },
    { to: "events", label: "Club Events", icon: Calendar, color: "text-indigo-400" },
    { to: "projects", label: "Submit Project", icon: FolderKanban, color: "text-teal-400" },
    { to: "stats", label: "Stats & Progress", icon: BarChart3, color: "text-purple-400" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const currentPath = location.pathname.split('/').pop();
  const activeLabel = navLinks.find(link => link.to === currentPath)?.label || "Student Dashboard";

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/[0.02] backdrop-blur-2xl border-r border-white/5 flex flex-col transition-transform duration-500 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase">
                Student <span className="text-violet-400">Hub</span>
              </h2>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase truncate w-32">Innovate & Excel</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar mt-4">
          <NavLink
            to="/student-dashboard"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                ? "bg-violet-500/10 border border-violet-500/20 text-violet-300 shadow-xl"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} className="opacity-70 group-hover:opacity-100" />
              <span className="font-bold text-sm">Overview</span>
            </div>
          </NavLink>

          <div className="h-[1px] bg-white/5 mx-4 my-4"></div>

          <p className="px-6 pb-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">Resources</p>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-violet-500/10 border border-violet-500/20 text-violet-300 shadow-xl shadow-violet-500/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${link.color}`} />
                  <span className="font-bold text-sm">{link.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-all translate-x-2 group-hover:translate-x-0" />
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:text-white hover:bg-red-500/10 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#020617]/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 hover:text-white border border-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="bg-violet-500/10 p-2 rounded-lg lg:hidden">
                <GraduationCap size={20} className="text-violet-400" />
              </span>
              {activeLabel}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black text-violet-400 uppercase tracking-widest">Active Member</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Academic Year 2025-26</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-[#020617] rounded-xl flex items-center justify-center border border-white/10">
                <User size={18} className="text-violet-300" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
            {(location.pathname === "/student-dashboard" || location.pathname === "/student-dashboard/") && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="relative group">
                  <div className="absolute inset-0 bg-violet-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/[0.03] border border-white/10 p-12 rounded-[40px] text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/20 mx-auto mb-8 transform group-hover:rotate-6 transition-transform">
                      <Sparkles size={40} className="text-white animate-pulse" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
                      Unleash Your Potential, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Innovator</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                      Welcome to your personal command center. Track your growth, showcase your skills, and stay connected with the AI Club community.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="group relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 p-8 rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-600/10"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/5 to-transparent blur-2xl rounded-full -mr-12 -mt-12 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                      <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 transition-colors group-hover:border-violet-500/30 group-hover:bg-violet-500/10`}>
                        <link.icon size={26} className={`${link.color} transition-transform group-hover:scale-110`} />
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">{link.label}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">Explore resources and management tools for your academic success.</p>
                      <div className="mt-6 flex items-center gap-2 text-xs font-black text-violet-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        Launch <ChevronRight size={14} />
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(139, 92, 246, 0.2); 
          border-radius: 20px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.4); }
      `}} />
    </div>
  );
}
