import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Camera, X, CheckCircle2, Share2, Download, Image as ImageIcon, MapPin, Zap, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrame } from '../../context/FrameContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Scan() {
  const { user, login } = useAuth();
  const { activeFrame } = useFrame();
  const [scanning, setScanning] = useState(true);
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  // Step 1: Scan QR
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setConnected(true);
      }, 2500); // Simulate network request
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  if (!activeFrame) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
          <ImageIcon size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-dark">Belum Ada Frame Aktif</h2>
          <p className="text-text-secondary text-sm">Pilih frame custom dari galeri Anda terlebih dahulu sebelum memindai mesin photobooth.</p>
        </div>
        <button 
          onClick={() => navigate('/frames')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          Go to Frames
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-black relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-30">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <X size={20} />
        </button>
        <h2 className="text-white font-bold">
          {scanning ? "Scan QR Mesin" : "Terhubung"}
        </h2>
        <div className="w-10" />
      </header>

      <AnimatePresence mode="wait">
        {scanning ? (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 relative z-10"
          >
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-2 border-white/30 rounded-3xl" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              <motion.div 
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute left-4 right-4 h-1 bg-primary shadow-[0_0_15px_rgba(79,140,255,0.8)] z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <QrCode size={120} className="text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white font-bold text-lg">Arahkan ke Layar Mesin</p>
              <p className="text-white/60 text-sm">Frame <span className="text-primary font-bold">"{activeFrame?.name}"</span> akan otomatis dikirim ke mesin.</p>
            </div>
          </motion.div>
        ) : connected ? (
          <motion.div 
            key="connected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 relative z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full" />
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-green-500">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
            </div>

            <div className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <h2 className="text-3xl font-black text-white">Berhasil!</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Frame <span className="text-primary font-bold">"{activeFrame?.name}"</span> telah berhasil diterapkan ke mesin <strong>FotoGo Malang Center</strong>.
              </p>
              
              <div className="bg-black/30 p-4 rounded-xl mt-4">
                <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-2">Instruksi Selanjutnya</p>
                <p className="text-white text-sm font-medium">
                  Silakan lihat ke layar mesin dan tekan tombol <span className="bg-primary px-2 py-0.5 rounded text-white text-xs">Mulai Foto</span> di layar mesin.
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white text-text-dark py-4 rounded-2xl font-bold shadow-lg mt-8 hover:bg-soft-gray transition-colors"
            >
              Kembali ke Beranda
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
