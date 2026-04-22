import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Check, QrCode, Printer, CreditCard, Loader2, ChevronLeft, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

type KioskStep = 'IDLE' | 'FRAME_SELECT' | 'PAYMENT' | 'PAYMENT_WAITING' | 'COUNTDOWN' | 'CAPTURING' | 'REVIEW' | 'SHARE';

interface FrameOption {
  id: string; name: string; price: number; photos: number; layout: 'strip' | 'grid' | 'single';
  color: string; description: string;
}

const FRAMES: FrameOption[] = [
  { id: 'strip4', name: 'Classic Strip', price: 20000, photos: 4, layout: 'strip', color: '#2492F0', description: '4 foto strip klasik' },
  { id: 'strip3', name: 'Triple Strip', price: 15000, photos: 3, layout: 'strip', color: '#7C3AED', description: '3 foto strip' },
  { id: 'grid4', name: 'Grid 2×2', price: 25000, photos: 4, layout: 'grid', color: '#10B981', description: '4 foto collage' },
  { id: 'single', name: 'Portrait', price: 10000, photos: 1, layout: 'single', color: '#F59E0B', description: '1 foto portrait HD' },
];

const electronAPI = (window as any).electronAPI;

export default function BoothKiosk() {
  const [step, setStep] = useState<KioskStep>('IDLE');
  const [selectedFrame, setSelectedFrame] = useState<FrameOption | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [qrisUrl, setQrisUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending');
  const [shareQrData, setShareQrData] = useState('');
  const [printers, setPrinters] = useState<any[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const autoResetRef = useRef<NodeJS.Timeout | null>(null);

  // ── Camera ──
  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    try {
      const saved = localStorage.getItem('fotogo_booth_settings');
      let deviceId: string | undefined;
      if (saved) deviceId = JSON.parse(saved).cameraDeviceId;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, deviceId: deviceId ? { exact: deviceId } : undefined }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) { console.error('Camera error', err); }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (['COUNTDOWN', 'CAPTURING', 'REVIEW'].includes(step)) startCamera();
    return () => { if (step === 'IDLE') stopCamera(); };
  }, [step, startCamera, stopCamera]);

  // ── Capture ──
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.filter = 'none';
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 0.92)]);
  };

  // ── Countdown ──
  useEffect(() => {
    if (step !== 'COUNTDOWN') return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setStep('CAPTURING');
  }, [step, countdown]);

  // ── Capturing ──
  useEffect(() => {
    if (step !== 'CAPTURING' || !selectedFrame) return;
    capturePhoto();
    setTimeout(() => {
      if (currentPhotoIdx < selectedFrame.photos - 1) {
        setCurrentPhotoIdx(i => i + 1);
        setCountdown(3);
        setStep('COUNTDOWN');
      } else {
        stopCamera();
        setStep('REVIEW');
      }
    }, 600);
  }, [step, currentPhotoIdx]);

  // ── Payment via Pakasir QRIS ──
  const createPayment = async () => {
    const oid = `KIOSK-${Date.now()}`;
    setOrderId(oid);
    setPaymentStatus('pending');
    setStep('PAYMENT_WAITING');
    try {
      const res = await fetch('/api/pakasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'qris', order_id: oid, amount: selectedFrame!.price }),
      });
      const data = await res.json();
      if (data.qris_url || data.qr_url || data.payment_url) {
        setQrisUrl(data.qris_url || data.qr_url || data.payment_url);
        startPaymentPoll(oid);
      } else {
        // Fallback: simulate for demo
        setQrisUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO-PAY-${oid}`);
        setTimeout(() => { setPaymentStatus('paid'); }, 5000);
      }
    } catch {
      // Demo fallback
      setQrisUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO-PAY-${oid}`);
      setTimeout(() => { setPaymentStatus('paid'); }, 5000);
    }
  };

  const startPaymentPoll = (oid: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 120) { setPaymentStatus('expired'); clearInterval(pollRef.current!); return; }
      try {
        const res = await fetch(`https://app.pakasir.com/api/transactionstatus/${oid}`);
        const data = await res.json();
        if (data.status === 'paid' || data.status === 'settlement') {
          setPaymentStatus('paid');
          clearInterval(pollRef.current!);
        }
      } catch {}
    }, 3000);
  };

  // When paid → start photo session
  useEffect(() => {
    if (paymentStatus === 'paid' && step === 'PAYMENT_WAITING') {
      setTimeout(() => {
        setPhotos([]);
        setCurrentPhotoIdx(0);
        setCountdown(3);
        setStep('COUNTDOWN');
      }, 1500);
    }
  }, [paymentStatus, step]);

  // ── Share QR ──
  useEffect(() => {
    if (step === 'SHARE' && photos.length > 0) {
      const id = `session-${Date.now()}`;
      setShareQrData(`https://fotogo.app/gallery/${id}`);
      // Load printers
      if (electronAPI?.isElectron) {
        electronAPI.getPrinters().then((p: any[]) => setPrinters(p.filter((pr: any) => pr.isDefault || pr.status === 0)));
      }
      // Auto-reset after 60s
      autoResetRef.current = setTimeout(resetAll, 60000);
    }
    return () => { if (autoResetRef.current) clearTimeout(autoResetRef.current); };
  }, [step]);

  // ── Print ──
  const handlePrint = async () => {
    setIsPrinting(true);
    if (electronAPI?.isElectron && printers.length > 0) {
      await electronAPI.printSilent(printers[0].name);
    } else {
      window.print();
    }
    setTimeout(() => setIsPrinting(false), 2000);
  };

  // ── Reset ──
  const resetAll = () => {
    setStep('IDLE');
    setSelectedFrame(null);
    setPhotos([]);
    setCurrentPhotoIdx(0);
    setCountdown(3);
    setPaymentStatus('pending');
    setQrisUrl('');
    setOrderId('');
    setShareQrData('');
    stopCamera();
    if (pollRef.current) clearInterval(pollRef.current);
    if (autoResetRef.current) clearTimeout(autoResetRef.current);
  };

  const settings = JSON.parse(localStorage.getItem('fotogo_booth_settings') || '{}');
  const brand = settings.brand || 'FOTOGO';

  // ── Render photo layout ──
  const renderPhotoLayout = (photoList: string[], frame: FrameOption, size: 'sm' | 'lg') => {
    const w = size === 'lg' ? 'w-full' : 'w-full';
    if (frame.layout === 'strip') {
      return (
        <div className={cn("flex flex-col gap-1 bg-white p-2 rounded-lg", w)}>
          {photoList.map((p, i) => <img key={i} src={p} alt="" className="w-full aspect-[4/3] object-cover rounded" />)}
          <p className="text-center text-[10px] font-black tracking-[0.3em] text-gray-400 py-1">{brand}</p>
        </div>
      );
    }
    if (frame.layout === 'grid') {
      return (
        <div className={cn("bg-white p-2 rounded-lg", w)}>
          <div className="grid grid-cols-2 gap-1">
            {photoList.map((p, i) => <img key={i} src={p} alt="" className="w-full aspect-[4/3] object-cover rounded" />)}
          </div>
          <p className="text-center text-[10px] font-black tracking-[0.3em] text-gray-400 py-1">{brand}</p>
        </div>
      );
    }
    return (
      <div className={cn("bg-white p-2 rounded-lg", w)}>
        {photoList[0] && <img src={photoList[0]} alt="" className="w-full aspect-[3/4] object-cover rounded" />}
        <p className="text-center text-[10px] font-black tracking-[0.3em] text-gray-400 py-1">{brand}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col select-none print:bg-white print:text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Print view */}
      <div className="hidden print:flex items-center justify-center w-full h-full">
        {selectedFrame && renderPhotoLayout(photos, selectedFrame, 'lg')}
      </div>

      {/* Screen view */}
      <div className="flex-1 flex flex-col relative print:hidden w-full h-full">
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera bg */}
        {['COUNTDOWN', 'CAPTURING', 'REVIEW'].includes(step) && (
          <div className="absolute inset-0 z-0">
            <video ref={videoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover", step === 'REVIEW' ? 'blur-xl opacity-20' : '')} />
          </div>
        )}

        {/* Flash */}
        <AnimatePresence>
          {step === 'CAPTURING' && (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 z-50 bg-white pointer-events-none" />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full h-full">
          <AnimatePresence mode="wait">

            {/* ══════ IDLE ══════ */}
            {step === 'IDLE' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                className="text-center cursor-pointer absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black"
                onClick={() => setStep('FRAME_SELECT')}>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border-2 border-white/30 shadow-[0_0_60px_rgba(36,146,240,0.3)]">
                  <Camera size={56} className="text-white" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{brand}</h1>
                <div className="bg-white/10 backdrop-blur-sm px-8 py-3 rounded-full border border-white/20">
                  <p className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase">Tap untuk mulai</p>
                </div>
                <p className="text-white/30 text-sm mt-8">Powered by MitraGo</p>
              </motion.div>
            )}

            {/* ══════ FRAME SELECT ══════ */}
            {step === 'FRAME_SELECT' && (
              <motion.div key="frame" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full max-w-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black absolute inset-0 flex flex-col items-center justify-center p-8">
                <h2 className="text-3xl font-black mb-2">Pilih Frame</h2>
                <p className="text-white/50 mb-8">Pilih layout foto yang kamu mau</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  {FRAMES.map(f => (
                    <motion.button key={f.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedFrame(f); setStep('PAYMENT'); }}
                      className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 transition-all group">
                      {/* Mini layout preview */}
                      <div className="mb-3 flex justify-center">
                        <div className="bg-white/10 rounded-lg p-2" style={{ borderColor: f.color + '60', borderWidth: 2 }}>
                          {f.layout === 'strip' ? (
                            <div className="flex flex-col gap-0.5">
                              {Array.from({ length: f.photos }).map((_, i) => (
                                <div key={i} className="w-14 h-3 rounded-sm" style={{ backgroundColor: f.color + '40' }} />
                              ))}
                            </div>
                          ) : f.layout === 'grid' ? (
                            <div className="grid grid-cols-2 gap-0.5">
                              {Array.from({ length: f.photos }).map((_, i) => (
                                <div key={i} className="w-6 h-5 rounded-sm" style={{ backgroundColor: f.color + '40' }} />
                              ))}
                            </div>
                          ) : (
                            <div className="w-14 h-10 rounded-sm" style={{ backgroundColor: f.color + '40' }} />
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold">{f.name}</h3>
                      <p className="text-white/40 text-sm">{f.description}</p>
                      <p className="text-lg font-black mt-2" style={{ color: f.color }}>
                        Rp {f.price.toLocaleString('id-ID')}
                      </p>
                    </motion.button>
                  ))}
                </div>
                <button onClick={resetAll} className="mt-6 text-white/40 hover:text-white text-sm">← Kembali</button>
              </motion.div>
            )}

            {/* ══════ PAYMENT ══════ */}
            {step === 'PAYMENT' && selectedFrame && (
              <motion.div key="pay" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
                <h2 className="text-3xl font-black mb-2">Pembayaran</h2>
                <p className="text-white/50 mb-6">{selectedFrame.name} — {selectedFrame.photos} foto</p>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 w-full max-w-sm text-center">
                  <p className="text-white/50 text-sm mb-2">Total</p>
                  <p className="text-4xl font-black text-white mb-6">Rp {selectedFrame.price.toLocaleString('id-ID')}</p>
                  <button onClick={createPayment}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                    <CreditCard size={22} /> Bayar dengan QRIS
                  </button>
                </div>
                <button onClick={() => setStep('FRAME_SELECT')} className="mt-6 text-white/40 hover:text-white text-sm flex items-center gap-1">
                  <ChevronLeft size={14} /> Ganti frame
                </button>
              </motion.div>
            )}

            {/* ══════ PAYMENT WAITING (QRIS) ══════ */}
            {step === 'PAYMENT_WAITING' && (
              <motion.div key="qris" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
                {paymentStatus === 'pending' && (
                  <>
                    <h2 className="text-2xl font-black mb-2">Scan QRIS</h2>
                    <p className="text-white/50 mb-6">Scan kode QR berikut untuk membayar</p>
                    <div className="bg-white p-4 rounded-2xl mb-6">
                      {qrisUrl ? (
                        <img src={qrisUrl} alt="QRIS" className="w-64 h-64 object-contain" />
                      ) : (
                        <div className="w-64 h-64 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-gray-400" /></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-amber-400">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm font-bold">Menunggu pembayaran...</span>
                    </div>
                    <p className="text-white/30 text-xs mt-4">Order: {orderId}</p>
                    <button onClick={resetAll} className="mt-6 text-white/30 hover:text-white text-sm">Batalkan</button>
                  </>
                )}
                {paymentStatus === 'paid' && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/40">
                      <Check size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-green-400">Pembayaran Berhasil!</h2>
                    <p className="text-white/50 mt-2">Memulai sesi foto...</p>
                  </motion.div>
                )}
                {paymentStatus === 'expired' && (
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-red-400">Pembayaran Expired</h2>
                    <button onClick={resetAll} className="mt-4 px-6 py-3 bg-white/10 rounded-xl font-bold">Mulai Ulang</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════ COUNTDOWN ══════ */}
            {step === 'COUNTDOWN' && (
              <motion.div key="cd" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.span key={countdown} initial={{ scale: 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  className="text-[20rem] font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  {countdown}
                </motion.span>
                {selectedFrame && selectedFrame.photos > 1 && (
                  <div className="absolute top-10 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full font-bold tracking-widest uppercase border border-white/20">
                    Foto {currentPhotoIdx + 1} / {selectedFrame.photos}
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════ REVIEW ══════ */}
            {step === 'REVIEW' && selectedFrame && (
              <motion.div key="review" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 items-center justify-center p-6">
                <div className="flex-1 max-w-xs">
                  {renderPhotoLayout(photos, selectedFrame, 'lg')}
                </div>
                <div className="flex flex-col gap-3 w-full md:w-72">
                  <button onClick={() => setStep('SHARE')}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                    <Check size={28} /> Lanjut
                  </button>
                  <button onClick={() => { setPhotos([]); setCurrentPhotoIdx(0); setCountdown(3); startCamera(); setStep('COUNTDOWN'); }}
                    className="w-full bg-white/10 backdrop-blur border border-white/20 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3">
                    <RefreshCw size={22} /> Foto Ulang
                  </button>
                  <button onClick={resetAll} className="text-white/40 hover:text-white py-3 font-bold text-sm mt-2">Batalkan</button>
                </div>
              </motion.div>
            )}

            {/* ══════ SHARE ══════ */}
            {step === 'SHARE' && selectedFrame && (
              <motion.div key="share" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
                <h2 className="text-3xl font-black mb-8">Ambil Fotomu!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                  {/* Print */}
                  <button onClick={handlePrint} disabled={isPrinting}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-all disabled:opacity-50">
                    {isPrinting ? <Loader2 size={48} className="animate-spin" /> : <Printer size={48} />}
                    <h3 className="text-xl font-bold">{isPrinting ? 'Printing...' : 'Print Foto'}</h3>
                    <p className="text-white/40 text-sm">Cetak langsung dari printer</p>
                  </button>
                  {/* QR softfile */}
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-4">
                    <div className="bg-white p-3 rounded-xl">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareQrData)}`}
                        alt="QR" className="w-40 h-40" />
                    </div>
                    <h3 className="text-xl font-bold">Scan QR</h3>
                    <p className="text-white/40 text-sm text-center">Scan untuk download softfile & otomatis masuk ke galeri FotoGo</p>
                  </div>
                </div>
                <button onClick={resetAll}
                  className="mt-8 px-10 py-3 border border-white/20 hover:bg-white/10 rounded-full font-bold tracking-widest uppercase text-sm transition-all">
                  Selesai
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
