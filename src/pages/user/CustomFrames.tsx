import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, Plus, Trash2, Check, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFrame } from '../../context/FrameContext';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '../../lib/utils';

export default function CustomFrames() {
  const { user } = useAuth();
  const { activeFrame, setActiveFrame } = useFrame();
  const [frames, setFrames] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [frameName, setFrameName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'frames'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const framesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFrames(framesData);
    });
    return unsubscribe;
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !frameName) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `frames/${user.uid}/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'frames'), {
        userId: user.uid,
        name: frameName,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      setFrameName('');
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'frames', id));
      if (activeFrame?.id === id) setActiveFrame(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-text-dark">Custom Frames</h1>
        <p className="text-text-secondary text-sm">Upload and manage your custom photobooth templates.</p>
      </header>

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
