import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Users, UserCheck, Star, TrendingUp, Download,
  ChevronDown, Camera, Calendar, Phone, Mail, X, MessageSquare,
  MoreVertical, Filter, ArrowUpRight, Image as ImageIcon, Gift
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  sessions: number;
  totalSpent: number;
  lastVisit: string;
  avgRating: number;
  referrals: number;
  tag: 'vip' | 'regular' | 'new' | 'inactive';
  initials: string;
  color: string;
}

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Andi Saputra', phone: '+62 812-1111-2222', email: 'andi@email.com', sessions: 18, totalSpent: 810000, lastVisit: '2026-04-21', avgRating: 5.0, referrals: 5, tag: 'vip', initials: 'AS', color: '#7C3AED' },
  { id: '2', name: 'Budi Raharjo', phone: '+62 813-2222-3333', email: 'budi@email.com', sessions: 9, totalSpent: 405000, lastVisit: '2026-04-18', avgRating: 4.8, referrals: 2, tag: 'regular', initials: 'BR', color: '#2492F0' },
  { id: '3', name: 'Citra Wulandari', phone: '+62 814-3333-4444', email: 'citra@email.com', sessions: 24, totalSpent: 1320000, lastVisit: '2026-04-20', avgRating: 4.9, referrals: 8, tag: 'vip', initials: 'CW', color: '#FF6B6B' },
  { id: '4', name: 'Dedi Kurniawan', phone: '+62 815-4444-5555', email: 'dedi@email.com', sessions: 1, totalSpent: 45000, lastVisit: '2026-04-22', avgRating: 4.5, referrals: 0, tag: 'new', initials: 'DK', color: '#10B981' },
  { id: '5', name: 'Eka Putri', phone: '+62 816-5555-6666', email: 'eka@email.com', sessions: 3, totalSpent: 135000, lastVisit: '2026-02-10', avgRating: 4.2, referrals: 0, tag: 'inactive', initials: 'EP', color: '#F59E0B' },
  { id: '6', name: 'Fajar Hidayat', phone: '+62 817-6666-7777', email: 'fajar@email.com', sessions: 12, totalSpent: 540000, lastVisit: '2026-04-15', avgRating: 4.7, referrals: 3, tag: 'regular', initials: 'FH', color: '#EC4899' },
  { id: '7', name: 'Gita Sari', phone: '+62 818-7777-8888', email: 'gita@email.com', sessions: 31, totalSpent: 2170000, lastVisit: '2026-04-21', avgRating: 5.0, referrals: 12, tag: 'vip', initials: 'GS', color: '#8B5CF6' },
  { id: '8', name: 'Hendra Wijaya', phone: '+62 819-8888-9999', email: 'hendra@email.com', sessions: 2, totalSpent: 90000, lastVisit: '2026-04-19', avgRating: 4.0, referrals: 1, tag: 'new', initials: 'HW', color: '#06B6D4' },
];

