import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Calendar, MapPin, Users, Image as ImageIcon, Share2,
  Download, ExternalLink, Eye, MoreVertical, Camera, Clock,
  Star, Trash2, Edit2, QrCode, X, Check, Globe, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';

type EventStatus = 'upcoming' | 'live' | 'completed';

interface BoothEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  totalGuests: number;
  photosCount: number;
  avgRating: number;
  isPublicGallery: boolean;
  coverColor: string;
  package: string;
}

const EVENTS: BoothEvent[] = [
  { id: '1', name: 'Wedding Expo Bandung', date: '2026-04-26', location: 'Trans Luxury Hotel', status: 'upcoming', totalGuests: 0, photosCount: 0, avgRating: 0, isPublicGallery: true, coverColor: '#F6C90E', package: 'Full Day Premium' },
  { id: '2', name: 'Prom Night SMAN 1', date: '2026-04-22', location: 'Braga Vibes Studio', status: 'live', totalGuests: 142, photosCount: 568, avgRating: 4.9, isPublicGallery: false, coverColor: '#7C3AED', package: 'Evening Package' },
  { id: '3', name: 'Corporate Annual Meet', date: '2026-04-10', location: 'Sheraton Hotel BDG', status: 'completed', totalGuests: 312, photosCount: 1240, avgRating: 4.7, isPublicGallery: true, coverColor: '#2492F0', package: 'Corporate Standard' },
  { id: '4', name: 'Kemang Market Weekend', date: '2026-03-28', location: 'Kemang, Jakarta', status: 'completed', totalGuests: 204, photosCount: 816, avgRating: 4.5, isPublicGallery: true, coverColor: '#FF6B6B', package: 'Weekend Outdoor' },
  { id: '5', name: 'BRI Roadshow Malang', date: '2026-05-12', location: 'Ijen Boulevard', status: 'upcoming', totalGuests: 0, photosCount: 0, avgRating: 0, isPublicGallery: false, coverColor: '#10B981', package: 'Corporate Premium' },
];

