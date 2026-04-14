import { motion, AnimatePresence } from 'motion/react';
import { Upload, QrCode, CheckCircle2, Copy, Share2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function PartnerUpload() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 2000);
  };

  const reset = () => {
    setSuccess(false);
    setFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-text-dark">Upload Session</h1>
        <p className="text-text-secondary text-sm">Upload photos from a photobooth session to generate a QR code for the customer.</p>
      </header>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div 
            key="upload-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Dropzone */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-dark">Session Photos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">Click or drag photos here</p>
                    <p className="text-xs text-text-secondary mt-1">Supports JPG, PNG (Max 10MB each)</p>
                  </div>
                  <input type="file" multiple className="hidden" />
                </div>
              </div>

              {/* Right: Session Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark">Booth Location</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Braga Vibes - Bandung</option>
                    <option>Braga Vibes - Jakarta</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark">Session Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 rounded-xl border-2 border-primary bg-primary-light text-primary font-bold text-xs">Standard</button>
                    <button className="p-3 rounded-xl border-2 border-gray-100 text-text-secondary font-bold text-xs hover:border-primary/30 transition-all">Premium</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark">Customer Email (Optional)</label>
                  <input 
                    type="email" 
                    placeholder="customer@example.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
              <button className="px-8 py-3 rounded-xl font-bold text-text-secondary hover:bg-gray-50 transition-colors">Cancel</button>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-primary text-white px-12 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>Generate QR Code <QrCode size={18} /></>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="upload-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl border border-gray-200 shadow-xl flex flex-col items-center text-center space-y-8"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 size={48} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-text-dark">Session Uploaded!</h2>
              <p className="text-text-secondary max-w-md mx-auto">The session is now ready. Show the QR code below to the customer so they can claim their photos.</p>
            </div>

            <div className="p-8 bg-soft-gray rounded-[2rem] border-4 border-white shadow-inner relative group">
              <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden">
                <QrCode size={200} className="text-text-dark" />
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-lg">
                     <Plus size={24} />
                   </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg">
                #PB-9285
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <button className="flex-1 bg-gray-100 text-text-dark py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <Copy size={20} /> Copy Link
              </button>
              <button className="flex-1 bg-gray-100 text-text-dark py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <Share2 size={20} /> Share
              </button>
            </div>

            <button 
              onClick={reset}
              className="text-primary font-bold hover:underline"
            >
              Upload Another Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