const TAG_STYLES = {
  vip: { label: '★ VIP', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  regular: { label: 'Regular', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  new: { label: 'New', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  inactive: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
};

export default function Customers() {
  const [customers] = useState<Customer[]>(CUSTOMERS);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<'all' | Customer['tag']>('all');
  const [sortBy, setSortBy] = useState<'name' | 'sessions' | 'spent' | 'lastVisit'>('sessions');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = customers
    .filter(c => {
      const q = search.toLowerCase();
      return (c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q));
    })
    .filter(c => tagFilter === 'all' || c.tag === tagFilter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'sessions') return b.sessions - a.sessions;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'lastVisit') return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      return 0;
    });

  const totalRevenue = customers.reduce((a, b) => a + b.totalSpent, 0);
  const vipCount = customers.filter(c => c.tag === 'vip').length;
  const avgSessions = (customers.reduce((a, b) => a + b.sessions, 0) / customers.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-dark">Customers</h2>
          <p className="text-text-secondary text-sm mt-1">Track and manage all your booth guests.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-all">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'VIP Members', value: vipCount, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Sessions', value: avgSessions, icon: Camera, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Revenue Generated', value: `Rp ${(totalRevenue / 1e6).toFixed(1)}M`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted">{s.label}</p>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'vip', 'regular', 'new', 'inactive'] as const).map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                tagFilter === tag ? "bg-primary text-white" : "bg-gray-50 border border-gray-200 text-text-secondary hover:bg-gray-100"
              )}
            >
              {tag === 'all' ? 'All' : TAG_STYLES[tag].label}
            </button>
          ))}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text-secondary focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="sessions">Sort: Sessions</option>
              <option value="spent">Sort: Spending</option>
              <option value="lastVisit">Sort: Last Visit</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest">Customer</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest hidden md:table-cell">Contact</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest">Sessions</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest hidden lg:table-cell">Spent</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest hidden lg:table-cell">Last Visit</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-black text-text-muted uppercase tracking-widest">Tag</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, idx) => {
                const tag = TAG_STYLES[c.tag];
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-dark">{c.name}</p>
                          {c.referrals > 0 && (
                            <p className="text-[10px] text-violet-600 font-bold">{c.referrals} referrals</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs text-text-secondary">{c.phone}</p>
                      <p className="text-xs text-text-muted">{c.email}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-black text-text-dark">{c.sessions}</span>
                    </td>
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <span className="text-sm font-bold text-primary">Rp {(c.totalSpent / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <span className="text-xs text-text-secondary">{new Date(c.lastVisit).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full border", tag.bg, tag.text, tag.border)}>
                        {tag.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 text-text-muted hover:text-primary transition-colors" onClick={e => { e.stopPropagation(); setSelected(c); }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-text-muted">{filtered.length} of {customers.length} customers</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={cn("w-7 h-7 rounded-lg text-xs font-bold transition-colors", p === 1 ? "bg-primary text-white" : "bg-gray-50 text-text-secondary hover:bg-gray-100")}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col"
            >
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-text-dark text-lg">Customer Profile</h3>
                  <button onClick={() => setSelected(null)} className="p-1.5 text-text-muted hover:text-text-dark">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: selected.color }}>
                    {selected.initials}
                  </div>
                  <div>
                    <h4 className="font-black text-text-dark text-lg">{selected.name}</h4>
                    <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full border", TAG_STYLES[selected.tag].bg, TAG_STYLES[selected.tag].text, TAG_STYLES[selected.tag].border)}>
                      {TAG_STYLES[selected.tag].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-5 grid grid-cols-3 gap-3 border-b border-gray-100">
                {[
                  { label: 'Sessions', value: selected.sessions, color: 'text-primary' },
                  { label: 'Spent', value: `Rp ${(selected.totalSpent / 1000).toFixed(0)}K`, color: 'text-green-600' },
                  { label: 'Rating', value: `${selected.avgRating}★`, color: 'text-amber-500' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={cn("text-lg font-black", s.color)}>{s.value}</p>
                    <p className="text-[10px] font-bold text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="p-5 space-y-3 border-b border-gray-100">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Contact Info</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Phone size={14} className="text-text-secondary" /></div>
                  <span className="text-sm text-text-dark">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Mail size={14} className="text-text-secondary" /></div>
                  <span className="text-sm text-text-dark">{selected.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Calendar size={14} className="text-text-secondary" /></div>
                  <span className="text-sm text-text-dark">Last visit: {new Date(selected.lastVisit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {selected.referrals > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center"><Gift size={14} className="text-violet-600" /></div>
                    <span className="text-sm text-violet-700 font-bold">{selected.referrals} successful referrals</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-5 space-y-2 mt-auto">
                <button className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                  <MessageSquare size={15} /> Send Message
                </button>
                <button className="w-full py-3 rounded-xl border border-gray-200 text-text-secondary font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                  <ImageIcon size={15} /> View Their Photos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
