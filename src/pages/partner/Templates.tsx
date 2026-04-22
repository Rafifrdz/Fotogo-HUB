import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit2, Trash2, Copy, Eye, Star, Grid3X3, Layout,
  Image as ImageIcon, Palette, Type, Upload, Check, X,
  Layers, Sliders, Download, Lock, Unlock
} from 'lucide-react';
import { cn } from '../../lib/utils';

type TemplateType = 'strip' | 'collage' | 'single' | 'postcard';
type FilterView = 'all' | TemplateType;

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  layout: number[]; // cols x rows
  thumbnail: string;
  isPremium: boolean;
  isActive: boolean;
  overlayColor: string;
  textColor: string;
  logoEnabled: boolean;
  createdAt: string;
}

const SAMPLE_TEMPLATES: Template[] = [
  { id: '1', name: 'Classic Strip 4x1', type: 'strip', layout: [1, 4], thumbnail: '', isPremium: false, isActive: true, overlayColor: '#ffffff', textColor: '#1A1A2E', logoEnabled: true, createdAt: '2026-04-01' },
  { id: '2', name: 'Duo Layout', type: 'collage', layout: [2, 2], thumbnail: '', isPremium: false, isActive: true, overlayColor: '#000000', textColor: '#ffffff', logoEnabled: true, createdAt: '2026-04-05' },
  { id: '3', name: 'Single Portrait', type: 'single', layout: [1, 1], thumbnail: '', isPremium: false, isActive: false, overlayColor: '#2492F0', textColor: '#ffffff', logoEnabled: true, createdAt: '2026-04-10' },
  { id: '4', name: 'Postcard 4R', type: 'postcard', layout: [1, 1], thumbnail: '', isPremium: true, isActive: false, overlayColor: '#F6C90E', textColor: '#1A1A2E', logoEnabled: true, createdAt: '2026-04-12' },
  { id: '5', name: 'Boomerang Strip', type: 'strip', layout: [1, 3], thumbnail: '', isPremium: false, isActive: true, overlayColor: '#FF6B6B', textColor: '#ffffff', logoEnabled: false, createdAt: '2026-04-15' },
  { id: '6', name: 'Festival Grid', type: 'collage', layout: [3, 2], thumbnail: '', isPremium: true, isActive: false, overlayColor: '#7C3AED', textColor: '#ffffff', logoEnabled: true, createdAt: '2026-04-18' },
];

const LAYOUT_ICONS: Record<TemplateType, React.ElementType> = {
  strip: Layers,
  collage: Grid3X3,
  single: ImageIcon,
  postcard: Layout,
};

