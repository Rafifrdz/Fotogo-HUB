import { motion } from 'motion/react';
import { MOCK_BOOTHS } from '../../mockData';
import { MapPin, Star, Search, Navigation, List, Map as MapIcon, Clock, Users, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Semua', 'Terdekat', 'Promo', 'Populer', 'Baru'];

export default function Explore() {
  const [view, setView] = useState<'map' | 'list'>('list');
  const [activeCategory, setActiveCategory] = useState('Semua');

  return (
    <div className="h-full flex flex-col bg-soft-gray">

      {/* ── Header — Gojek Explore sticky top ──────────────────────────── */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-text-dark">Jelajahi Booth</h1>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-soft-gray rounded-xl p-1 gap-1">
              <button
                id="explore-list-view-btn"
                onClick={() => setView('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                )}
              >
                <List size={16} />
              </button>
              <button
                id="explore-map-view-btn"
                onClick={() => setView('map')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === 'map' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                )}
              >
                <MapIcon size={16} />
              </button>
            </div>
            {/* Filter */}
            <button
              id="explore-filter-btn"
              className="p-2.5 bg-soft-gray rounded-xl text-text-secondary"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Search bar — Gojek style */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <input
            id="explore-search-input"
            type="text"
            placeholder="Cari photobooth..."
            className="w-full bg-soft-gray rounded-2xl py-3 pl-11 pr-4 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category chips — Gojek style */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`explore-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                cat === activeCategory
                  ? 'bg-primary text-white shadow-primary/20 shadow-md'
                  : 'bg-white text-text-secondary border border-border'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {view === 'list' ? (
          <div className="px-5 py-4 space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary font-medium">
                {MOCK_BOOTHS.length} booth ditemukan
              </p>
              <span className="text-xs text-text-secondary">Diurutkan berdasarkan jarak</span>
            </div>

            {MOCK_BOOTHS.map((booth, index) => {
              const status = index === 0 ? 'busy' : index === 1 ? 'almost-full' : 'available';
              const waitingCount = index === 0 ? 5 : index === 1 ? 2 : 0;

              return (
                <motion.div
                  key={booth.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card"
                >
                  {/* Image */}
                  <div className="h-44 relative">
                    <img
                      src={booth.imageUrl}
                      alt={booth.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {booth.promo && (
                        <div className="bg-accent text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                          PROMO
                        </div>
                      )}
                      <div className={cn(
                        'text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5',
                        status === 'busy' ? 'bg-red-500' : status === 'almost-full' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          status === 'busy' ? 'bg-red-200 animate-ping' : status === 'almost-full' ? 'bg-amber-200 animate-ping' : 'bg-emerald-200'
                        )} />
                        {status === 'busy' ? 'Sibuk' : status === 'almost-full' ? 'Hampir Penuh' : 'Tersedia'}
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star size={11} className="text-gold fill-gold" />
                      <span className="text-xs font-bold text-text-dark">{booth.rating}</span>
                      <span className="text-[10px] text-text-secondary">(120+)</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-text-dark">{booth.name}</h3>
                        <div className="flex items-center gap-1 text-text-secondary mt-0.5">
                          <MapPin size={11} />
                          <span className="text-xs truncate">{booth.address}</span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-primary font-bold">{booth.price}</p>
                        <p className="text-[10px] text-text-muted">{booth.distance} dari sini</p>
                      </div>
                    </div>

                    {/* Nudge — busy/almost-full */}
                    {(status === 'busy' || status === 'almost-full') && (
                      <div className={cn(
                        'flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold',
                        status === 'busy' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      )}>
                        <AlertCircle size={13} />
                        {status === 'busy'
                          ? `${waitingCount} orang dalam antrian · Est. 45 menit`
                          : 'Hanya 2 slot tersisa hari ini!'}
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-2.5 pt-1">
                      <Link
                        to={`/booking/${booth.id}`}
                        id={`booth-book-${booth.id}`}
                        className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold text-center hover:bg-primary-dark transition-colors active:scale-95"
                      >
                        Booking Sesi
                      </Link>
                      <Link
                        to={`/queue/${booth.id}`}
                        id={`booth-queue-${booth.id}`}
                        className="px-5 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-primary/20 transition-colors active:scale-95"
                      >
                        <Users size={16} />
                        Antri
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Map placeholder */
          <div className="m-5 h-[420px] bg-primary-light rounded-3xl relative overflow-hidden flex items-center justify-center border-2 border-primary/10">
            <div className="absolute inset-0 opacity-25">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
              {[[25,33],[50,72],[70,45]].map(([t,l], i) => (
                <div key={i} className="absolute w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white" style={{ top: `${t}%`, left: `${l}%` }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-xl animate-bounce">
                <Navigation size={30} />
              </div>
              <h3 className="text-base font-bold text-text-dark">Tampilan Peta Segera Hadir</h3>
              <p className="text-text-secondary text-sm max-w-[240px]">
                Kami sedang mengintegrasikan peta untuk membantu kamu menemukan booth terdekat.
              </p>
              <button
                onClick={() => setView('list')}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-primary shadow-md text-sm"
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
