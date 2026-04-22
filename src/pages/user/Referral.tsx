import { motion } from 'motion/react';
import { MOCK_USER, MOCK_REWARDS } from '../../mockData';
import { Gift, Share2, Copy, Check, ArrowRight, Award, Coins, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Referral() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MOCK_USER.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = (MOCK_USER.points / 500) * 100; // out of max reward

  return (
    <div className="min-h-screen bg-soft-gray">

      {/* ── Hero Header — Gojek GoPay style ────────────────────────────── */}
      <div className="hero-gradient-warm px-5 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-4 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-white text-xl font-bold mb-0.5">Reward & Referral</h1>
          <p className="text-white/70 text-xs">Kumpulkan poin, dapatkan sesi gratis!</p>
        </div>
      </div>

      <div className="px-5 -mt-16 pb-8 space-y-4">

        {/* ── Points Balance Card — Gojek GoPay card ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-text-secondary font-medium">Saldo Memory Poin</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Coins size={22} className="text-gold fill-gold" />
                <span className="text-3xl font-black text-text-dark">{MOCK_USER.points}</span>
                <span className="text-sm text-text-secondary font-medium">poin</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center">
              <Award size={24} className="text-primary" />
            </div>
          </div>

          {/* Progress to next reward */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Menuju Reward Berikutnya</span>
              <span className="text-primary">50 poin lagi</span>
            </div>
            <div className="h-2 w-full bg-soft-gray rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <p className="text-[10px] text-text-muted">Sesi gratis dalam {50} poin lagi</p>
          </div>
        </motion.div>

        {/* ── Referral Code Card — Gojek style ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-card space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
              <Share2 size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text-dark">Undang Teman</h3>
              <p className="text-xs text-text-secondary">Kamu & temanmu dapat 100 poin per undangan</p>
            </div>
          </div>

          {/* Code display */}
          <div className="flex gap-2">
            <div className="flex-1 bg-primary-light border border-dashed border-primary/30 rounded-xl px-4 py-3 font-mono font-black text-primary text-sm flex items-center justify-center tracking-widest">
              {MOCK_USER.referralCode}
            </div>
            <button
              id="referral-copy-btn"
              onClick={copyToClipboard}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
                copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white shadow-primary shadow-md'
              )}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <button
            id="referral-whatsapp-btn"
            className="w-full bg-[#25D366] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md"
          >
            Bagikan ke WhatsApp <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* ── Available Rewards ─────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-text-dark px-1">Reward Tersedia</h3>
          <div className="space-y-3">
            {MOCK_REWARDS.map((reward, i) => {
              const canRedeem = MOCK_USER.points >= reward.points;
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                    canRedeem ? 'bg-primary-light' : 'bg-soft-gray'
                  )}>
                    <Gift size={26} className={canRedeem ? 'text-primary' : 'text-text-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-dark text-sm">{reward.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{reward.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Coins size={11} className="text-gold fill-gold" />
                      <span className="text-xs font-bold text-text-dark">{reward.points} poin</span>
                    </div>
                  </div>
                  <button
                    disabled={!canRedeem}
                    id={`reward-redeem-${reward.id}`}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0',
                      canRedeem
                        ? 'bg-primary text-white shadow-primary/25 shadow-md'
                        : 'bg-soft-gray text-text-muted cursor-not-allowed'
                    )}
                  >
                    Tukar
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── How it works strip ───────────────────────────────────────────── */}
        <div className="bg-primary-light rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-text-dark">Cara kerja poin</p>
            <p className="text-[10px] text-text-secondary mt-0.5">Setiap sesi foto = 50 poin. Ajak teman = +100 poin.</p>
          </div>
          <ChevronRight size={14} className="text-primary flex-shrink-0" />
        </div>

      </div>
    </div>
  );
}
