// src/components/FarmView.tsx
// src/components/FarmView.tsx
import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Thermometer,
  Leaf,
  Sun,
  Plus,
  CheckCircle2,
  Sprout,
  Beaker,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
} from 'lucide-react';
import { Plot, Task } from '../types';

// Define the shape of an item displayed in the farm sections
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
  paymentNumber?: string; // filled after user sends payment
  paymentProof?: string; // data‑url of uploaded proof image
}

interface FarmViewProps {
  onNavigateToTab: (tab: string) => void;
  userName: string;
  efficiencyVal: number;
  setEfficiencyVal: (val: number) => void;
}
// src/components/FarmView.tsx
import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Thermometer,
  Leaf,
  Sun,
  Plus,
  CheckCircle2,
  Sprout,
  Beaker,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  Home,
  LayoutDashboard,
  Store,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Plot, Task } from '../types';

// Define the shape of an item displayed in the farm sections
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
  paymentNumber?: string; // filled after user sends payment
  paymentProof?: string; // data‑url of uploaded proof image
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
  {
    id: 'b1',
    name: 'Urea 50kg',
    price: 150000,
    image: 'https://via.placeholder.com/100?text=Urea',
    description: 'High‑nitrogen fertilizer for staple crops. Cocok untuk meningkatkan hasil padi, jagung, dan kedelai secara signifikan.',
  },
  {
    id: 'b2',
    name: 'Kompos Organik 30kg',
    price: 80000,
    image: 'https://via.placeholder.com/100?text=Kompos',
    description: 'Organic compost to improve soil structure, water retention, and microbial activity.',
  },
  {
    id: 'b3',
    name: 'Pupuk NPK 16',
    price: 80000,
    image: '/NPK.webp',
    description: 'Pupuk NPK 16 untuk pertumbuhan optimal tanaman.',
  },
  ];

  const manajemenItems: FarmItem[] = [
    {
      id: 'm1',
      name: 'Jasa Penanaman Padi',
      price: 500000,
      image: 'https://via.placeholder.com/100?text=Penanaman',
      description: 'Layanan lengkap menanam padi selama satu musim, termasuk persiapan lahan, penanaman, dan pemeliharaan.',
    },
    {
      id: 'm2',
      name: 'Jasa Penggemburan Tanah',
      price: 300000,
      image: 'https://via.placeholder.com/100?text=Gembur',
      description: 'Meningkatkan aerasi tanah untuk hasil maksimal dengan peralatan modern.',
    },
  ];

  const alatItems: FarmItem[] = [
    {
      id: 'a1',
      name: 'Traktor Mini',
      price: 2500000,
      image: 'https://via.placeholder.com/100?text=Traktor',
      description: 'Traktor ringan yang ideal untuk lahan kecil hingga menengah.',
    },
    {
      id: 'a2',
      name: 'Alat Penyemprot Pupuk',
      price: 1200000,
      image: 'https://via.placeholder.com/100?text=Pupuk',
      description: 'Menyemprot pupuk secara merata dengan efisiensi tinggi.',
    },
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

  // First click – create order and show QRIS section
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

  // After the user fills payment data
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
      // Set preview and store file for future use
      setPaymentProofPreview(proofDataUrl);
      setPaymentProofFile(file);
      const updated = orderHistory.map((o) =>
        o.id === currentOrderId ? { ...o, paymentNumber, paymentProof: proofDataUrl } : o,
      );
      setOrderHistory(updated);
      localStorage.setItem('farmOrders', JSON.stringify(updated));
      setPaymentSent(true);
    };
    reader.readAsDataURL(file);
  };

  // Final confirmation – open WhatsApp with full order details
  const handleConfirm = () => {
    const order = orderHistory.find((o) => o.id === currentOrderId);
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
      {items.map((it) => (
        <div key={it.id} className="bg-white border border-[#c1c8c1] rounded-xl p-4 shadow-sm flex items-center gap-4">
          <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-[#002d1a]">{it.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2" title={it.description}>{it.description}</p>
            <p className="mt-1 font-bold text-emerald-800">Rp{it.price.toLocaleString()}</p>
          </div>
          <button onClick={() => handleItemClick(it)} className="bg-[#002d1a] hover:bg-emerald-900 text-white px-3 py-1 rounded text-xs">
            Beli
          </button>
        </div>
      ))}
    </div>
  );

  // ----- Order Detail Modal -----
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
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">{new Date(order.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );

  // ----- Main Render -----
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
              {['bahan', 'manajemen', 'alat'].map((key) => (
                <button
                  key={key}
                  onClick={() => setSection(key as any)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm ${section === key ? 'bg-[#cdead0] text-[#1a432f]' : 'bg-gray-100 text-gray-600'}`}
                >
                  {key === 'bahan' && 'Pembelian Bahan Tani'}
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
                  {orderHistory.map((o) => (
                    <li
                      key={o.id}
                      className="bg-white border border-[#c1c8c1] rounded p-3 shadow-sm flex justify-between items-center cursor-pointer hover:bg-emerald-50"
                      onClick={() => setSelectedOrder(o)}
                    >
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
          </>
            <button onClick={handleConfirm} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded font-semibold">
              Konfirmasi Pesanan (WhatsApp)
            </button>
          )}
        </>
      )}
    </div>
  </div>
)}   </div>
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
