import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
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
  Users,
  Phone,
  ShieldCheck,
  Loader2,
  MapPin,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_BOOTHS } from '../../mockData';

export default function Booking() {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const booth = MOCK_BOOTHS.find(b => b.id === boothId) || MOCK_BOOTHS[0];

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-04-10');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('qris');
  const [paymentData, setPaymentData] = useState<{ number: string; expired: string; total: number; method: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const PAYMENT_METHODS = [
    { id: 'qris', name: 'QRIS / E-Wallet', desc: 'Gopay, OVO, Dana, ShopeePay', color: 'bg-blue-600' },
    { id: 'bri_va', name: 'BRI Virtual Account', desc: 'Transfer via BRIVA', color: 'bg-[#00529C]' },
    { id: 'bni_va', name: 'BNI Virtual Account', desc: 'Transfer via BNI VA', color: 'bg-[#005E6A]' },
    { id: 'cimb_niaga_va', name: 'CIMB Niaga VA', desc: 'Transfer via CIMB', color: 'bg-[#ED1C24]' },
    { id: 'permata_va', name: 'Permata VA', desc: 'Transfer via Permata', color: 'bg-[#00A551]' },
    { id: 'maybank_va', name: 'Maybank VA', desc: 'Transfer via Maybank', color: 'bg-[#FFC20E]' },
    { id: 'bnc_va', name: 'Bank Neo Commerce VA', desc: 'Transfer via BNC', color: 'bg-[#FFD100]' },
    { id: 'sampoerna_va', name: 'Bank Sampoerna VA', desc: 'Transfer via Sampoerna', color: 'bg-[#1B4E9B]' },
    { id: 'artha_graha_va', name: 'Artha Graha VA', desc: 'Transfer via Artha Graha', color: 'bg-[#E30613]' },
    { id: 'atm_bersama_va', name: 'ATM Bersama VA', desc: 'Transfer via ATM Bersama', color: 'bg-[#005BA1]' },
  ];

  const packages = [
    { id: 'std', name: 'Standard Session', price: 35000, priceStr: 'Rp 35.000', features: ['2 Printed Strips', 'Digital Files', '15 Mins Session'], popular: false },
    { id: 'prm', name: 'Premium Session', price: 55000, priceStr: 'Rp 55.000', features: ['4 Printed Strips', 'Digital Files', '20 Mins Session', 'Custom Frame'], popular: true },
    { id: 'grp', name: 'Group Session', price: 85000, priceStr: 'Rp 85.000', features: ['8 Printed Strips', 'Digital Files', '30 Mins Session', 'All Frames'], popular: false },
  ];

  const timeSlots = [
    { label: 'Morning', slots: ['10:00', '10:30', '11:00', '11:30'] },
    { label: 'Afternoon', slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
    { label: 'Evening', slots: ['16:00', '16:30', '17:00', '17:30', '18:00'] },
  ];

  const activePackage = useMemo(() => packages.find(p => p.id === selectedPackage), [selectedPackage]);

  const isFormValid = selectedPackage && selectedTime && name.length > 2 && whatsapp.length > 9;

  // Kirim data booking ke Google Spreadsheet
  const submitToSpreadsheet = async () => {
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('VITE_GOOGLE_APPS_SCRIPT_URL belum diisi di file .env');
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
      console.error('Error sending to spreadsheet:', error);
    }
  };

  const handlePayment = async () => {
    if (!activePackage) return;
    setIsProcessing(true);
    
    try {
      const PAKASIR_SLUG = import.meta.env.VITE_PAKASIR_SLUG;
      const PAKASIR_API_KEY = import.meta.env.VITE_PAKASIR_API_KEY;

      if (!PAKASIR_SLUG || !PAKASIR_API_KEY) {
        throw new Error('Konfigurasi Pakasir (SLUG/API KEY) belum lengkap di .env');
      }

      const orderId = `FTG-${Date.now()}`;
      const apiUrl = `/api/pakasir`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedPaymentMethod,
          order_id: orderId,
          amount: activePackage.price
        })
      });

      console.log('Pakasir Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pakasir Error Response:', errorText);
        throw new Error(`Server Pakasir error (${response.status}): ${errorText || 'No response body'}`);
      }

      const data = await response.json();

      if (data.payment) {
        setPaymentData({
          number: data.payment.payment_number,
          expired: data.payment.expired_at,
          total: data.payment.total_payment,
          method: data.payment.payment_method
        });
        
        // Simpan ke spreadsheet juga
        await submitToSpreadsheet();
      } else {
        throw new Error(data.message || 'Gagal generate pembayaran');
      }
    } catch (error: any) {
      console.error('Error in handlePayment:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyVA = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showPaymentGateway) {
    return (
      <div className="min-h-screen bg-soft-gray flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md relative overflow-hidden ring-1 ring-black/5"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={20} />
              Secure Pay
            </h2>
            <button 
              onClick={() => { setShowPaymentGateway(false); setPaymentData(null); }}
              className="text-xs font-bold text-text-secondary"
            >
              Cancel
            </button>
          </div>

          {!paymentData ? (
            <>
              <div className="text-center mb-6">
                <p className="text-xs text-text-secondary mb-1 font-medium">Total Payment</p>
                <p className="text-4xl font-black text-text-dark tracking-tight">{activePackage?.priceStr}</p>
              </div>

              <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1 sticky top-0 bg-white py-1 z-10">Pilih Metode</p>
                
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 transition-all flex gap-4 items-center text-left",
                      selectedPaymentMethod === method.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50"
                    )}
                  >
                    <div className={cn("w-12 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[8px] shadow-sm text-center leading-tight px-1", method.color)}>
                      {method.id === 'qris' ? 'QRIS' : method.name.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text-dark">{method.name}</p>
                      <p className="text-[10px] text-text-secondary font-medium">{method.desc}</p>
                    </div>
                    {selectedPaymentMethod === method.id && <CheckCircle2 className="ml-auto text-primary" size={18} />}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4.5 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 shadow-xl shadow-primary/25 active:scale-[0.98]"
              >
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                {isProcessing ? 'Generating Payment...' : 'Proceed to Payment'}
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-6">
                <p className="text-xs text-text-secondary mb-1">Silakan Selesaikan Pembayaran</p>
                <p className="text-2xl font-black text-primary">Rp {paymentData.total.toLocaleString('id-ID')}</p>
              </div>

              {paymentData.method === 'qris' ? (
                <div className="bg-white p-4 rounded-3xl border-2 border-primary/10 shadow-inner inline-block mb-6">
                   <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentData.number)}`} 
                    alt="QRIS Code"
                    className="w-64 h-64 mx-auto"
                   />
                   <div className="mt-4 flex items-center justify-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-text-secondary uppercase">Scan with any e-wallet</span>
                   </div>
                </div>
              ) : (
                <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10 mb-6 text-left">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Nomor Virtual Account</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-2xl font-black text-text-dark tracking-widest">{paymentData.number}</p>
                    <button 
                      onClick={() => copyVA(paymentData.number)}
                      className={cn(
                        "p-2 rounded-xl transition-all",
                        copied ? "bg-green-500 text-white" : "bg-white text-primary shadow-sm"
                      )}
                    >
                      {copied ? <CheckCircle2 size={16} /> : <CreditCard size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-3 font-medium">
                    Bayar sebelum: {new Date(paymentData.expired).toLocaleString('id-ID')}
                  </p>
                </div>
              )}

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 mb-8 text-left">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                  Setelah membayar, harap tunggu sebentar. Sistem akan otomatis memproses pesananmu.
                </p>
              </div>

              <button
                onClick={() => navigate('/memories')}
                className="w-full bg-text-dark text-white py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                Sudah Bayar? Cek Status
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header - Gojek Style (Clean, Minimal) */}
      <header className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-50">
        <button
          onClick={() => showConfirmation ? setShowConfirmation(false) : navigate(-1)}
          className="p-2.5 bg-soft-gray hover:bg-gray-100 rounded-2xl transition-colors active:scale-90"
        >
          <ChevronLeft size={22} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-text-dark tracking-tight">
            {showConfirmation ? 'Konfirmasi Pesanan' : 'Booking Session'}
          </h1>
          <div className="flex items-center gap-1.5 opacity-60">
            <MapPin size={10} className="text-primary" />
            <span className="text-[10px] font-bold text-text-dark uppercase tracking-wider">{booth.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showConfirmation ? (
            <motion.div
              key="main-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pb-32"
            >
              {/* Booth Banner Mini */}
              <div className="px-4 py-4">
                <div className="bg-primary/5 rounded-[2rem] p-5 flex items-center gap-4 border border-primary/10">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md">
                    <img src={booth.imageUrl} alt={booth.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">{booth.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                       <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold">{booth.rating}</span>
                       </div>
                       <span className="text-[10px] font-bold text-primary">{booth.distance} away</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Packages - Horizontal Gojek Cards */}
              <div className="mt-2">
                <div className="px-6 flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-lg font-black text-text-dark tracking-tight">Select your package</h2>
                    <p className="text-xs text-text-secondary font-medium">Choose from our best experiences</p>
                  </div>
                </div>

                <div className="flex gap-5 overflow-x-auto px-6 pt-6 pb-8 snap-x no-scrollbar">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={cn(
                        "flex-shrink-0 w-[280px] snap-center text-left p-6 rounded-[2.5rem] border-2 transition-all duration-300 relative group active:scale-[0.98]",
                        selectedPackage === pkg.id
                          ? "bg-white border-primary shadow-[0_20px_50px_rgba(36,146,240,0.15)]"
                          : "bg-soft-gray border-transparent hover:border-gray-200"
                      )}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3.5 left-8 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/30 z-10">
                          <Sparkles size={11} className="fill-white" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                        </div>
                      )}

                      <div className="space-y-5">
                        <div className="flex justify-between items-start">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                            selectedPackage === pkg.id ? "bg-primary text-white" : "bg-white text-text-secondary"
                          )}>
                             {pkg.id === 'std' && <User size={24} />}
                             {pkg.id === 'prm' && <Sparkles size={24} />}
                             {pkg.id === 'grp' && <Users size={24} />}
                          </div>
                          {selectedPackage === pkg.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1.5 bg-primary rounded-full text-white shadow-sm">
                              <CheckCircle2 size={18} />
                            </motion.div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-text-dark">{pkg.name}</h3>
                          <p className="text-2xl font-black text-primary mt-1 leading-none">{pkg.priceStr}</p>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-gray-200/50">
                          {pkg.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              <span className="text-xs font-semibold text-text-secondary">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section: Pick a Time - Grid Chips */}
              <div className="mt-4 px-6 space-y-6">
                 <div>
                    <h2 className="text-lg font-black text-text-dark tracking-tight">Pick a time</h2>
                    <p className="text-xs text-text-secondary font-medium">Available slots for today</p>
                 </div>

                 <div className="bg-soft-gray/50 rounded-[2.25rem] p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-50">
                          <Calendar size={18} className="text-primary" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Selected Date</p>
                          <p className="text-sm font-bold text-text-dark">Friday, 10 April 2026</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {timeSlots.map((group) => (
                          <div key={group.label} className="space-y-3">
                             <p className="text-[10px] font-black text-text-secondary/50 uppercase tracking-widest pl-1">{group.label}</p>
                             <div className="grid grid-cols-4 gap-2.5">
                                {group.slots.map((time) => (
                                   <button
                                      key={time}
                                      onClick={() => setSelectedTime(time)}
                                      className={cn(
                                         "py-3 rounded-2xl text-[11px] font-black transition-all border-2 active:scale-95",
                                         selectedTime === time
                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-white border-transparent text-text-dark shadow-sm hover:border-gray-200"
                                      )}
                                   >
                                      {time}
                                   </button>
                                ))}
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="mt-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 flex gap-3">
                       <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                          Mohon datang 5 menit sebelum jadwal. Sesi akan dimulai tepat waktu untuk kenyamanan bersama.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Section: Personal Info */}
              <div className="mt-10 px-6 space-y-6">
                 <div>
                    <h2 className="text-lg font-black text-text-dark tracking-tight">Your Details</h2>
                    <p className="text-xs text-text-secondary font-medium">Who is booking this session?</p>
                 </div>

                 <div className="space-y-4">
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                          <User size={18} />
                       </div>
                       <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full pl-12 pr-6 py-4.5 bg-soft-gray border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-[1.5rem] outline-none transition-all text-sm font-bold text-text-dark placeholder:text-text-secondary/40 shadow-sm shadow-black/[0.02]"
                       />
                    </div>

                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                          <Phone size={18} />
                       </div>
                       <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="WhatsApp Number (e.g. 0812...)"
                          className="w-full pl-12 pr-6 py-4.5 bg-soft-gray border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-[1.5rem] outline-none transition-all text-sm font-bold text-text-dark placeholder:text-text-secondary/40 shadow-sm shadow-black/[0.02]"
                       />
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="px-6 py-8 space-y-8"
            >
              <div className="text-center space-y-3">
                 <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <CreditCard size={36} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-2xl font-black text-text-dark tracking-tighter">Satu langkah lagi!</h2>
                 <p className="text-xs text-text-secondary font-medium">Periksa kembali pesananmu sebelum lanjut membayar.</p>
              </div>

              <div className="bg-soft-gray/50 rounded-[2.5rem] p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />

                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Customer</p>
                      <p className="text-sm font-black text-text-dark leading-tight">{name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Location</p>
                      <p className="text-sm font-black text-text-dark leading-tight">{booth.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Package</p>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                         <p className="text-sm font-black text-text-dark leading-tight">{activePackage?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Time & Date</p>
                      <p className="text-sm font-black text-text-dark leading-tight">{selectedTime} • Today</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-dashed border-gray-200 mt-2 flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Bayar</p>
                       <p className="text-3xl font-black text-primary tracking-tighter">{activePackage?.priceStr}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-5 rounded-[2rem] border border-primary/20 flex gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-primary" />
                 </div>
                 <p className="text-[10px] font-bold text-primary/80 leading-relaxed">
                    Pembayaran diproses secara otomatis. E-ticket akan segera tersedia setelah pembayaran terverifikasi.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Footer Actions - Gojek Style */}
      <footer className="bg-white px-6 pt-4 pb-8 border-t border-gray-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] sticky bottom-0 z-30">
        {!showConfirmation ? (
           <div className="flex items-center gap-4">
              <div className="flex-1">
                 <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Total Price</p>
                 <p className="text-xl font-black text-text-dark tracking-tight">
                    {activePackage ? activePackage.priceStr : 'Rp 0'}
                 </p>
              </div>
              <button
                disabled={!isFormValid}
                onClick={() => setShowConfirmation(true)}
                className="flex-[1.5] bg-primary disabled:bg-gray-100 disabled:text-gray-400 text-white py-4.5 rounded-[1.5rem] font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
              >
                Lanjutkan <ChevronRight size={18} />
              </button>
           </div>
        ) : (
          <button
            onClick={() => setShowPaymentGateway(true)}
            className="w-full bg-primary text-white py-5 rounded-[2.25rem] font-black shadow-xl shadow-primary/25 active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-base tracking-tight"
          >
            Bayar Sekarang <Sparkles size={20} className="fill-white" />
          </button>
        )}
      </footer>
    </div>
  );
}

