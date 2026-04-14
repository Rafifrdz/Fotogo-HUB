import { motion } from 'motion/react';
import { MOCK_SESSIONS } from '../../mockData';
import { Search, Filter, Calendar, MapPin, Grid, List } from 'lucide-react';
import { useState } from 'react';

export default function Memories() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const filters = ['All', '2026', '2025', 'Bandung', 'Jakarta'];

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-dark">Memories</h1>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-light text-primary' : 'text-text-secondary'}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-light text-primary' : 'text-text-secondary'}`}
          >
            <List size={18} />
          </button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search by booth, location, or tag..." 
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {filters.map((filter) => (
            <button 
              key={filter}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === 'All' ? 'bg-primary text-white shadow-md' : 'bg-white text-text-secondary border border-gray-100'}`}
            >
              {filter}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-white text-text-secondary border border-gray-100 flex items-center gap-1">
            <Filter size={14} /> More
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-6'}`}>
        {MOCK_SESSIONS.map((session, index) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className={`${viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-video'} relative`}>
              <img 
                src={session.imageUrl} 
                alt={session.boothName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-primary shadow-sm">
                +{session.pointsEarned} pts
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-bold text-sm text-text-dark truncate">{session.boothName}</h3>
              <div className="flex items-center justify-between text-[10px] text-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={10} />
                  <span>{session.location}</span>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {session.tags.map(tag => (
                  <span key={tag} className="text-[8px] bg-soft-gray px-2 py-0.5 rounded-full text-text-secondary font-medium">#{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State / Load More */}
      <div className="py-8 text-center space-y-2">
        <p className="text-text-secondary text-sm">Showing {MOCK_SESSIONS.length} memories</p>
        <button className="text-primary font-bold text-sm hover:underline">Load More</button>
      </div>
    </div>
  );
}
