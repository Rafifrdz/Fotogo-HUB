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
  Sparkles,
  User,
  Phone,
  ShieldCheck,
  Loader2
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
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const packages = [
    { id: 'std', name: 'Standard', price: 500, priceStr: 'Rp 500', features: ['2 Printed Strips', 'Digital Files', '15 Mins Session'] },
    { id: 'prm', name: 'Premium', price: 500, priceStr: 'Rp 500', features: ['4 Printed Strips', 'Digital Files', '30 Mins Session', 'Custom Frame'] },
    { id: 'grp', name: 'Group', price: 500, priceStr: 'Rp 500', features: ['8 Printed Strips', 'Digital Files', '45 Mins Session', 'All Frames'] },
  ];

  const timeSlots = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const activePackage = packages.find(p => p.id === selectedPackage);

  // Kirim data booking ke Google Spreadsheet via Apps Script Web App
  const submitToSpreadsheet = async () => {
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('VITE_GOOGLE_APPS_SCRIPT_URL belum diisi di file .env — data tidak dikirim ke spreadsheet.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('whatsapp', whatsapp);
      formData.append('booth', booth.name);
      formData.append('package', activePackage?.name || '');
      formData.append('date', selectedDate);
      formData.append('time', selectedTime || '');
      formData.append('total', activePackage?.priceStr || '');

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Error mengirim data ke spreadsheet:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Ambil config dari .env
      const PAKASIR_SLUG = import.meta.env.VITE_PAKASIR_SLUG;

      if (!PAKASIR_SLUG || PAKASIR_SLUG === 'isi_slug_proyek_pakasir_kamu') {
        console.warn('VITE_PAKASIR_SLUG belum diisi di file .env');
        // Mode demo: langsung simpan ke spreadsheet dan lanjut
        await submitToSpreadsheet();
        setShowPaymentGateway(false);
        navigate('/memories');
        return;
      }

      // Generate order_id unik berdasarkan timestamp
      const orderId = `FTG-${Date.now()}`;
      const amount = activePackage?.price ?? 0;

      // Simpan data booking ke spreadsheet sebelum redirect
      await submitToSpreadsheet();

      // Redirect ke halaman pembayaran Pakasir
      // Format: https://app.pakasir.com/pay/{slug}/{amount}?order_id={order_id}&redirect={url_kembali}
      const redirectAfterPay = `${window.location.origin}/memories`;
      const pakasirUrl = `https://app.pakasir.com/pay/${PAKASIR_SLUG}/${amount}?order_id=${orderId}&redirect=${encodeURIComponent(redirectAfterPay)}&qris_only=1`;

      window.location.href = pakasirUrl;

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error di handlePayment:', msg);
      alert(`Kesalahan: ${msg}`);
      setIsProcessing(false);
    }
  };

  if (showPaymentGateway) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
        >
          {/* Payment Gateway Mock UI */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-primary to-purple-500" />

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={20} />
              Secure Pay
            </h2>
            <span className="text-sm font-medium text-gray-500">Fotogo Hub</span>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-1">Total Payment</p>
            <p className="text-3xl font-bold text-gray-900">{activePackage?.priceStr}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-4 items-center">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">QRIS</div>
              <div>
                <p className="text-sm font-bold text-gray-800">QRIS / E-Wallet</p>
                <p className="text-xs text-gray-500">Gopay, OVO, Dana, ShopeePay</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 flex gap-4 items-center opacity-50 grayscale">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-bold text-xs">BCA</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Virtual Account</p>
                <p className="text-xs text-gray-500">Bank Transfer</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>

          <button
            onClick={() => setShowPaymentGateway(false)}
            disabled={isProcessing}
            className="w-full mt-4 py-3 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Cancel Payment
          </button>
        </motion.div>
      </div>
    );
  }

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
        {[1, 2, 3, 4].map((i) => (
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
                        <span className="text-primary font-bold">{pkg.priceStr}</span>
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
                        "py-3 rounded-xl text-sm font-bold border-2 transition-all",
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
                  Please arrive 5 minutes before your slot. Sessions are strictly timed.
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
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-dark">Your Details</h2>
                <p className="text-sm text-text-secondary">Who is booking this session?</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                    <User size={16} className="text-primary" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-4 bg-soft-gray border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-colors text-text-dark font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                    <Phone size={16} className="text-primary" /> WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 08123456789"
                    className="w-full p-4 bg-soft-gray border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-colors text-text-dark font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">Confirm Booking</h2>
                <p className="text-sm text-text-secondary">Ready to secure your spot?</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

                <div className="space-y-4 relative">
                  <div className="flex justify-between items-center bg-soft-gray p-3 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Name</span>
                    <span className="text-sm font-bold text-text-dark">{name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-soft-gray p-3 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Booth</span>
                    <span className="text-sm font-bold text-text-dark">{booth.name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-soft-gray p-3 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Package</span>
                    <span className="text-sm font-bold text-text-dark">{activePackage?.name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-soft-gray p-3 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Time</span>
                    <span className="text-sm font-bold text-text-dark">{selectedTime} • Today</span>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200 mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-text-dark">Total</span>
                    <span className="text-2xl font-bold text-primary">{activePackage?.priceStr}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {step < 4 ? (
          <button
            disabled={
              (step === 1 && !selectedPackage) ||
              (step === 2 && !selectedTime) ||
              (step === 3 && (!name || !whatsapp))
            }
            onClick={nextStep}
            className="w-full bg-primary disabled:bg-gray-200 text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            Continue <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => setShowPaymentGateway(true)}
            className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
          >
            Proceed to Payment
          </button>
        )}
      </footer>
    </div>
  );
}

