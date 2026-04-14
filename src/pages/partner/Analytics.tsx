import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Clock, Calendar, Download, Filter, Search } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const HOURLY_DATA = [
  { time: '10am', value: 12 },
  { time: '11am', value: 18 },
  { time: '12pm', value: 45 },
  { time: '1pm', value: 38 },
  { time: '2pm', value: 32 },
  { time: '3pm', value: 56 },
  { time: '4pm', value: 82 },
  { time: '5pm', value: 95 },
  { time: '6pm', value: 110 },
  { time: '7pm', value: 125 },
  { time: '8pm', value: 140 },
  { time: '9pm', value: 115 },
];

export default function PartnerAnalytics() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Detailed Analytics</h1>
          <p className="text-text-secondary text-sm">Deep dive into your photobooth performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-text-secondary flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Peak Hours */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Peak Hours
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">Most Busy: 8 PM</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7A99' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7A99' }} />
                <Tooltip 
                  cursor={{ fill: '#f8faff' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#4F8CFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-white shadow-xl">
            <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest">Average Session</h4>
            <div className="text-3xl font-bold mt-2">4.2 min</div>
            <p className="text-xs mt-4 opacity-80">12% faster than last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-text-dark uppercase tracking-widest">Popular Frames</h4>
            <div className="space-y-4">
              {[
                { name: 'Pastel Dream', usage: '42%', color: 'bg-pink-400' },
                { name: 'Neo Tokyo', usage: '28%', color: 'bg-blue-400' },
                { name: 'Vintage B&W', usage: '18%', color: 'bg-gray-400' },
                { name: 'Cyberpunk', usage: '12%', color: 'bg-purple-400' },
              ].map((frame) => (
                <div key={frame.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-text-dark">{frame.name}</span>
                    <span className="text-primary">{frame.usage}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${frame.color}`} style={{ width: frame.usage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Retention Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Customer Retention
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HOURLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7A99' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7A99' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="value" stroke="#4F8CFF" strokeWidth={3} dot={{ r: 4, fill: '#4F8CFF', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
