import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Settings, 
  Save, 
  Check, 
  RefreshCw, 
  Monitor, 
  Printer, 
  Share2, 
  Smartphone,
  Info,
  ChevronRight,
  Wifi,
  Cpu
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PartnerSoftware() {
  const [activeTab, setActiveTab] = useState<'general' | 'hardware' | 'branding' | 'advanced'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [printers, setPrinters] = useState<any[]>([]);

  // Local state for settings (synced with localStorage)
  const [boothSettings, setBoothSettings] = useState({
    brand: 'FOTOGO',
    idleMessage: 'Tap Screen To Start',
    watermark: true,
    autoPrint: false,
    sessionLimit: 4,
    countdown: 3,
    cameraDeviceId: '',
    printerName: ''
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('fotogo_booth_settings');
    if (savedSettings) {
      setBoothSettings(JSON.parse(savedSettings));
    }
    
    // Simulate printer fetch (since we are back to web)
    setPrinters([
      { name: 'Canon SELPHY CP1300', status: 'Online' },
      { name: 'DNP DS620', status: 'Offline' }
    ]);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('fotogo_booth_settings', JSON.stringify(boothSettings));
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(true), 2000);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
              <Settings size={18} />
             </div>
             <h1 className="text-2xl font-black tracking-tight text-gray-900">Booth Configuration</h1>
          </div>
          <p className="text-gray-500 text-sm">Manage your hardware, branding, and session behavior.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg",
            saved 
              ? "bg-green-500 text-white shadow-green-100" 
              : "bg-gray-900 text-white hover:bg-black shadow-gray-200"
          )}
        >
          {isSaving ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : saved ? (
            <Check size={18} />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'Saving...' : saved ? 'Settings Saved' : 'Save Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <TabButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
            icon={Monitor}
            label="General"
            desc="Session & Limits"
          />
          <TabButton 
            active={activeTab === 'hardware'} 
            onClick={() => setActiveTab('hardware')}
            icon={Cpu}
            label="Hardware"
            desc="Camera & Printer"
          />
          <TabButton 
            active={activeTab === 'branding'} 
            onClick={() => setActiveTab('branding')}
            icon={Camera}
            label="Branding"
            desc="Watermarks & Logos"
          />
          <TabButton 
            active={activeTab === 'advanced'} 
            onClick={() => setActiveTab('advanced')}
            icon={Wifi}
            label="Cloud & Sync"
            desc="API & Remote"
          />
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div 
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SectionTitle title="Session Settings" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Session Photo Limit" 
                      type="number"
                      value={boothSettings.sessionLimit}
                      onChange={(val) => setBoothSettings({...boothSettings, sessionLimit: parseInt(val)})}
                    />
                    <InputField 
                      label="Countdown Timer (s)" 
                      type="number"
                      value={boothSettings.countdown}
                      onChange={(val) => setBoothSettings({...boothSettings, countdown: parseInt(val)})}
                    />
                  </div>
                  <ToggleRow 
                    label="Show Gallery Button" 
                    desc="Allow users to browse previous photos in session"
                    checked={true}
                  />
                </motion.div>
              )}

              {activeTab === 'hardware' && (
                <motion.div 
                  key="hardware"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <SectionTitle title="Connected Devices" />
                  <SelectField 
                    label="Camera Device"
                    options={[
                      { value: 'default', label: 'FaceTime HD Camera' },
                      { value: 'external', label: 'Logitech Brio 4K' }
                    ]}
                    value={boothSettings.cameraDeviceId}
                    onChange={(val) => setBoothSettings({...boothSettings, cameraDeviceId: val})}
                  />
                  <div className="pt-4 space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Printers</p>
                    {printers.map(p => (
                      <div key={p.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Printer className="text-gray-400" size={20} />
                          <span className="font-bold text-sm text-gray-700">{p.name}</span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                          p.status === 'Online' ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
                        )}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'branding' && (
                <motion.div 
                  key="branding"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <SectionTitle title="Booth Identity" />
                  <InputField 
                    label="Brand Name" 
                    value={boothSettings.brand}
                    onChange={(val) => setBoothSettings({...boothSettings, brand: val})}
                  />
                  <InputField 
                    label="Idle Screen Message" 
                    value={boothSettings.idleMessage}
                    onChange={(val) => setBoothSettings({...boothSettings, idleMessage: val})}
                  />
                  <ToggleRow 
                    label="Apply Watermark" 
                    desc="Automatically add brand logo to all photos"
                    checked={boothSettings.watermark}
                    onChange={(val) => setBoothSettings({...boothSettings, watermark: val})}
                  />
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div 
                  key="advanced"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <SectionTitle title="Advanced Configuration" />
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                    <Info className="text-blue-500 shrink-0" size={24} />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Cloud Sync Active</p>
                      <p className="text-xs text-blue-700 mt-1">All settings are automatically synced to your FotoGo cloud account for remote management.</p>
                    </div>
                  </div>
                  <ToggleRow label="Enable QR sharing" checked={true} />
                  <ToggleRow label="Debug Mode" checked={false} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left",
        active ? "bg-white border border-gray-200 shadow-sm" : "hover:bg-white/50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-pink-600 text-white shadow-lg shadow-pink-100" : "bg-gray-100 text-gray-400"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <p className={cn("text-sm font-bold", active ? "text-gray-900" : "text-gray-500")}>{label}</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{desc}</p>
      </div>
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h3 className="text-lg font-black tracking-tight text-gray-900">{title}</h3>
      <div className="h-px bg-gray-100 flex-1" />
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all font-medium"
      />
    </div>
  );
}

function SelectField({ label, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all font-medium appearance-none"
      >
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-t border-gray-50 first:border-0">
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => onChange && onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full relative transition-all",
          checked ? "bg-pink-600" : "bg-gray-200"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
          checked ? "left-[26px]" : "left-1"
        )} />
      </button>
    </div>
  );
}
