import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_BOOTHS } from '../../mockData';

export default function Booking() {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const booth = MOCK_BOOTHS.find(b => b.id === boothId) || MOCK_BOOTHS[0];
  
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-04-10');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const packages = [
    { id: 'std', name: 'Standard', price: 'Rp 45.000', features: ['2 Printed Strips', 'Digital Files', '15 Mins Session'] },
    { id: 'prm', name: 'Premium', price: 'Rp 75.000', features: ['4 Printed Strips', 'Digital Files', '30 Mins Session', 'Custom Frame'] },
    { id: 'grp', name: 'Group', price: 'Rp 120.000', features: ['8 Printed Strips', 'Digital Files', '45 Mins Session', 'All Frames'] },
  ];

  const timeSlots = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-soft-gray flex flex-col">
      {/* Header */}
      <header className="bg-white p-6 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button onClick={() => step > 1 ? prevStep() : navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text-dark">Book Session</h1>
          <p className="text-xs text-text-secondary">{booth.name}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-6 pb-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-500",
            step >= i ? "bg-primary" : "bg-gray-100"
          )} />
        ))}
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-dark">Select your package</h2>
                <p className="text-sm text-text-secondary">Choose the best experience for you.</p>
              </div>

              <div className="space-y-4">
                {packages.map((pkg) => (
                  <button 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden",
                      selectedPackage === pkg.id ? "bg-white border-primary shadow-xl shadow-primary/10" : "bg-white border-transparent shadow-sm"
                    )}
                  >
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-0 right-0 p-3 bg-primary text-white rounded-bl-2xl">
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-text-dark">{pkg.name}</h3>
                        <span className="text-primary font-bold">{pkg.price}</span>
                      </div>
                      <ul className="space-y-2">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                            <Sparkles size={12} className="text-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-dark">Pick a time</h2>
                <p className="text-sm text-text-secondary">Available slots for today.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-text-dark">
                  <Calendar size={20} className="text-primary" />
                  <span className="font-bold">Friday, 10 April 2026</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-4 rounded-2xl text-sm font-bold border-2 transition-all",
                        selectedTime === time ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-soft-gray border-transparent text-text-dark hover:bg-gray-200"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <Info size={20} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  Please arrive 5 minutes before your slot. Sessions are strictly timed to prevent delays.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">Confirm Booking</h2>
                <p className="text-sm text-text-secondary">Review your session details.</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                
                <div className="space-y-6 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Booth</span>
                    <span className="text-sm font-bold text-text-dark">{booth.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Package</span>
                    <span className="text-sm font-bold text-text-dark">{packages.find(p => p.id === selectedPackage)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Time</span>
                    <span className="text-sm font-bold text-text-dark">{selectedTime} • Today</span>
                  </div>
                  <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-text-dark">Total</span>
                    <span className="text-2xl font-bold text-primary">{packages.find(p => p.id === selectedPackage)?.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm">
                  <CreditCard size={20} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-dark">Pay at booth (Cash/QRIS)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {step < 3 ? (
          <button 
            disabled={step === 1 ? !selectedPackage : !selectedTime}
            onClick={nextStep}
            className="w-full bg-primary disabled:bg-gray-200 text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            Continue <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={() => navigate('/memories')}
            className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            Confirm & Pay
          </button>
        )}
      </footer>
    </div>
  );
}
