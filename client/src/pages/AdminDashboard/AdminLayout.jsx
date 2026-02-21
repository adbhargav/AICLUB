import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Users,
  FolderKanban,
  PhoneCall,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const navLinks = [
    { to: "create-event", label: "Create Event", icon: Calendar },
    { to: "give-assignments", label: "Give Assignments", icon: BookOpen },
    { to: "issue-notices", label: "Issue Notices", icon: MessageSquare },
    { to: "upload-gallery", label: "Upload Gallery", icon: ImageIcon },
    { to: "create-team", label: "Create Team", icon: UserPlus },
    { to: "view-projects", label: "View Projects", icon: FolderKanban },
    { to: "view-students", label: "View Students", icon: Users },
    { to: "view-contacts", label: "View Contacts", icon: PhoneCall },
  ];

  const currentPath = location.pathname.split('/').pop();
  const activeLabel = navLinks.find(link => link.to === currentPath)?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky inset-y-0 left-0 z-50 w-72 h-full bg-white/[0.03] backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10"
                    : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-medium">{link.label}</span>
                </div>
                <ChevronRight size={16} className={`opacity-0 transition-all duration-300 transform ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-2"} group-hover:opacity-100 group-hover:translate-x-0`} />
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 font-bold group border border-transparent hover:border-red-500/30"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Sign Out</span>
          </button>

          <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase text-center opacity-50">
            &copy; {new Date().getFullYear()} RGMCET AI CLUB
          </p>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Mobile Header / Desktop Topbar */}
        <header className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {activeLabel}
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Action space or user info can go here */}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
            {location.pathname === "/admin" || location.pathname === "/admin/" ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/40 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <LayoutDashboard size={48} className="text-white" />
                  </div>
                </div>

                <div className="space-y-4 max-w-lg">
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    Welcome Back, Admin
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Access and manage all platform resources from your centralized dashboard. Select a tool from the sidebar to begin.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                  <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-left space-y-2">
                    <Users className="text-cyan-400 mb-2" size={24} />
                    <h3 className="font-semibold text-white">Community</h3>
                    <p className="text-sm text-gray-500">Manage students and team members.</p>
                  </div>
                  <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-left space-y-2">
                    <Calendar className="text-purple-400 mb-2" size={24} />
                    <h3 className="font-semibold text-white">Engagement</h3>
                    <p className="text-sm text-gray-500">Create events and issue notices.</p>
                  </div>
                  <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-left space-y-2">
                    <FolderKanban className="text-blue-400 mb-2" size={24} />
                    <h3 className="font-semibold text-white">Academic</h3>
                    <p className="text-sm text-gray-500">Review projects and assignments.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
