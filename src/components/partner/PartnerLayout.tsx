import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, BarChart3, Settings, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PartnerLayout() {
  const sidebarItems = [
    { to: '/partner', icon: LayoutDashboard, label: 'Overview' },
    { to: '/partner/upload', icon: Upload, label: 'Upload Session' },
    { to: '/partner/customers', icon: Users, label: 'Customers' },
    { to: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/partner/referral', icon: Share2, label: 'Referral' },
    { to: '/partner/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">PB</div>
            Partner Hub
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive ? "bg-primary-light text-primary font-semibold" : "text-text-secondary hover:bg-gray-100"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-all font-medium"
          >
            <Share2 size={20} />
            Switch to User App
          </NavLink>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
              BV
            </div>
            <div>
              <p className="text-sm font-semibold">Braga Vibes</p>
              <p className="text-xs text-text-secondary">Partner Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-text-dark">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="text-text-secondary hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
