import { motion } from 'motion/react';
import { MOCK_BOOTHS } from '../../mockData';
import { MapPin, Star, Search, Navigation, List, Map as MapIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function Explore() {
  const [view, setView] = useState<'map' | 'list'>('list');

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-4 bg-white shadow-sm z-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-dark">Explore</h1>
          <div className="flex bg-soft-gray rounded-xl p-1">
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setView('map')}
              className={`p-2 rounded-lg transition-colors ${view === 'map' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search photobooths..." 
            className="w-full bg-soft-gray border-none rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {view === 'list' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Nearby You</h2>
              <span className="text-xs text-text-secondary">Sorted by distance</span>
            </div>
            
            {MOCK_BOOTHS.map((booth, index) => {
              const status = index === 0 ? 'busy' : index === 1 ? 'almost-full' : 'available';
              const waitingCount = index === 0 ? 5 : index === 1 ? 2 : 0;
              
              return (
                <motion.div 
                  key={booth.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                >
                  <div className="h-40 relative">
                    <img src={booth.imageUrl} alt={booth.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {booth.promo && (
                        <div className="bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                          PROMO
                        </div>
                      )}
                      <div className={cn(
                        "text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1",
                        status === 'busy' ? "bg-red-500" : status === 'almost-full' ? "bg-amber-500" : "bg-green-500"
                      )}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        {status === 'busy' ? 'Busy' : status === 'almost-full' ? 'Almost Full' : 'Available'}
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-text-dark">{booth.rating}</span>
                      <span className="text-[10px] text-text-secondary">(120+)</span>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-text-dark">{booth.name}</h3>
                        <div className="flex items-center gap-1 text-text-secondary mt-1">
                          <MapPin size={12} />
                          <span className="text-xs">{booth.address}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-lg">{booth.price}</p>
                        <p className="text-[10px] text-text-secondary">{booth.distance} away</p>
                      </div>
                    </div>

                    {/* Nudges */}
                    {(status === 'busy' || status === 'almost-full') && (
                      <div className={cn(
                        "flex items-center gap-2 p-3 rounded-2xl text-xs font-bold",
                        status === 'busy' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <AlertCircle size={14} />
                        {status === 'busy' 
                          ? `${waitingCount} people in queue • Est. wait 45m` 
                          : `Only 2 slots left for today!`}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Link 
                        to={`/booking/${booth.id}`}
                        className="flex-1 bg-primary text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 text-center hover:scale-[1.02] transition-transform"
                      >
                        Book Session
                      </Link>
                      <Link 
                        to={`/queue/${booth.id}`}
                        className="px-6 bg-soft-gray text-text-dark py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Users size={18} /> Join Queue
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="h-full w-full bg-primary-light rounded-3xl relative overflow-hidden flex items-center justify-center border-2 border-primary/10">
            <div className="absolute inset-0 opacity-30">
               {/* Simulated Map Background */}
               <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
               <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white" />
               <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white" />
               <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-xl animate-bounce">
                <Navigation size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-dark">Map View Coming Soon</h3>
              <p className="text-text-secondary text-sm">We're integrating Google Maps to help you find the best photobooths nearby.</p>
              <button onClick={() => setView('list')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg">Back to List</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
