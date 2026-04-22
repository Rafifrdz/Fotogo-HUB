import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Repeat, 
  Share2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Calendar,
  MoreVertical,
  Plus,
  Pause,
  Play,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../../lib/utils';

const REVENUE_DATA = [
  { name: 'Mon', value: 1200000 },
  { name: 'Tue', value: 1500000 },
  { name: 'Wed', value: 1100000 },
  { name: 'Thu', value: 1800000 },
  { name: 'Fri', value: 2500000 },
  { name: 'Sat', value: 3800000 },
  { name: 'Sun', value: 4200000 },
];

const CUSTOMER_DATA = [
  { name: 'Repeat', value: 37, color: '#4F8CFF' },
  { name: 'New', value: 41, color: '#7DB8FF' },
  { name: 'Referral', value: 22, color: '#2F5FD0' },
];

const PEAK_HOURS_DATA = [
  { hour: '10am', count: 12 },
  { hour: '12pm', count: 25 },
  { hour: '2pm', count: 18 },
  { hour: '4pm', count: 32 },
  { hour: '6pm', count: 45 },
  { hour: '8pm', count: 58 },
  { hour: '10pm', count: 30 },
];

export default function PartnerDashboard() {
  const [status, setStatus] = useState<'available' | 'busy' | 'pause'>('available');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({ name: '', package: 'Standard', amount: 45000 });

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'pause') => {
    setStatus(newStatus);
    // In real app, update Firestore boothConfig
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create transaction and session
    setShowQuickAdd(false);
    setQuickAddForm({ name: '', package: 'Standard', amount: 45000 });
  };

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-text-dark">Welcome back, Braga Vibes!</h2>
          <p className="text-text-secondary text-sm mt-1">Here's what's happening at your booth today.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button 
              onClick={() => handleStatusChange('available')}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                status === 'available' ? "bg-green-500 text-white shadow-md" : "text-text-secondary hover:bg-gray-50"
              )}
            >
              <Play size={14} /> Available
            </button>
            <button 
              onClick={() => handleStatusChange('busy')}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                status === 'busy' ? "bg-amber-500 text-white shadow-md" : "text-text-secondary hover:bg-gray-50"
              )}
            >
              <AlertCircle size={14} /> Busy
            </button>
            <button 
              onClick={() => handleStatusChange('pause')}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                status === 'pause' ? "bg-red-500 text-white shadow-md" : "text-text-secondary hover:bg-gray-50"
              )}
            >
              <Pause size={14} /> Pause
            </button>
          </div>
          
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus size={16} /> Quick Add
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="Rp 18.4M" 
          change="+12.5%" 
          isPositive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Total Customers" 
          value="1,284" 
          change="+8.2%" 
          isPositive={true} 
          icon={Users} 
        />
        <StatCard 
          title="Repeat Rate" 
          value="37.4%" 
          change="-2.1%" 
          isPositive={false} 
          icon={Repeat} 
        />
        <StatCard 
          title="Referral Conversions" 
          value="242" 
          change="+15.4%" 
          isPositive={true} 
          icon={Share2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Queue Management */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Live Queue</h3>
              <p className="text-xs text-text-secondary">4 people waiting • Est. wait: 25 mins</p>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">Manage All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 1, name: 'Andi S.', status: 'called', time: '14:30', package: 'Premium' },
              { id: 2, name: 'Budi R.', status: 'waiting', time: '14:45', package: 'Standard' },
              { id: 3, name: 'Citra W.', status: 'waiting', time: '14:55', package: 'Premium' },
              { id: 4, name: 'Dedi K.', status: 'waiting', time: '15:10', package: 'Standard' },
            ].map((entry, idx) => (
              <div key={entry.id} className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                entry.status === 'called' ? "bg-primary-light border-primary/20" : "bg-gray-50 border-gray-100"
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark">{entry.name}</h4>
                    <p className="text-xs text-text-secondary">{entry.package} • Joined {entry.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.status === 'waiting' ? (
                    <>
                      <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">Call Now</button>
                      <button className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"><X size={18} /></button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                      <CheckCircle2 size={16} /> In Session
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suspicious Activity Alert */}
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">Suspicious Activity Detected</h4>
              <p className="text-xs text-red-700 mt-1">
                Customer <span className="font-bold">#USR-429</span> has high chat activity but no booking. 
                Possible bypass attempt. Please ensure all transactions are recorded in-app.
              </p>
              <button className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline">
                View Chat Log
              </button>
            </div>
          </div>
        </div>

        {/* Daily Insights */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-text-dark">Daily Insights</h3>
          <div className="space-y-6">
            <div className="h-40 w-full">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Peak Hours (Today)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PEAK_HOURS_DATA}>
                  <Bar dataKey="count" fill="#4F8CFF" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="hour" hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Popular Packages</h4>
              <div className="space-y-3">
                {[
                  { name: 'Standard', value: 65, color: 'bg-primary' },
                  { name: 'Premium', value: 25, color: 'bg-accent' },
                  { name: 'Group', value: 10, color: 'bg-primary-dark' },
                ].map((pkg) => (
                  <div key={pkg.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-text-dark">{pkg.name}</span>
                      <span className="text-text-secondary">{pkg.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn("h-full", pkg.color)} style={{ width: `${pkg.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-dark">Quick Add Customer</h3>
                  <button onClick={() => setShowQuickAdd(false)} className="text-text-secondary hover:text-text-dark">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleQuickAdd} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={quickAddForm.name}
                      onChange={(e) => setQuickAddForm({...quickAddForm, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Select Package</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Standard', 'Premium', 'Group', 'Custom'].map((pkg) => (
                        <button 
                          key={pkg}
                          type="button"
                          onClick={() => setQuickAddForm({...quickAddForm, package: pkg, amount: pkg === 'Standard' ? 45000 : pkg === 'Premium' ? 75000 : 100000})}
                          className={cn(
                            "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                            quickAddForm.package === pkg ? "bg-primary-light border-primary text-primary" : "bg-white border-gray-100 text-text-secondary hover:border-gray-200"
                          )}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Amount (Rp)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={quickAddForm.amount}
                      onChange={(e) => setQuickAddForm({...quickAddForm, amount: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                      Record Transaction
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-text-dark mt-1">{value}</h3>
      </div>
    </motion.div>
  );
}
