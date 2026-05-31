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
                <button key={key} onClick={() => setSection(key as any)} className={`px-4 py-2 rounded-xl font-bold text-sm ${section === key ? 'bg-[#cdead0] text-[#1a432f]' : 'bg-gray-100 text-gray-600'}`}>{
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
              <section className="mt-8">
                <h2 className="font-serif text-xl font-bold text-[#002d1a] mb-4">Riwayat Pesanan</h2>
                <ul className="space-y-2">
                  {orderHistory.map(o => (
                    <li key={o.id} className="bg-white border border-[#c1c8c1] rounded p-3 shadow-sm flex justify-between items-center cursor-pointer hover:bg-emerald-50" onClick={() => setSelectedOrder(o)}>
                      <div>
                        <p className="font-bold text-[#002d1a]">{o.item}</p>
                        <p className="text-xs text-gray-500">Qty: {o.quantity}{o.isGroup ? ' (group)' : ''}</p>
                        <p className="text-xs text-gray-500">Tanggal: {new Date(o.timestamp).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-emerald-800">Rp{o.total.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Order Details Form */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">Kuantitas</label>
                <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className="w-full border-2 border-emerald-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={isGroup} onChange={e => setIsGroup(e.target.checked)} className="form-checkbox h-5 w-5 text-emerald-600" />
                <label className="ml-2 text-sm font-medium text-emerald-700">Pembelian Grup (diskon 10% untuk ≥5)</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">Alamat Pengiriman</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full border-2 border-emerald-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Jl. Kebun No.12, Bandung" />
            </div>

            <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
              <button onClick={() => setViewMode('list')} className="text-gray-600 hover:text-emerald-800 mb-4 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Kembali</button>
              <h2 className="font-serif text-3xl font-bold text-emerald-900 mb-3">{selectedItem?.name}</h2>
              <img src={selectedItem?.image} alt={selectedItem?.name} className="w-full h-72 object-cover rounded mb-5" />
              <p className="text-gray-800 mb-3">{selectedItem?.description}</p>
              <p className="font-bold text-emerald-800 text-xl mb-4">Rp {selectedItem?.price.toLocaleString()}</p>
              <div className="my-5 text-center">
                <p className="font-bold text-lg mb-2">Total: Rp {calculateTotal().toLocaleString()}</p>
                <button onClick={handlePayClick} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded font-semibold">Bayar</button>
                {showPaymentModal && selectedItem && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/90 backdrop-filter backdrop-blur-lg rounded-xl w-full max-w-md p-6 shadow-2xl relative border-2 border-emerald-800">
                      <button onClick={resetModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
                      <h3 className="font-serif text-2xl font-bold mb-3 text-emerald-900">Konfirmasi Pembayaran</h3>
                      <p className="text-sm text-gray-600 mb-4">{selectedItem?.description}</p>
                      <div className="my-4 text-center">
                        <p className="font-bold text-xl mb-2">Total: Rp {calculateTotal().toLocaleString()}</p>
                      </div>
                      {!showQRCode && (
                        <button onClick={handlePayClick} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-2 rounded font-semibold transition-colors">Bayar</button>
                      )}
                      {showQRCode && (
                        <div className="space-y-4">
                          <img src="/QRIS.jpeg" alt="QRIS" className="mx-auto w-48 h-48 object-cover mb-4 rounded border-2 border-emerald-100" />
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-emerald-700" htmlFor="payment-number">Nomor Pembayaran</label>
                            <input id="payment-number" type="text" className="w-full border-2 border-emerald-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="Contoh: 1234567890" />
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-emerald-700" htmlFor="payment-proof">Bukti Pembayaran (foto)</label>
                            <input id="payment-proof" type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-emerald-600 file:text-white hover:file:bg-emerald-700" />
                          </div>
                          {paymentProofPreview && (
                            <div className="mb-3 text-center">
                              <p className="text-sm font-medium text-emerald-700 mb-1">Pratinjau Bukti</p>
                              <img src={paymentProofPreview} alt="Preview" className="mx-auto w-32 h-32 object-cover rounded" />
                            </div>
                          )}
                          {!paymentSent && (
                            <button onClick={handleSendPayment} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded font-semibold mb-2">Kirim Pembayaran</button>
                          )}
                          {paymentSent && (
                            <button onClick={handleConfirm} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white py-2 rounded font-semibold transition-colors">Konfirmasi Pesanan (WhatsApp)</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
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
