import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Save, Check, User, Building, Lock, Bell, Globe, CreditCard,
  Shield, Palette, Clock, Camera, AlertTriangle, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

type Section = 'profile' | 'booth' | 'session' | 'notifications' | 'billing' | 'security';

export default function BoothSettings() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ boothName: 'Braga Vibes Studio', ownerName: 'Budi Santoso', email: 'budi@bragavibes.com', phone: '+62 812-3456-7890', address: 'Jl. Braga No. 12, Bandung', website: 'bragavibes.com' });
  const [session, setSession] = useState({ maxPhotos: 4, countdownSecs: 3, autoResetMins: 3, flashEnabled: true, soundEnabled: true, idleMessage: 'Tap to Start Your Session!', brand: 'BRAGA VIBES', watermark: true });
  const [notifications, setNotifications] = useState({ newBooking: true, lowPaper: true, sessionComplete: false, dailySummary: true, reviewAlert: true });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: 'profile', icon: User, label: 'Profile & Business' },
    { id: 'booth', icon: Palette, label: 'Booth Branding' },
    { id: 'session', icon: Camera, label: 'Session Config' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'billing', icon: CreditCard, label: 'Billing & Plan' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-text-dark">Settings</h2>
          <p className="text-text-secondary text-sm mt-1">Manage your booth, account, and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all",
            saved ? "bg-green-500 text-white shadow-green-500/20" : "bg-primary text-white shadow-primary/25 hover:scale-105"
          )}
        >
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <aside className="w-56 shrink-0 space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                activeSection === s.id ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-gray-200/80 text-text-secondary hover:bg-gray-50"
              )}
            >
              <s.icon size={16} className={activeSection === s.id ? "text-white" : "text-text-muted"} />
              {s.label}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all mt-4">
            <LogOut size={16} /> Log Out
          </button>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-6">

          {/* PROFILE */}
          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Profile & Business</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Booth Name', key: 'boothName', placeholder: 'Your Studio Name' },
                  { label: 'Owner / PIC Name', key: 'ownerName', placeholder: 'Full Name' },
                  { label: 'Email Address', key: 'email', placeholder: 'email@example.com', type: 'email' },
                  { label: 'Phone Number', key: 'phone', placeholder: '+62 8xx-xxxx-xxxx' },
                  { label: 'Business Address', key: 'address', placeholder: 'Jl. ...' },
                  { label: 'Website / Instagram', key: 'website', placeholder: 'yoursite.com or @handle' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={(profile as any)[f.key]}
                      onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BOOTH BRANDING */}
          {activeSection === 'booth' && (
            <motion.div key="booth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Booth Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Brand Name (shown on prints)</label>
                  <input value={session.brand} onChange={e => setSession({ ...session, brand: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">Idle Screen Message</label>
                  <input value={session.idleMessage} onChange={e => setSession({ ...session, idleMessage: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-3">Logo Upload</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <Palette size={28} className="text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Drop your logo PNG here</p>
                    <p className="text-xs text-text-muted mt-1">Recommended: 512×512px transparent PNG</p>
                  </div>
                </div>
                <ToggleRow label="Show Watermark on Prints" desc="Adds your brand name to all printed photos"
                  value={session.watermark} onChange={() => setSession({ ...session, watermark: !session.watermark })} />
              </div>
            </motion.div>
          )}

          {/* SESSION CONFIG */}
          {activeSection === 'session' && (
            <motion.div key="session" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Session Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Max Photos per Session', key: 'maxPhotos', min: 1, max: 10 },
                  { label: 'Countdown (seconds)', key: 'countdownSecs', min: 1, max: 10 },
                  { label: 'Auto-Reset (minutes)', key: 'autoResetMins', min: 1, max: 10 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">{f.label}</label>
                    <input
                      type="number" min={f.min} max={f.max}
                      value={(session as any)[f.key]}
                      onChange={e => setSession({ ...session, [f.key]: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-2">
                <ToggleRow label="Flash Effect on Capture" desc="White flash animation when photo is taken"
                  value={session.flashEnabled} onChange={() => setSession({ ...session, flashEnabled: !session.flashEnabled })} />
                <ToggleRow label="Sound Effects" desc="Countdown beep and shutter sound"
                  value={session.soundEnabled} onChange={() => setSession({ ...session, soundEnabled: !session.soundEnabled })} />
              </div>
            </motion.div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <motion.div key="notif" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Notifications</h3>
              <div className="space-y-3">
                <ToggleRow label="New Booking Alert" desc="Notify when a customer makes a new booking"
                  value={notifications.newBooking} onChange={() => setNotifications({ ...notifications, newBooking: !notifications.newBooking })} />
                <ToggleRow label="Low Paper / Ink Warning" desc="Hardware alerts from the printer"
                  value={notifications.lowPaper} onChange={() => setNotifications({ ...notifications, lowPaper: !notifications.lowPaper })} />
                <ToggleRow label="Session Completed" desc="Get notified when each session finishes"
                  value={notifications.sessionComplete} onChange={() => setNotifications({ ...notifications, sessionComplete: !notifications.sessionComplete })} />
                <ToggleRow label="Daily Summary Report" desc="End-of-day recap sent to your email"
                  value={notifications.dailySummary} onChange={() => setNotifications({ ...notifications, dailySummary: !notifications.dailySummary })} />
                <ToggleRow label="New Review Alert" desc="Notify when a customer leaves a rating"
                  value={notifications.reviewAlert} onChange={() => setNotifications({ ...notifications, reviewAlert: !notifications.reviewAlert })} />
              </div>
            </motion.div>
          )}

          {/* BILLING */}
          {activeSection === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Billing & Plan</h3>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
                <p className="text-xs font-black uppercase tracking-widest opacity-70">Current Plan</p>
                <p className="text-3xl font-black mt-1">Partner Pro</p>
                <p className="text-sm opacity-80 mt-1">Renews on 1 May 2026 · Rp 299.000/mo</p>
                <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">
                  Manage Subscription
                </button>
              </div>
              <div className="space-y-3">
                {['Unlimited Booth Sessions', 'Photo Strip Templates (Unlimited)', 'AI Background Removal', 'Cloud Gallery Sync', 'Priority Support'].map(f => (
                  <div key={f} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Check size={16} className="text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-text-dark">{f}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">Upgrade to <strong>Partner Elite</strong> for DSLR tethering, multi-booth management, and advanced analytics.</p>
              </div>
            </motion.div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h3 className="text-lg font-black text-text-dark border-b border-gray-100 pb-3">Security</h3>
              <div className="space-y-4">
                {[
                  { label: 'Current Password', type: 'password', placeholder: '••••••••' },
                  { label: 'New Password', type: 'password', placeholder: '••••••••' },
                  { label: 'Confirm New Password', type: 'password', placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest block mb-2">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                ))}
                <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
                  <Lock size={15} /> Update Password
                </button>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <ToggleRow label="Kiosk PIN Lock" desc="Require PIN to exit kiosk fullscreen mode" value={true} onChange={() => {}} />
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors cursor-pointer" onClick={onChange}>
      <div>
        <p className="text-sm font-bold text-text-dark">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        className={cn("w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ml-4",
          value ? "bg-primary" : "bg-gray-300"
        )}
      >
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: value ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
      </button>
    </div>
  );
}
