import { Outlet, NavLink } from 'react-router-dom';
import { Home, Image as ImageIcon, QrCode, Layers, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function UserLayout() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home', exact: true },
    { to: '/memories', icon: ImageIcon, label: 'Galeri' },
    { to: '/scan', icon: QrCode, label: 'Scan', isCenter: true },
    { to: '/frames', icon: Layers, label: 'Frame' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-soft-gray flex flex-col md:flex-row relative">

      {/* ── Desktop/Tablet Sidebar (hidden on mobile) ─────────────────── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-border bg-white shadow-sm z-40">
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-primary flex-shrink-0">
            <img src="/pwa-192x192.png" alt="FotoGo Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">
            FotoGo
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={cn(
                  'flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative text-sm font-semibold',
                  active
                    ? 'bg-primary-light text-primary'
                    : 'text-text-secondary hover:bg-soft-gray hover:text-text-dark'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.isCenter && (
                  <span className="ml-auto text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Scan
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-[10px] text-text-muted font-medium tracking-widest uppercase">
            FotoGo v1.0.0
          </p>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 pb-24 md:pb-0 min-h-screen overflow-y-auto">
        <div className="max-w-2xl lg:max-w-3xl mx-auto md:py-6 md:px-6">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav — Gojek-style ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-bottom-nav border-t border-border z-50">
        <div className="flex items-end justify-around px-2 pt-2 pb-safe">
          {navItems.map((item) => {
            const active = isActive(item);

            if (item.isCenter) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center -translate-y-4"
                >
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.3, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-primary/30 blur-sm"
                  />
                  <div className="w-14 h-14 hero-gradient rounded-full flex items-center justify-center shadow-primary relative z-10">
                    <item.icon size={26} className="text-white" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10px] font-semibold text-primary mt-1.5">Scan</span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className="flex flex-col items-center gap-1 pb-2 min-w-[52px] relative"
              >
                {({ isActive: routeActive }) => {
                  const itemActive = item.exact
                    ? location.pathname === item.to
                    : routeActive;
                  return (
                    <>
                      <item.icon
                        size={22}
                        strokeWidth={itemActive ? 2.5 : 2}
                        className={cn(
                          'transition-colors duration-200',
                          itemActive ? 'text-primary' : 'text-text-secondary'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] font-semibold transition-colors duration-200',
                          itemActive ? 'text-primary' : 'text-text-secondary'
                        )}
                      >
                        {item.label}
                      </span>
                      {/* Gojek-style active dot indicator */}
                      <AnimatePresence>
                        {itemActive && (
                          <motion.div
                            key="dot"
                            layoutId="nav-active-dot"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -bottom-0 w-1 h-1 bg-primary rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </div>
        {/* Safe-area spacer for iPhone */}
        <div className="h-safe-bottom bg-white" />
      </nav>
    </div>
  );
}
