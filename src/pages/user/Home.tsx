import { motion, AnimatePresence } from 'motion/react';
import { MOCK_SESSIONS, MOCK_BOOTHS, MOCK_USER } from '../../mockData';
import {
  MapPin, Star, Camera, Grid2X2, Film, Sparkles,
  Gift, QrCode, Clock, ChevronRight, Coins, Search, User, Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

// ── Service grid items ────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Camera,   label: 'Booking',  to: '/explore',  color: '#2492F0', bg: '#E8F4FE' },
  { icon: Film,     label: 'Galeri',   to: '/memories', color: '#FF6B6B', bg: '#FFF0F0' },
  { icon: Grid2X2,  label: 'Frame',    to: '/frames',   color: '#FF9F43', bg: '#FFF8F0' },
  { icon: QrCode,   label: 'Scan',     to: '/scan',     color: '#00C896', bg: '#E6FAF4' },
  { icon: Gift,     label: 'Reward',   to: '/referral', color: '#D946EF', bg: '#FDF0FF' },
  { icon: Sparkles, label: 'Promo',    to: '/explore',  color: '#F6C90E', bg: '#FFFBEA' },
  { icon: Clock,    label: 'Riwayat',  to: '/memories', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: Star,     label: 'Ulasan',   to: '/explore',  color: '#EC4899', bg: '#FDF2F8' },
];