const STATUS_STYLES: Record<EventStatus, { label: string; bg: string; text: string; dot: string }> = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  live: { label: '● LIVE', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export default function Events() {
  const [events, setEvents] = useState<BoothEvent[]>(EVENTS);
  const [activeTab, setActiveTab] = useState<'all' | EventStatus>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BoothEvent | null>(null);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', package: 'Standard', isPublicGallery: true });

  const filtered = activeTab === 'all' ? events : events.filter(e => e.status === activeTab);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BoothEvent = {
      ...newEvent,
      id: Date.now().toString(),
      status: 'upcoming',
      totalGuests: 0,
      photosCount: 0,
      avgRating: 0,
      coverColor: ['#2492F0','#7C3AED','#FF6B6B','#F6C90E','#10B981'][Math.floor(Math.random() * 5)],
    };
    setEvents(prev => [...prev, created]);
    setShowCreate(false);
    setNewEvent({ name: '', date: '', location: '', package: 'Standard', isPublicGallery: true });
  };

  const totalPhotos = events.reduce((a, b) => a + b.photosCount, 0);
  const totalGuests = events.reduce((a, b) => a + b.totalGuests, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-dark">Events & Gallery</h2>
          <p className="text-text-secondary text-sm mt-1">Manage photobooth events and share guest galleries.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'Live Now', value: events.filter(e => e.status === 'live').length, icon: Camera, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Guests', value: totalGuests.toLocaleString(), icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Photos Taken', value: totalPhotos.toLocaleString(), icon: ImageIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted">{s.label}</p>
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'live', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
              activeTab === tab ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-gray-200 text-text-secondary hover:bg-gray-50"
            )}
          >
            {tab === 'all' ? 'All Events' : tab === 'live' ? '● Live' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.map(event => {
          const s = STATUS_STYLES[event.status];
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5 p-5">
                {/* Color Bar + Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: event.coverColor + '22', border: `2px solid ${event.coverColor}40` }}
                >
                  <Camera size={22} style={{ color: event.coverColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-text-dark text-base">{event.name}</h3>
                    <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full", s.bg, s.text)}>
                      {s.label}
                    </span>
                    {event.isPublicGallery && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                        <Globe size={9} /> Public
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar size={11} /> {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={11} /> {event.location}
                    </span>
                    <span className="text-xs text-text-muted">{event.package}</span>
                  </div>
                </div>

                {/* Stats */}
                {event.status !== 'upcoming' && (
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xl font-black text-text-dark">{event.totalGuests}</p>
                      <p className="text-[10px] font-bold text-text-muted">Guests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-text-dark">{event.photosCount}</p>
                      <p className="text-[10px] font-bold text-text-muted">Photos</p>
                    </div>
                    {event.avgRating > 0 && (
                      <div className="text-center">
                        <p className="text-xl font-black text-amber-500 flex items-center gap-1">
                          <Star size={14} fill="currentColor" /> {event.avgRating}
                        </p>
                        <p className="text-[10px] font-bold text-text-muted">Rating</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="px-3 py-2 rounded-xl bg-primary-light text-primary text-xs font-bold hover:bg-primary/15 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  {event.isPublicGallery && event.status === 'completed' && (
                    <button className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-text-secondary text-xs font-bold hover:bg-gray-100 transition-colors">
                      <Share2 size={14} />
                    </button>
                  )}
                  <button className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-text-secondary text-xs font-bold hover:bg-gray-100 transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Live Progress Bar */}
              {event.status === 'live' && (
                <div className="mx-5 mb-4 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <p className="text-xs font-bold text-green-700 flex-1">{event.totalGuests} guests active · {event.photosCount} photos captured so far</p>
                  <button className="text-xs font-bold text-green-600 hover:underline flex items-center gap-1">
                    <ExternalLink size={11} /> Live View
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreate(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl">
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-text-dark">Create New Event</h3>
                  <button onClick={() => setShowCreate(false)}><X size={22} className="text-text-muted" /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Event Name</label>
                    <input type="text" required placeholder="e.g. Wedding Expo Bandung" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Date</label>
                      <input type="date" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Package</label>
                      <select value={newEvent.package} onChange={e => setNewEvent({ ...newEvent, package: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        {['Standard', 'Premium', 'Corporate', 'Full Day'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Venue / Location</label>
                    <input type="text" required placeholder="e.g. Grand Ballroom Hotel" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-text-dark">Public Gallery</p>
                      <p className="text-xs text-text-muted">Guests can view & share photos online</p>
                    </div>
                    <button type="button" onClick={() => setNewEvent({ ...newEvent, isPublicGallery: !newEvent.isPublicGallery })}
                      className={cn("w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0", newEvent.isPublicGallery ? "bg-primary" : "bg-gray-300")}>
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: newEvent.isPublicGallery ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-2xl font-black shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform">
                    Create Event
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="h-24 flex items-end p-6" style={{ backgroundColor: selectedEvent.coverColor }}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedEvent.name}</h3>
                    <p className="text-white/80 text-sm">{selectedEvent.location}</p>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="p-2 bg-white/20 rounded-xl">
                    <X size={18} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Guests', value: selectedEvent.totalGuests },
                    { label: 'Photos', value: selectedEvent.photosCount },
                    { label: 'Rating', value: selectedEvent.avgRating > 0 ? `${selectedEvent.avgRating}★` : 'N/A' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-black text-text-dark">{s.value}</p>
                      <p className="text-[11px] text-text-muted font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2">
                    <ImageIcon size={15} /> View Gallery
                  </button>
                  <button className="py-3 rounded-xl border border-gray-200 text-text-secondary font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                    <QrCode size={15} /> Share Link
                  </button>
                  <button className="py-3 rounded-xl border border-gray-200 text-text-secondary font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                    <Download size={15} /> Export All
                  </button>
                  <button className="py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50">
                    <Trash2 size={15} /> Delete Event
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
