import { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_USER } from '../../mockData';
import { Settings, LogOut, ChevronRight, Bell, Shield, HelpCircle, CreditCard, Award, Camera, MapPin, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, logout, login, error, clearError } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const menuItems = [
    { icon: CreditCard, label: 'Transaction History' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy Settings' },
    { icon: HelpCircle, label: 'Help Center' },
  ];

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await login();
      // For redirect, we might not reach this line as page reloads
    } catch (err) {
      setSigningIn(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full space-y-6 text-center">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
          <MapPin size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-dark">Sign in Required</h2>
          <p className="text-text-secondary text-sm">Join PhotoBooth Hub to save your memories and custom frames.</p>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm flex flex-col items-center gap-2">
            <p>{error}</p>
            <button onClick={clearError} className="text-xs font-bold underline">Try again</button>
          </div>
        )}

        <button 
          onClick={handleLogin} 
          disabled={signingIn}
          className={`w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 ${signingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {signingIn ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn size={20} />
          )}
          {signingIn ? 'Connecting to Google...' : 'Sign in with Google'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-dark">Profile</h1>
        <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-text-secondary">
          <Settings size={20} />
        </button>
      </header>

      {/* User Info */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-primary-light flex items-center justify-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <Award size={48} className="text-primary" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
            <Camera size={16} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-dark">{user.displayName}</h2>
          <p className="text-text-secondary text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">{MOCK_USER.totalMemories}</p>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Memories</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">{MOCK_USER.boothsVisited}</p>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Booths Visited</p>
        </div>
      </div>

      {/* Badges */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
          {MOCK_USER.badges.map((badge, index) => (
            <motion.div 
              key={badge}
              whileHover={{ scale: 1.05 }}
              className="min-w-[120px] bg-primary-light p-4 rounded-2xl flex flex-col items-center text-center space-y-2 border border-primary/10"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                <Award size={24} />
              </div>
              <span className="text-[10px] font-bold text-primary leading-tight">{badge}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {menuItems.map((item, index) => (
          <button 
            key={item.label}
            className={`w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-soft-gray rounded-lg flex items-center justify-center text-text-secondary">
                <item.icon size={18} />
              </div>
              <span className="text-sm font-medium text-text-dark">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}
      </section>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-50 rounded-2xl border border-red-100"
      >
        <LogOut size={20} /> Logout
      </button>

      <div className="pt-4">
        <Link to="/partner" className="w-full flex items-center justify-center gap-2 text-primary font-bold py-4 bg-primary-light rounded-2xl border border-primary/20">
          <Settings size={20} /> Switch to Partner Dashboard
        </Link>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest">PhotoBooth Hub v1.0.0</p>
      </div>
    </div>
  );
}