// ── Promo banners ─────────────────────────────────────────────────────────────
const PROMO_BANNERS = [
  { id: 1, title: 'Frame Pastel Dreams 🌸', subtitle: 'Tersedia di semua booth partner weekend ini.', cta: 'Klaim Sekarang', color: '#2492F0', emoji: '🖼️' },
  { id: 2, title: 'Foto Gratis Kunjungan Pertama 📸', subtitle: 'Booking sekarang dan dapatkan cetak gratis!', cta: 'Book Sekarang', color: '#FF6B6B', emoji: '🎁' },
  { id: 3, title: 'Undang Teman, Dapat Poin 🎉', subtitle: 'Kamu & temanmu masing-masing dapat 100 poin.', cta: 'Bagikan Kode', color: '#00C896', emoji: '👥' },
];

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col bg-soft-gray min-h-screen">

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TOP BAR — Search + Avatar                                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="bg-white px-5 pt-12 pb-4 flex items-center gap-3 border-b border-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Cari photobooth terdekat..."
            className="w-full bg-soft-gray rounded-full py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Link to="/profile" className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-primary-light flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
            )}
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* POINTS CARD — FotoGo Points + Quick Actions                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white px-5 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-soft-gray rounded-2xl p-4 flex items-center justify-between mt-4"
        >
          {/* Left: Balance */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest leading-none mb-0.5">FotoGo · Points</p>
              <p className="text-xl font-black text-text-dark leading-none">{MOCK_USER.points} <span className="text-sm font-semibold text-text-secondary">pts</span></p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-border mx-2" />

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-5">
            <Link to="/scan" className="flex flex-col items-center gap-1.5 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                <QrCode size={18} className="text-text-dark" />
              </div>
              <span className="text-[10px] font-semibold text-text-secondary">Scan</span>
            </Link>
            <Link to="/referral" className="flex flex-col items-center gap-1.5 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                <Plus size={18} className="text-text-dark" />
              </div>
              <span className="text-[10px] font-semibold text-text-secondary">Invite</span>
            </Link>
            <Link to="/explore" className="flex flex-col items-center gap-1.5 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                <Grid2X2 size={18} className="text-text-dark" />
              </div>
              <span className="text-[10px] font-semibold text-text-secondary">Explore</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN SCROLLABLE CONTENT                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-3 pb-28">

        {/* ── Kenangan Hari Ini ─────────────────────────────────────────── */}
        <section className="bg-white px-5 pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-dark">Kenangan Hari Ini</h2>
            <Link to="/memories" className="text-primary text-xs font-semibold flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={13} />
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative h-44 rounded-xl overflow-hidden shadow-sm group"
          >
            <img
              src={MOCK_SESSIONS[0].imageUrl}
              alt="Memory"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
              <p className="text-white/70 text-[10px] font-medium mb-0.5">1 tahun yang lalu hari ini</p>
              <h3 className="text-white text-base font-bold leading-tight">{MOCK_SESSIONS[0].boothName}</h3>
              <p className="text-white/60 text-xs mb-3">{MOCK_SESSIONS[0].location}</p>
              <div className="flex gap-2">
                <Link to="/memories" className="bg-white text-primary px-4 py-1.5 rounded-lg text-xs font-bold">
                  Lihat
                </Link>
                <button className="bg-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold border border-white/20">
                  Ulangi
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Service Grid 4×2 ──────────────────────────────────────────── */}
        <section className="bg-white px-5 pt-5 pb-6">
          <h2 className="text-sm font-bold text-text-dark mb-4">Layanan</h2>
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={service.to}
                  id={`service-${service.label.toLowerCase()}`}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-150 group-active:scale-90"
                    style={{ backgroundColor: service.bg }}
                  >
                    <service.icon size={22} style={{ color: service.color }} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-semibold text-text-dark text-center leading-tight">
                    {service.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Promo Banner Carousel ─────────────────────────────────────── */}
        <section className="bg-white px-5 pt-5 pb-5">
          <h2 className="text-sm font-bold text-text-dark mb-3">Promo Untukmu</h2>
          <div className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBanner}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-xl flex items-center justify-between overflow-hidden"
                style={{ backgroundColor: PROMO_BANNERS[activeBanner].color }}
              >
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-white font-bold text-base leading-snug max-w-[200px]">
                    {PROMO_BANNERS[activeBanner].title}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed max-w-[180px]">
                    {PROMO_BANNERS[activeBanner].subtitle}
                  </p>
                  <button className="mt-1 bg-white/20 border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-lg">
                    {PROMO_BANNERS[activeBanner].cta}
                  </button>
                </div>
                <div className="text-5xl opacity-90 ml-4 flex-shrink-0">
                  {PROMO_BANNERS[activeBanner].emoji}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {PROMO_BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBanner(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeBanner ? 'bg-primary w-5' : 'bg-border w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Booth Terdekat ────────────────────────────────────────────── */}
        <section className="bg-white pt-5 pb-5">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-sm font-bold text-text-dark">Booth Terdekat</h2>
            <Link to="/explore" className="text-primary text-xs font-semibold flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={13} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {MOCK_BOOTHS.map((booth, i) => (
              <motion.div
                key={booth.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.97 }}
                className="min-w-[160px] max-w-[160px] bg-soft-gray rounded-2xl overflow-hidden flex-shrink-0"
              >
                <Link to={`/booking/${booth.id}`} id={`booth-card-${booth.id}`}>
                  <div className="h-[100px] relative">
                    <img
                      src={booth.imageUrl}
                      alt={booth.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {booth.promo && (
                      <div className="absolute top-2 left-2 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {booth.promo}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Star size={10} className="text-gold fill-gold" />
                      <span className="text-[10px] font-bold">{booth.rating}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-bold text-xs text-text-dark truncate">{booth.name}</h3>
                    <div className="flex items-center gap-1 text-text-secondary">
                      <MapPin size={9} />
                      <span className="text-[10px] truncate">{booth.address.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-primary font-bold text-xs">{booth.price}</span>
                      <span className="text-[9px] text-text-muted">{booth.distance}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Referral Progress Card ────────────────────────────────────── */}
        <section className="bg-white mx-0 px-5 pt-5 pb-5">
          <Link to="/referral" id="home-referral-card">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-primary-light rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Gift size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium">Program Referral</p>
                <h4 className="font-bold text-sm text-text-dark mt-0.5">Ajak 3 Teman, Gratis 1 Sesi</h4>
                <div className="mt-2 h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '66%' }}
                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-[10px] text-text-secondary mt-1">2 dari 3 teman</p>
              </div>
              <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
            </motion.div>
          </Link>
        </section>

      </div>
    </div>
  );
}
