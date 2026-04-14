import { motion } from 'motion/react';
import { MOCK_SESSIONS, MOCK_BOOTHS } from '../../mockData';
import { MapPin, Star, ArrowRight, Share2, Gift, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user, login } = useAuth();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        {user ? (
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Hi, {user.displayName?.split(' ')[0]}!</h1>
            <p className="text-text-secondary text-sm">Ready for new memories?</p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Welcome!</h1>
            <button onClick={login} className="text-primary text-sm font-bold flex items-center gap-1">
              <LogIn size={16} /> Sign in to save memories
            </button>
          </div>
        )}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-primary-light flex items-center justify-center">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <Gift className="text-primary" size={24} />
          )}
        </div>
      </header>

      {/* Memory Today Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Memory Today</h2>
          <button className="text-primary text-sm font-semibold">See All</button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-2xl overflow-hidden shadow-xl group"
        >
          <img 
            src={MOCK_SESSIONS[0].imageUrl} 
            alt="Memory" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <p className="text-white/80 text-xs font-medium">1 year ago today</p>
            <h3 className="text-white text-xl font-bold">Braga Vibes, Bandung</h3>
            <div className="flex gap-2 mt-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">View</button>
              <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold">Recreate</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Referral Progress */}
      <section className="bg-primary-light p-5 rounded-2xl border border-primary/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-dark">Referral Progress</h3>
            <p className="text-xs text-text-secondary">Invite 3 friends for 1 free session</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-white rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3 rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-primary">
            <span>2/3 Friends</span>
            <span>1 Session Left!</span>
          </div>
        </div>
        <Link to="/referral" className="flex items-center justify-center gap-2 w-full bg-white text-primary py-2 rounded-xl text-sm font-bold border border-primary/20">
          Share Code <ArrowRight size={16} />
        </Link>
      </section>

      {/* Nearby Booths */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Nearby Booths</h2>
          <Link to="/explore" className="text-primary text-sm font-semibold">View Map</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {MOCK_BOOTHS.map((booth) => (
            <motion.div 
              key={booth.id}
              whileHover={{ y: -5 }}
              className="min-w-[240px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
            >
              <div className="h-32 relative">
                <img src={booth.imageUrl} alt={booth.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {booth.promo && (
                  <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {booth.promo}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold">{booth.rating}</span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-text-dark">{booth.name}</h3>
                <div className="flex items-center gap-1 text-text-secondary">
                  <MapPin size={12} />
                  <span className="text-[10px]">{booth.address.split(',')[0]}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold text-sm">{booth.price}</span>
                  <button className="text-xs font-bold text-primary-dark hover:underline">Book</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-primary to-accent p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-bold leading-tight">New Frame Pack: <br/>Pastel Dreams 🌸</h3>
          <p className="text-white/80 text-xs">Available at all partner booths this weekend.</p>
          <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold mt-2">Claim Now</button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Share2 size={64} />
        </div>
      </section>
    </div>
  );
}
