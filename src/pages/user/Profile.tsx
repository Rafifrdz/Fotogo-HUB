import { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_USER } from '../../mockData';
import {
  Settings, LogOut, ChevronRight, Bell, Shield,
  HelpCircle, CreditCard, Award, Camera, MapPin,
  LogIn, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const MENU_SECTIONS = [
  {
    title: 'Akun',
    items: [
      { icon: CreditCard, label: 'Riwayat Transaksi', color: '#5B3CF5', bg: '#EDE9FE', to: '/memories' },
      { icon: Bell,       label: 'Notifikasi',        color: '#FF9F43', bg: '#FFF8F0', to: null },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { icon: Shield,      label: 'Pengaturan Privasi', color: '#00C896', bg: '#E6FAF4', to: null },
      { icon: HelpCircle,  label: 'Pusat Bantuan',      color: '#3B82F6', bg: '#EFF6FF', to: null },
    ],
  },
];

export default function Profile() {
  const { user, logout, login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async () => {
    setSigningIn(true);
    try { await login(); } finally { setSigningIn(false); }
  };

  /* ── Not signed in ─────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="min-h-screen bg-soft-gray flex flex-col">
        <div className="hero-gradient px-5 pt-12 pb-24 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-white text-xl font-bold">Profil</h1>
        </div>

        <div className="flex-1 px-5 -mt-16 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-card text-center space-y-4">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary mx-auto">
              <Camera size={36} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-dark">Masuk Diperlukan</h2>
              <p className="text-text-secondary text-sm mt-1 max-w-[240px] mx-auto">
                Bergabung dengan FotoGo untuk menyimpan kenangan dan frame kustom.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm">
                <p>{error}</p>
                <button onClick={clearError} className="text-xs font-bold underline mt-1">Coba lagi</button>
              </div>
            )}

            <button
              id="profile-signin-btn"
              onClick={handleLogin}
              disabled={signingIn}
              className={cn(
                'w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-primary shadow-md flex items-center justify-center gap-2',
                signingIn && 'opacity-70 cursor-not-allowed'
              )}
            >
              {signingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {signingIn ? 'Menghubungkan ke Google...' : 'Masuk dengan Google'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Signed in ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-soft-gray">

      {/* ── Hero — Gojek profile header ─────────────────────────────────── */}
      <div className="hero-gradient px-5 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">Profil</h1>
          <button id="profile-settings-btn" className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <Settings size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-16 pb-8 space-y-4">

        {/* ── User Card — Gojek account card ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-light shadow-md bg-primary-light flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Award size={32} className="text-primary" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                <Camera size={10} className="text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-text-dark truncate">{user.displayName}</h2>
              <p className="text-xs text-text-secondary truncate">{user.email}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={11} className="text-gold fill-gold" />
                <span className="text-xs font-bold text-text-dark">Fotografer Explorer</span>
              </div>
            </div>
          </div>

          {/* Stats row — Gojek style */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-xl font-black text-primary">{MOCK_USER.totalMemories}</p>
              <p className="text-[10px] text-text-secondary font-medium mt-0.5">Kenangan</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-xl font-black text-primary">{MOCK_USER.boothsVisited}</p>
              <p className="text-[10px] text-text-secondary font-medium mt-0.5">Booth</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-primary">{MOCK_USER.points}</p>
              <p className="text-[10px] text-text-secondary font-medium mt-0.5">Poin</p>
            </div>
          </div>
        </motion.div>

        {/* ── Badges ──────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-text-dark px-1">Pencapaian</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {MOCK_USER.badges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[120px] bg-white rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-card border border-border"
              >
                <div className="w-11 h-11 bg-primary-light rounded-full flex items-center justify-center">
                  <Award size={20} className="text-primary" />
                </div>
                <span className="text-[10px] font-bold text-text-dark leading-tight">{badge}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Menu Sections — Gojek account menu ──────────────────────────── */}
        {MENU_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h3 className="text-xs text-text-muted font-semibold uppercase tracking-wider px-1">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-card divide-y divide-border">
          {section.items.map((item) => (
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-soft-gray transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-text-dark text-left">{item.label}</span>
                    <ChevronRight size={16} className="text-text-muted" />
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => alert(`Fitur "${item.label}" akan segera hadir!`)}
                    className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-soft-gray transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-text-dark text-left">{item.label}</span>
                    <ChevronRight size={16} className="text-text-muted" />
                  </button>
                )
              ))}
            </div>
          </section>
        ))}


        <button
          id="profile-logout-btn"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-50 rounded-2xl border border-red-100 text-sm"
        >
          <LogOut size={18} /> Keluar
        </button>

        <p className="text-center text-[10px] text-text-muted font-medium tracking-widest uppercase pt-2">
          FotoGo v1.0.0
        </p>
      </div>
    </div>
  );
}
