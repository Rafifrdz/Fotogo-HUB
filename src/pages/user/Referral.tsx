import { motion } from 'motion/react';
import { MOCK_USER, MOCK_REWARDS } from '../../mockData';
import { Gift, Share2, Copy, Check, ArrowRight, Award, Coins } from 'lucide-react';
import { useState } from 'react';

export default function Referral() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MOCK_USER.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-text-dark">Rewards & Referral</h1>
        <p className="text-text-secondary text-sm">Earn points and get free sessions!</p>
      </header>

      {/* Points Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-primary-dark to-primary p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs font-medium">Your Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="text-yellow-400 fill-yellow-400" size={24} />
                <h2 className="text-3xl font-bold">{MOCK_USER.points}</h2>
                <span className="text-sm font-medium text-white/80">Memory Points</span>
              </div>
            </div>
            <Award size={48} className="text-white/20" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Next Reward: Free Session</span>
              <span>50 pts left</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[80%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Referral Code */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
            <Share2 size={20} />
          </div>
          <h3 className="font-bold text-text-dark">Invite Friends</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Share your code with friends. When they take their first photo, you both get <span className="text-primary font-bold">100 points</span>!
        </p>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-soft-gray rounded-xl px-4 py-3 font-mono font-bold text-primary flex items-center justify-center border border-dashed border-primary/30">
            {MOCK_USER.referralCode}
          </div>
          <button 
            onClick={copyToClipboard}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-lg'}`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        
        <button className="w-full bg-primary-light text-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
          Share to WhatsApp <ArrowRight size={16} />
        </button>
      </section>

      {/* Available Rewards */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Available Rewards</h3>
        <div className="space-y-4">
          {MOCK_REWARDS.map((reward) => (
            <div key={reward.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-primary">
                <Gift size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark text-sm">{reward.title}</h4>
                <p className="text-xs text-text-secondary">{reward.description}</p>
                <div className="flex items-center gap-1 mt-1 text-primary font-bold text-xs">
                  <Coins size={12} className="fill-primary" />
                  {reward.points} pts
                </div>
              </div>
              <button 
                disabled={MOCK_USER.points < reward.points}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${MOCK_USER.points >= reward.points ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
