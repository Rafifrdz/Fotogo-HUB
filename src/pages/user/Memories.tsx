import { motion } from 'motion/react';
import { MOCK_SESSIONS } from '../../mockData';
import { Search, Filter, Calendar, MapPin, Grid3X3, List, Download } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const FILTERS = ['Semua', '2026', '2025', 'Bandung', 'Jakarta'];

export default function Memories() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('Semua');

  return (
    <div className="min-h-screen bg-soft-gray">

      {/* ── Sticky Header — Gojek style ───────────────────────────────── */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-dark">Galeri Kenangan</h1>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex bg-soft-gray rounded-xl p-1 gap-0.5">
                <button
                  id="memories-grid-view-btn"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                  )}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  id="memories-list-view-btn"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                  )}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              id="memories-search-input"
              type="text"
              placeholder="Cari booth, lokasi, atau tag..."
              className="w-full bg-soft-gray rounded-2xl py-3 pl-11 pr-4 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {FILTERS.map((f) => (
              <button
                key={f}
                id={`memories-filter-${f}`}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                  f === activeFilter
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-text-secondary border border-border'
                )}
              >
                {f}
              </button>
            ))}
            <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-text-secondary border border-border flex items-center gap-1 whitespace-nowrap">
              <Filter size={12} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <div className="px-5 py-4">
        {/* Results count */}
        <p className="text-xs text-text-secondary font-medium mb-3">
          Menampilkan {MOCK_SESSIONS.length} kenangan
        </p>

        <div className={cn(
          'grid gap-3',
          viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
        )}>
          {MOCK_SESSIONS.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'group bg-white rounded-2xl overflow-hidden shadow-card',
                viewMode === 'list' && 'flex gap-3'
              )}
            >
              {/* Image */}
              <div className={cn(
                'relative overflow-hidden',
                viewMode === 'grid' ? 'aspect-[3/4]' : 'w-28 h-28 flex-shrink-0 rounded-xl m-3'
              )}>
                <img
                  src={session.imageUrl}
                  alt={session.boothName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Points badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                  <span className="text-[9px] font-bold text-gold">+{session.pointsEarned} pts</span>
                </div>
              </div>

              {/* Info */}
              <div className={cn(
                'p-3',
                viewMode === 'list' && 'flex-1 flex flex-col justify-center py-3 pr-3 pl-0'
              )}>
                <h3 className="font-bold text-sm text-text-dark truncate">{session.boothName}</h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {session.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {viewMode === 'list' && (
                  <button className="mt-2 flex items-center gap-1 text-[10px] text-primary font-semibold">
                    <Download size={10} /> Unduh
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        <div className="py-8 text-center">
          <button
            id="memories-load-more-btn"
            className="bg-white border border-border text-text-secondary text-sm font-semibold px-8 py-3 rounded-xl shadow-card"
          >
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>
  );
}
