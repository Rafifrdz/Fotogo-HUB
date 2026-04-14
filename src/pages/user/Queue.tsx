import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Users, 
  Clock, 
  AlertCircle, 
  HelpCircle,
  Bell,
  X,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_BOOTHS } from '../../mockData';

export default function Queue() {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const booth = MOCK_BOOTHS.find(b => b.id === boothId) || MOCK_BOOTHS[0];
  
  const [isJoined, setIsJoined] = useState(false);
  const [position, setPosition] = useState(5);
  const [waitTime, setWaitTime] = useState(25);
  const [showHelp, setShowHelp] = useState(false);

  // Simulate queue movement
  useEffect(() => {
    if (isJoined && position > 1) {
      const timer = setInterval(() => {
        setPosition(p => Math.max(1, p - 1));
        setWaitTime(t => Math.max(5, t - 5));
      }, 10000); // Move every 10s for demo
      return () => clearInterval(timer);
    }
  }, [isJoined, position]);

  const handleJoin = () => {
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-soft-gray flex flex-col">
      {/* Header */}
      <header className="bg-white p-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-dark">Live Queue</h1>
            <p className="text-xs text-text-secondary">{booth.name}</p>
          </div>
        </div>
        <button onClick={() => setShowHelp(true)} className="text-primary p-2">
          <HelpCircle size={24} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {!isJoined ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center space-y-6">
              <div className="w-24 h-24 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
                <Users size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-dark">Join the Queue</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  There are currently <span className="text-primary font-bold">4 people</span> waiting. 
                  Estimated wait time is <span className="text-primary font-bold">25 minutes</span>.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-soft-gray p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Position</p>
                  <p className="text-xl font-bold text-text-dark">#5</p>
                </div>
                <div className="bg-soft-gray p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Wait Time</p>
                  <p className="text-xl font-bold text-text-dark">~25m</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
              <Bell size={20} className="text-primary shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                We'll notify you when it's almost your turn. You can explore nearby while waiting!
              </p>
            </div>

            <button 
              onClick={handleJoin}
              className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              Join Queue Now
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Queue Progress Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24" />
              
              <div className="relative space-y-8 text-center">
                <div className="relative inline-block">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-100"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * (5 - position + 1)) / 5}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Position</span>
                    <span className="text-4xl font-black text-text-dark">#{position}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-dark">You're in line!</h2>
                  <p className="text-sm text-text-secondary">Estimated wait: <span className="text-primary font-bold">{waitTime} mins</span></p>
                </div>

                <div className="pt-4 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={cn(
                      "w-2 h-2 rounded-full",
                      5 - i < position ? "bg-gray-200" : "bg-primary animate-pulse"
                    )} />
                  ))}
                </div>
              </div>
            </div>

            {/* Status Updates */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest px-2">Live Updates</h3>
              <div className="bg-white rounded-3xl shadow-sm divide-y divide-gray-50">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-sm font-medium text-text-dark">Queue joined successfully</p>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <p className="text-sm font-medium text-text-dark">Estimated wait time updated</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsJoined(false)}
              className="w-full bg-white text-red-500 py-4 rounded-2xl font-bold border-2 border-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} /> Leave Queue
            </button>
          </motion.div>
        )}

        {/* Guided Mode Modal */}
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 space-y-6"
            >
              <div className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mx-auto">
                <HelpCircle size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-text-dark">How it works</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  1. Join the queue to save your spot.<br/>
                  2. We'll notify you when you're #2.<br/>
                  3. Head to the booth and show your ID.<br/>
                  4. Pay and enjoy your session!
                </p>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold"
              >
                Got it!
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
