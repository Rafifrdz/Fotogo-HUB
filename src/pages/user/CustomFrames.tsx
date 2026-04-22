import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, Plus, Trash2, Check, Star, Download, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFrame } from '../../context/FrameContext';
import { cn } from '../../lib/utils';

export default function CustomFrames() {
  const { user } = useAuth();
  const { activeFrame, setActiveFrame } = useFrame();
  const [frames, setFrames] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [frameName, setFrameName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load mock frames from localStorage
    const savedFrames = localStorage.getItem('mock_frames');
    if (savedFrames) {
      setFrames(JSON.parse(savedFrames));
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !frameName) return;

    setUploading(true);

    // Simulate upload delay for realistic UX
    setTimeout(() => {
      const newFrame = {
        id: Date.now().toString(),
        userId: user?.uid || 'guest',
        name: frameName,
        imageUrl: URL.createObjectURL(selectedFile),
        createdAt: new Date().toISOString()
      };

      const updatedFrames = [newFrame, ...frames];
      setFrames(updatedFrames);
      localStorage.setItem('mock_frames', JSON.stringify(updatedFrames));

      setFrameName('');
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploading(false);
      alert("Frame berhasil disimpan ke galeri!");
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    const updatedFrames = frames.filter(f => f.id !== id);
    setFrames(updatedFrames);
    localStorage.setItem('mock_frames', JSON.stringify(updatedFrames));
    if (activeFrame?.id === id) setActiveFrame(null);
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-black text-text-dark">Custom Frames</h1>
        <p className="text-text-secondary text-sm">Upload template Anda dan jadikan border otomatis di foto!</p>
      </header>

      {/* ── Live Preview Studio ─────────────────────────────────────────── */}
      {activeFrame && (
        <section className="bg-gradient-to-br from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-primary flex items-center gap-2">
              <Star size={18} className="fill-primary" /> Live Preview Studio
            </h3>
            <span className="text-[10px] bg-white px-2 py-1 rounded-full text-primary font-bold shadow-sm">Frame Aktif: {activeFrame.name}</span>
          </div>

          <div
            className="aspect-[3/4] bg-gray-200 rounded-2xl relative overflow-hidden shadow-lg group cursor-pointer"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {/* Foto User (Background) */}
            {previewPhotoUrl ? (
              <img src={previewPhotoUrl} alt="Your Photo" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <p className="text-xs font-bold">Tap untuk upload foto Anda</p>
                <p className="text-[10px]">Lihat hasil frame-nya disini</p>
              </div>
            )}

            {/* Frame Overlay (Border) */}
            <img
              src={activeFrame.imageUrl}
              alt="Overlay Frame"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none drop-shadow-lg"
              referrerPolicy="no-referrer"
            />

            {/* Change photo hint */}
            {previewPhotoUrl && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Tap untuk ganti foto
              </div>
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </section>
      )}

      {/* ── Template Guide ──────────────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <h3 className="font-bold text-text-dark flex items-center gap-2 mb-2">
            <Info size={18} className="text-primary" /> Panduan Desain (Blueprint)
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Agar foto Anda pas di dalam frame, ikuti panduan ukuran ini saat mendesain di Canva atau Photoshop. Ingat, bagian kotak foto **wajib transparan (bolong)**.
          </p>

          <div className="flex gap-4 items-center">
            {/* Visual Guide CSS */}
            <div className="w-20 bg-gray-100 p-2 rounded-lg border-2 border-dashed border-gray-300 flex flex-col gap-2 shrink-0">
              <div className="aspect-[4/3] bg-white/50 border border-gray-300 rounded flex items-center justify-center">
                <span className="text-[8px] text-gray-400 font-bold">Transparan</span>
              </div>
              <div className="aspect-[4/3] bg-white/50 border border-gray-300 rounded flex items-center justify-center">
                <span className="text-[8px] text-gray-400 font-bold">Transparan</span>
              </div>
              <div className="aspect-[4/3] bg-white/50 border border-gray-300 rounded flex items-center justify-center">
                <span className="text-[8px] text-gray-400 font-bold">Transparan</span>
              </div>
              <div className="h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-[8px] text-primary font-bold">Logo/Teks</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="bg-soft-gray p-3 rounded-xl">
                <p className="text-xs font-bold text-text-dark mb-1">Standard 2x6 Strip</p>
                <p className="text-[10px] text-text-secondary">Resolusi: 600 x 1800 pixel</p>
              </div>
              <button
                onClick={() => alert('sek cak gorong update')}
                className="w-full bg-white border-2 border-primary text-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors active:scale-95"
              >
                <Download size={14} /> Download Blueprint
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-text-dark flex items-center gap-2">
          <Upload size={18} className="text-primary" /> Upload New Frame
        </h3>

        <div className="space-y-4">
          <div
            className="aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('frame-upload')?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <>
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <p className="text-xs font-bold text-text-dark mt-2">Choose PNG/JPG Frame</p>
                <p className="text-[10px] text-text-secondary">Transparent areas will show the photo</p>
              </>
            )}
            <input
              id="frame-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <input
            type="text"
            placeholder="Frame Name (e.g. Birthday 2026)"
            value={frameName}
            onChange={(e) => setFrameName(e.target.value)}
            className="w-full bg-soft-gray border-none rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !frameName}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? "Uploading..." : "Save to Gallery"}
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-text-dark">Your Frame Gallery</h3>
        <div className="grid grid-cols-2 gap-4">
          {frames.map((frame) => (
            <motion.div
              key={frame.id}
              layout
              className={cn(
                "bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all relative group",
                activeFrame?.id === frame.id ? "border-primary" : "border-gray-100"
              )}
            >
              <div className="aspect-square bg-soft-gray relative">
                <img src={frame.imageUrl} alt={frame.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveFrame(frame)}
                    className="p-2 bg-primary text-white rounded-full shadow-lg"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(frame.id)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {activeFrame?.id === frame.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-md">
                    <Star size={12} className="fill-white" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-text-dark truncate">{frame.name}</p>
                <p className="text-[10px] text-text-secondary">Custom Template</p>
              </div>
            </motion.div>
          ))}
          {frames.length === 0 && (
            <div className="col-span-2 py-12 text-center space-y-2">
              <ImageIcon size={48} className="mx-auto text-gray-200" />
              <p className="text-sm text-text-secondary">No frames yet. Upload your first one!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
