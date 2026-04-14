import { Outlet, NavLink } from 'react-router-dom';
import { Home, Image as ImageIcon, Search, User, QrCode, Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function UserLayout() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/memories', icon: ImageIcon, label: 'Memories' },
    { to: '/scan', icon: QrCode, label: 'Scan', isCenter: true },
    { to: '/frames', icon: Gift, label: 'Frames' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-soft-gray flex flex-col md:flex-row relative">
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 max-w-[250px] lg:w-72 h-screen sticky top-0 border-r border-gray-200 bg-white p-6 shadow-sm z-40">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <img src="/pwa-192x192.png" alt="Logo" className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">FotoGO HUB</span>
        </div>

        <nav className="flex-1 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary-light/50 text-primary font-bold shadow-sm"
                    : "text-text-secondary hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={24}
                    className={cn(
                      "transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                  <span className="text-sm tracking-wide">{item.label}</span>
                  {item.isCenter && (
                    <span className="ml-auto bg-primary text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      Scan
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto bg-soft-gray/50 xl:px-8">
        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto md:py-8 md:px-6 xl:px-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-colors relative",
                item.isCenter ? "bg-primary p-4 rounded-full -mt-12 shadow-[0_8px_16px_rgba(var(--primary),0.3)] text-white" :
                  isActive ? "text-primary" : "text-text-secondary hover:text-gray-900"
              )
            }
          >
            <item.icon size={item.isCenter ? 28 : 24} />
            {!item.isCenter && <span className="text-[10px] font-medium">{item.label}</span>}
            {item.isCenter && (
              <motion.div
                layoutId="scan-ring"
                className="absolute inset-0 rounded-full border-4 border-primary-light opacity-50"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
