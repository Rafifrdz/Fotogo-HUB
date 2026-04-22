import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Users, 
  Calendar,
  Image as ImageIcon,
  Bell,
  Search,
  ChevronRight,
  MonitorPlay,
  LogOut,
  Camera,
  Layers,
  UploadCloud
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PartnerLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/mitrago' },
    { icon: Settings, label: 'Booth Software', path: '/mitrago/software' },
    { icon: Layers, label: 'Templates', path: '/mitrago/templates' },
    { icon: Calendar, label: 'Events', path: '/mitrago/events' },
    { icon: Users, label: 'Customers', path: '/mitrago/customers' },
    { icon: UploadCloud, label: 'Upload Assets', path: '/mitrago/upload' },
    { icon: BarChart3, label: 'Analytics', path: '/mitrago/analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shrink-0 z-30",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-4 border-b border-gray-50">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-pink-200">
            <Camera size={24} className="text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-black text-xl tracking-tighter text-gray-900">MITRAGO</h1>
              <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest leading-none">Partner Dashboard</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative font-medium",
                  isActive 
                    ? "bg-pink-50 text-pink-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon size={20} className={cn("shrink-0", isActive ? "text-pink-600" : "group-hover:text-gray-700")} />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                {isActive && (
                   <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-pink-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">
            <Bell size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Notifications</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
            >
              <ChevronRight className={cn("transition-transform", isSidebarOpen ? "rotate-180" : "rotate-0")} size={20} />
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <h2 className="text-sm font-bold text-gray-500 capitalize">
              {navItems.find(n => n.path === location.pathname)?.label || 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 w-64 transition-all"
              />
            </div>
            <Link 
              to="/mitrago/kiosk"
              target="_blank"
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-200 flex items-center gap-2"
            >
              <MonitorPlay size={14} />
              Launch Kiosk
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}} />
    </div>
  );
}
