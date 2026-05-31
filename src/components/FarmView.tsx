import React, { useState, useEffect } from 'react';
import { Droplet, Thermometer, Leaf, Sun, Plus, CheckCircle2, Sprout, Beaker, ChevronLeft, ChevronRight, CloudLightning, Home, LayoutDashboard, Store, Settings as SettingsIcon } from 'lucide-react';
import { Plot, Task } from '../types';

interface FarmItem {
  id: string;
  name: string;
  price: number; // IDR
  image: string;
  description: string;
}

interface Order {
  id: string;
  item: string;
  quantity: number;
  isGroup: boolean;
  address: string;
  total: number;
  timestamp: string;
  paymentNumber?: string;
  paymentProof?: string;
}

interface FarmViewProps {
  onNavigateToTab: (tab: string) => void;
  userName: string;
  efficiencyVal: number;
  setEfficiencyVal: (val: number) => void;
}

// Placeholder QRIS image – replace with real QR code later
const QRIS_PLACEHOLDER = 'https://via.placeholder.com/250?text=QRIS+Payment';

export default function FarmView({ onNavigateToTab, efficiencyVal, setEfficiencyVal }: FarmViewProps) {
  // ----- UI State -----
  const [section, setSection] = useState<'bahan' | 'manajemen' | 'alat'>('bahan');
  const [selectedItem, setSelectedItem] = useState<FarmItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [activeTab, setActiveTab] = useState<string>('farm');
  const [quantity, setQuantity] = useState<number>(1);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  // Modal flow flags
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [paymentSent, setPaymentSent] = useState<boolean>(false);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  // Order handling
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ----- Sample Data -----
  const bahanItems: FarmItem[] = [
    { id: 'b3', name: 'Pupuk NPK 16', price: 80000, image: '/NPK.webp', description: 'Pupuk NPK 16 untuk pertumbuhan optimal tanaman.' },
  ];

  const manajemenItems: FarmItem[] = [
    { id: 'm3', name: 'Jasa Cangkul', price: 80000, image: '/cangkul.jpg', description: 'Layanan jasa cangkul profesional untuk persiapan lahan pertanian per hari.' },
  ];

  const alatItems: FarmItem[] = [
    { id: 'a3', name: 'Traktor Sawah', price: 150000, image: '/traktor.jpg', description: 'Sewa traktor sawah per hari untuk mempercepat pengolahan lahan.' },
  ];

  // ----- Effects -----
  useEffect(() => {
    const saved = localStorage.getItem('farmOrders');
    if (saved) setOrderHistory(JSON.parse(saved));
  }, []);

  // ----- Helper Functions -----
  const resetModal = () => {
    setSelectedItem(null);
    setQuantity(1);
    setIsGroup(false);
    setAddress('');
    setShowPaymentModal(false);
    setShowQRCode(false);
    setPaymentSent(false);
    setPaymentProofPreview('');
    setPaymentProofFile(null);
    setCurrentOrderId('');
    setViewMode('list');
  };

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    const base = selectedItem.price * quantity;
    if (isGroup && quantity >= 5) return Math.round(base * 0.9);
    return base;
  };

  const handlePayClick = () => {
    const total = calculateTotal();
    const order: Order = {
      id: `order-${Date.now()}`,
      item: selectedItem!.name,
      quantity,
      isGroup,
      address,
      total,
      timestamp: new Date().toISOString(),
    };
    const newHistory = [order, ...orderHistory];
    setOrderHistory(newHistory);
    localStorage.setItem('farmOrders', JSON.stringify(newHistory));
    setCurrentOrderId(order.id);
    setShowPaymentModal(true);
    setShowQRCode(true);
  };

  const handleSendPayment = () => {
    if (!currentOrderId) return;
    const paymentNumber = (document.getElementById('payment-number') as HTMLInputElement)?.value || '';
    const fileInput = document.getElementById('payment-proof') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!paymentNumber || !file) {
      alert('Silakan isi nomor pembayaran dan unggah bukti.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const proofDataUrl = reader.result as string;
      setPaymentProofPreview(proofDataUrl);
      setPaymentProofFile(file);
      const updated = orderHistory.map(o => o.id === currentOrderId ? { ...o, paymentNumber, paymentProof: proofDataUrl } : o);
      setOrderHistory(updated);
      localStorage.setItem('farmOrders', JSON.stringify(updated));
      setPaymentSent(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    const order = orderHistory.find(o => o.id === currentOrderId);
    if (!order) return;
    const waNumber = '6285731274203';
    const message = `Halo, saya ingin mengonfirmasi pesanan:\n- Produk: ${order.item}\n- Jumlah: ${order.quantity}${order.isGroup ? ' (group)' : ''}\n- Total: Rp${order.total.toLocaleString()}\n- Alamat: ${order.address}\n- Nomor Pembayaran: ${order.paymentNumber || '-'}\n- Tanggal: ${new Date(order.timestamp).toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    alert('Pesanan berhasil dikonfirmasi, silakan kirimkan bukti lewat WhatsApp.');
    resetModal();
  };

  const handleItemClick = (item: FarmItem) => {
    setSelectedItem(item);
    setViewMode('detail');
    setShowQRCode(false);
    setPaymentSent(false);
    setCurrentOrderId('');
  };

  const renderItems = (items: FarmItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(it => (
        <div key={it.id} className="bg-white border border-[#c1c8c1] rounded-xl p-4 shadow-sm flex items-center gap-4">
          <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-[#002d1a]">{it.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2" title={it.description}>{it.description}</p>
            <p className="mt-1 font-bold text-emerald-800">Rp{it.price.toLocaleString()}</p>
          </div>
          <button onClick={() => handleItemClick(it)} className="bg-[#002d1a] hover:bg-emerald-900 text-white px-3 py-1 rounded text-xs">Beli</button>
        </div>
      ))}
    </div>
  );

  const OrderDetailModal = ({ order }: { order: Order }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={() => setSelectedOrder(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="font-serif text-lg font-bold mb-2">Rincian Pesanan</h3>
        <p className="text-sm text-gray-600 mb-2"><strong>Produk:</strong> {order.item}</p>
        <p className="text-sm text-gray-600 mb-2"><strong>Jumlah:</strong> {order.quantity}{order.isGroup ? ' (group)' : ''}</p>
        <p className="text-sm text-gray-600 mb-2"><strong>Total:</strong> Rp{order.total.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mb-2"><strong>Alamat:</strong> {order.address}</p>
        <p className="text-sm text-gray-600 mb-2"><strong>Nomor Pembayaran:</strong> {order.paymentNumber || '-'}</p>
        {order.paymentProof && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1"><strong>Bukti Pembayaran:</strong></p>
            <img src={order.paymentProof} alt="Bukti" className="w-full h-auto rounded" />
            <p className="text-xs text-gray-500 mt-4">{new Date(order.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* Header */}
      <header className="bg-[#002d1a] text-white fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 h-16 shadow-md">
        <div className="flex items-center gap-2">
          <img alt="AGRI OPTIMA Logo" className="w-8 h-8 object-contain brightness-0 invert" src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A" />
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight">AGRI OPTIMA</span>
        </div>
        <div className="text-emerald-200 uppercase font-mono text-xs">FARM MANAGEMENT</div>
      </header>

      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto">
        {viewMode === 'list' && (
          <>
            {/* Section Tabs */}
            <nav className="flex gap-4 mb-6">
              {['bahan', 'manajemen', 'alat'].map(key => (
                <button key={key} onClick={() => setSection(key as any)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${section === key ? 'bg-[#cdead0] text-[#1a432f] shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{
                  key === 'bahan' && 'Pembelian Bahan Tani'}
                  {key === 'manajemen' && 'Manajemen Tani'}
                  {key === 'alat' && 'Penyewaan Alat'}
                </button>
              ))}
            </nav>

            {/* Content Switch */}
            {section === 'bahan' && renderItems(bahanItems)}
            {section === 'manajemen' && renderItems(manajemenItems)}
            {section === 'alat' && renderItems(alatItems)}

            {/* Order History List */}
            {orderHistory.length > 0 && (
              <section className="mt-10 mb-8">
                <h2 className="font-serif text-xl font-bold text-[#002d1a] mb-4">Riwayat Pesanan</h2>
                <ul className="space-y-3">
                  {orderHistory.map(o => (
                    <li key={o.id} className="bg-white border border-[#c1c8c1] rounded-xl p-4 shadow-sm flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-colors" onClick={() => setSelectedOrder(o)}>
                      <div>
                        <p className="font-bold text-[#002d1a] text-lg">{o.item}</p>
                        <p className="text-sm text-gray-500 mt-1">Kuantitas: {o.quantity}{o.isGroup ? ' (Pembelian Grup)' : ' (Perorangan)'}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(o.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Rp{o.total.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {viewMode === 'detail' && selectedItem && !showPaymentModal && (
          <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-emerald-100 mb-8 animate-fade-in">
            <div className="relative h-72 w-full bg-emerald-50">
              <button onClick={resetModal} className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-900 px-4 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 hover:bg-white transition-all z-10"><ChevronLeft className="w-4 h-4" /> Kembali</button>
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="font-serif text-3xl font-bold text-white drop-shadow-md">{selectedItem.name}</h2>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
                </div>
                <p className="font-bold text-emerald-700 text-2xl whitespace-nowrap ml-4">Rp {selectedItem.price.toLocaleString()}</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 space-y-5 mb-8">
                <h3 className="font-bold text-emerald-900 mb-2">Detail Pemesanan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-emerald-800 mb-2">Jumlah Pesanan</label>
                    <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="w-full border border-emerald-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition-all" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="block text-sm font-semibold text-emerald-800 mb-2">Sistem Pembelian</label>
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" checked={isGroup} onChange={e => setIsGroup(e.target.checked)} className="sr-only" />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${isGroup ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isGroup ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">
                        Grup <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full ml-1">Diskon 10% (≥5)</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2">Alamat Pengiriman</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full border border-emerald-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition-all resize-none" placeholder="Masukkan alamat lengkap pengiriman..." />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Total Pembayaran</span>
                  <span className="font-bold text-3xl text-emerald-800">Rp {calculateTotal().toLocaleString()}</span>
                </div>
                <button onClick={handlePayClick} className="w-full bg-gradient-to-r from-[#002d1a] to-emerald-800 hover:from-emerald-900 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </section>
        )}

        {viewMode === 'detail' && selectedItem && showPaymentModal && (
          <section className="max-w-md mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-emerald-100 mb-8 animate-fade-in relative">
            <div className="bg-[#002d1a] p-6 text-center text-white relative">
              <button onClick={resetModal} className="absolute top-4 left-4 text-emerald-200 hover:text-white transition-colors p-1"><ChevronLeft className="w-6 h-6" /></button>
              <h2 className="font-serif text-2xl font-bold mb-1">Pembayaran</h2>
              <p className="text-emerald-100/80 text-sm">Selesaikan pembayaran Anda</p>
            </div>
            
            <div className="p-6">
              <div className="bg-emerald-50 rounded-xl p-4 text-center mb-6 border border-emerald-100">
                <p className="text-sm text-gray-500 mb-1">Total Nominal</p>
                <p className="font-bold text-3xl text-emerald-800">Rp {calculateTotal().toLocaleString()}</p>
              </div>

              <div className="space-y-5">
                <div className="bg-white border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                  <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">SCAN QRIS</p>
                  <img src="/QRIS.jpeg" alt="QRIS" className="w-48 h-48 object-cover rounded-lg shadow-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2" htmlFor="payment-number">Nomor Transaksi / Referensi</label>
                  <input id="payment-number" type="text" className="w-full border border-emerald-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all" placeholder="Contoh: INV/2026/05/12345" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2" htmlFor="payment-proof">Unggah Bukti Pembayaran</label>
                  <div className="relative">
                    <input id="payment-proof" type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all border border-emerald-200 rounded-lg bg-gray-50" />
                  </div>
                </div>

                {paymentProofPreview && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Pratinjau Bukti</p>
                    <img src={paymentProofPreview} alt="Preview" className="mx-auto h-32 object-contain rounded-md shadow-sm" />
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  {!paymentSent ? (
                    <button onClick={handleSendPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Kirim Bukti Pembayaran
                    </button>
                  ) : (
                    <button onClick={handleConfirm} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all animate-pulse-once">
                      Konfirmasi via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && <OrderDetailModal order={selectedOrder} />}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-300 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex justify-around items-center py-2.5 px-4 pb-safe">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${activeTab === 'home' ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'}`}>
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'}`}>
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Optimasi</span>
        </button>
        <button onClick={() => setActiveTab('farm')} className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${activeTab === 'farm' ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'}`}>
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Farm</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${activeTab === 'market' ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'}`}>
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Market</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${activeTab === 'settings' ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'}`}>
          <SettingsIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>
      </nav>
    </div>
  );
}