const TYPE_LABELS: Record<TemplateType, string> = {
  strip: 'Photo Strip',
  collage: 'Collage',
  single: 'Single Print',
  postcard: 'Postcard',
};

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [filter, setFilter] = useState<FilterView>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', type: 'strip' as TemplateType, overlayColor: '#ffffff', textColor: '#1A1A2E', logoEnabled: true });

  const filtered = filter === 'all' ? templates : templates.filter(t => t.type === filter);

  const handleToggleActive = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleDuplicate = (t: Template) => {
    setTemplates(prev => [...prev, { ...t, id: Date.now().toString(), name: `${t.name} (Copy)`, isActive: false }]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Template = {
      ...newTemplate,
      id: Date.now().toString(),
      layout: newTemplate.type === 'strip' ? [1, 4] : newTemplate.type === 'collage' ? [2, 2] : [1, 1],
      thumbnail: '',
      isPremium: false,
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [...prev, created]);
    setShowCreateModal(false);
    setNewTemplate({ name: '', type: 'strip', overlayColor: '#ffffff', textColor: '#1A1A2E', logoEnabled: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-dark">Templates & Overlays</h2>
          <p className="text-text-secondary text-sm mt-1">Design print layouts, overlays, and branded frames for your booth.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-all">
            <Upload size={16} /> Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
          >
            <Plus size={16} /> New Template
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: templates.length, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'Active', value: templates.filter(t => t.isActive).length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Photo Strips', value: templates.filter(t => t.type === 'strip').length, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Premium', value: templates.filter(t => t.isPremium).length, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-3xl font-black mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'strip', 'collage', 'single', 'postcard'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              filter === f ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-gray-200 text-text-secondary hover:bg-gray-50"
            )}
          >
            {f === 'all' ? 'All Templates' : TYPE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(t => {
          const TypeIcon = LAYOUT_ICONS[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "bg-white rounded-2xl border-2 shadow-sm overflow-hidden group transition-all",
                t.isActive ? "border-primary/30" : "border-gray-200/80"
              )}
            >
              {/* Preview Area */}
              <div className="relative h-44 flex items-center justify-center" style={{ backgroundColor: t.overlayColor + '22' }}>
                {/* Visual Layout Preview */}
                <div className="flex flex-col items-center gap-1.5">
                  {Array.from({ length: t.layout[1] }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1.5">
                      {Array.from({ length: t.layout[0] }).map((_, colIdx) => (
                        <div
                          key={colIdx}
                          className="rounded-md border border-gray-300/60 flex items-center justify-center"
                          style={{
                            width: t.layout[0] === 1 ? 80 : 50,
                            height: t.layout[1] === 1 ? 90 : t.layout[1] <= 2 ? 55 : 40,
                            backgroundColor: t.overlayColor + '40',
                            borderColor: t.overlayColor + '80',
                          }}
                        >
                          <ImageIcon size={t.layout[0] === 1 ? 24 : 16} style={{ color: t.overlayColor === '#ffffff' ? '#999' : t.overlayColor }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {t.isPremium && (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full">
                      <Star size={9} fill="currentColor" /> PRO
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] font-black px-2 py-1 rounded-full",
                    t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {t.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPreviewId(t.id)}
                    className="p-2.5 bg-white rounded-xl hover:scale-110 transition-transform"
                    title="Preview"
                  >
                    <Eye size={16} className="text-text-dark" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(t)}
                    className="p-2.5 bg-white rounded-xl hover:scale-110 transition-transform"
                    title="Duplicate"
                  >
                    <Copy size={16} className="text-text-dark" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2.5 bg-red-50 rounded-xl hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <TypeIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark leading-tight">{t.name}</p>
                    <p className="text-[11px] text-text-muted">{TYPE_LABELS[t.type]} · {t.layout[0]}×{t.layout[1]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: t.overlayColor }} title="Overlay color" />
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: t.textColor }} title="Text color" />
                  </div>
                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(t.id)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors flex items-center px-0.5 shrink-0",
                      t.isActive ? "bg-primary" : "bg-gray-200"
                    )}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: t.isActive ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add Blank Template Card */}
        <motion.button
          layout
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl h-[calc(100%+0px)] min-h-[200px] flex flex-col items-center justify-center gap-3 text-text-muted hover:border-primary hover:text-primary hover:bg-primary/3 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold">Create New Template</p>
        </motion.button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-text-dark">New Template</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-dark">
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Template Name</label>
                    <input
                      type="text" required
                      placeholder="e.g. Summer Vibes Strip"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      value={newTemplate.name}
                      onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['strip', 'collage', 'single', 'postcard'] as const).map(type => {
                        const Icon = LAYOUT_ICONS[type];
                        return (
                          <button
                            key={type} type="button"
                            onClick={() => setNewTemplate({ ...newTemplate, type })}
                            className={cn(
                              "py-3 px-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2",
                              newTemplate.type === type ? "bg-primary-light border-primary text-primary" : "bg-white border-gray-100 text-text-secondary hover:border-gray-200"
                            )}
                          >
                            <Icon size={15} />
                            {TYPE_LABELS[type]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Overlay Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newTemplate.overlayColor}
                          onChange={e => setNewTemplate({ ...newTemplate, overlayColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                        />
                        <span className="text-sm font-mono text-text-secondary">{newTemplate.overlayColor}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newTemplate.textColor}
                          onChange={e => setNewTemplate({ ...newTemplate, textColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                        />
                        <span className="text-sm font-mono text-text-secondary">{newTemplate.textColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-text-dark">Show FotoGo Logo</p>
                      <p className="text-xs text-text-muted">Adds branding watermark to prints</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewTemplate({ ...newTemplate, logoEnabled: !newTemplate.logoEnabled })}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0",
                        newTemplate.logoEnabled ? "bg-primary" : "bg-gray-300"
                      )}
                    >
                      <motion.div
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: newTemplate.logoEnabled ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3.5 rounded-2xl font-black shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform mt-2"
                  >
                    Create Template
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewId && (() => {
          const t = templates.find(tp => tp.id === previewId)!;
          if (!t) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewId(null)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-text-dark">{t.name}</h3>
                    <button onClick={() => setPreviewId(null)}><X size={20} className="text-text-muted" /></button>
                  </div>
                  <div className="rounded-2xl p-6 flex items-center justify-center min-h-48" style={{ backgroundColor: t.overlayColor }}>
                    <div className="flex flex-col items-center gap-2">
                      {Array.from({ length: t.layout[1] }).map((_, rowIdx) => (
                        <div key={rowIdx} className="flex gap-2">
                          {Array.from({ length: t.layout[0] }).map((_, colIdx) => (
                            <div
                              key={colIdx}
                              className="rounded-lg border-2 border-white/40 bg-white/20 flex items-center justify-center"
                              style={{ width: 80, height: 70 }}
                            >
                              <ImageIcon size={28} color={t.textColor} />
                            </div>
                          ))}
                        </div>
                      ))}
                      {t.logoEnabled && (
                        <p className="text-xs font-black mt-2 tracking-widest" style={{ color: t.textColor }}>FOTOGO</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-text-secondary hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                      <Download size={14} /> Export
                    </button>
                    <button onClick={() => handleToggleActive(t.id)} className={cn(
                      "py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2",
                      t.isActive ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                    )}>
                      {t.isActive ? <><X size={14} /> Deactivate</> : <><Check size={14} /> Set Active</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
