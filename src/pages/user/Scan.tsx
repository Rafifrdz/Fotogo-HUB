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
  const [sessionActive, setSessionActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Step 1: Scan QR
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setSessionActive(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  // Step 2: Start Camera Session
  useEffect(() => {
    if (sessionActive && !capturedPhoto) {
      startCamera();
    }
    return () => stopCamera();
  }, [sessionActive, capturedPhoto]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !activeFrame) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay active frame
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = activeFrame.imageUrl;
    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      setCapturedPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
    };
  };

  const saveToMemories = async () => {
    if (!user || !capturedPhoto) {
      if (!user) login();
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'sessions'), {
        userId: user.uid,
        frameId: activeFrame?.id || 'default',
        photoUrl: capturedPhoto, // In real app, upload to storage first
        createdAt: new Date().toISOString()
      });
      navigate('/memories');
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setSaving(false);
    }
  };

  if (!activeFrame && !capturedPhoto) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
          <ImageIcon size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-dark">No Frame Selected</h2>
          <p className="text-text-secondary text-sm">Please select a custom frame from your gallery before starting a session.</p>
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
          {scanning ? "Scan Booth QR" : sessionActive && !capturedPhoto ? "Pose Now!" : "Result"}
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
              <p className="text-white font-bold text-lg">Scan Photobooth QR</p>
              <p className="text-white/60 text-sm">Your selected frame <span className="text-primary font-bold">"{activeFrame?.name}"</span> will be applied automatically.</p>
            </div>
          </motion.div>
        ) : sessionActive && !capturedPhoto ? (
          <motion.div 
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 relative flex flex-col"
          >
            {/* Camera Preview */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            
            {/* Frame Overlay */}
            {activeFrame && (
              <img 
                src={activeFrame.imageUrl} 
                alt="Frame Overlay" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <Zap size={24} />
              </button>
              <button 
                onClick={takePhoto}
                className="w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
              >
                <div className="w-14 h-14 bg-primary rounded-full" />
              </button>
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <RefreshCw size={24} />
              </button>
            </div>
          </motion.div>
        ) : capturedPhoto ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white rounded-t-[3rem] p-8 space-y-8 relative z-20 mt-12 overflow-y-auto"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold text-text-dark">Perfect Shot!</h2>
            </div>

            <div className="aspect-[3/4] bg-soft-gray rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img src={capturedPhoto} alt="Result" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <button 
                onClick={saveToMemories}
                disabled={saving}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                {saving ? "Saving..." : <><ImageIcon size={20} /> Save to Memories</>}
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setCapturedPhoto(null); setSessionActive(true); }}
                  className="flex-1 bg-soft-gray text-text-dark py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Retake
                </button>
                <button className="flex-1 bg-soft-gray text-text-dark py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Share2 size={20} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
