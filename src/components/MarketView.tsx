import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Verified, 
  ArrowRight, 
  Package, 
  Compass, 
  X,
  Sprout
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface MarketViewProps {
  onNavigateToTab: (tab: string) => void;
  userName: string;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function MarketView({ onNavigateToTab, cart, setCart }: MarketViewProps) {
  const [filterChip, setFilterChip] = useState<'all' | 'processed' | 'raw' | 'direct' | 'organic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

  // Core product listings
  const defaultProducts: Product[] = [
    {
      id: 'p-1',
      title: 'Highland Arabica',
      description: 'Cold-pressed and sun-dried beans harvested from high-altitude precision specialty farms.',
      price: 24.50,
      category: 'processed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8bzYvPFHxTePmKS8k-M2DhmWFFcDEBktnn9RpnwdVE8W_E2WiFxgU8vv7Yhvz346HXWbYYwEBxoRsON8qDUule-1dk-AHZUmHBUVAXus_oC5E3UCS_kLLt9bK_cL0XLGYbzOqAgTCImMMh7uNUJZeau-LnibmJSRdrtkVSUT6FJpy0IeO_cVmKDTAizPDAan9WhsPyVsaxsKYkdOGtne4CYBvGjilCOW020oO11D1cKTaKHHQECcxeNQYXkPIRmOFtL_31fQsYA',
      tag: 'Processed'
    },
    {
      id: 'p-2',
      title: 'Cold-Pressed Olive Oil',
      description: 'First-press premium oil with laboratory-verified seed and acidity levels below 0.3%.',
      price: 32.00,
      category: 'direct',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy2Z1HYnJh521cGqL4eaxJ4Q9kJzuiSz0lCs4gltLSg2-Db0k3uae8wO5VThERFDFvxUtfmReW6HqE1Eip1O-UjVdRorOpqWvvK3tCQ6mgn9r2DcvYu0I6IRIM29lgWY3Cfd0mkEMqitxmWzBLuTS74hUwdvUh-hKChv7yoXCG-zIVUnSXz6w3oWCBP6FFoOImz1OhjW3pJxvWvOI_NrI6OD9fbIRjpsSpTnUGmgZk_cQ6qR4iZeiyGPU-CyhWfThgECg2UGwpuw',
      tag: 'Direct Sale'
    },
    {
      id: 'p-3',
      title: 'Pure Grade A Saffron',
      description: 'Hand-picked filaments from controlled, high-density indoor agricultural environments.',
      price: 89.90,
      category: 'raw',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm5zDXWo91yTpsN4kyxbWdkDEFrkpzIddn85d0UxtDy5dWFukCV4xhjPjzXfKqNNmMgKiBTUpPEZU5gdtodBQsHsIwi6ecgtT3686Ll7yFh1QdV-QSGDCj85fiJUyQLWPgEIaivO3nLh6MrlT41U4jDB4GZbIJTHMlG3pzm2VRNecnCJpa-7819pK6HaTMwVSb2sQEtFoPsfkhvYSrEk-Xsa5_O0fpUCdq4myxId5KtXYRo590jq9o1vXld3Uz4l7kJu8Q1BjZ7w',
      tag: 'Raw Material'
    }
  ];

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    totalHarvest: '',
    description: '',
    address: '',
    image: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('marketProducts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts([...parsed, ...defaultProducts]);
      } catch (e) {
        setProducts(defaultProducts);
      }
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert('Mohon isi nama, harga, dan unggah gambar.');
      return;
    }
    const product: Product = {
      id: `p-${Date.now()}`,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: 'direct',
      tag: 'Hasil Tani',
      image: newProduct.image,
      sellerName: userName,
      totalHarvest: newProduct.totalHarvest,
      address: newProduct.address
    };
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('marketProducts', JSON.stringify(updated.filter(p => p.sellerName)));
    setShowAddModal(false);
    setNewProduct({ title: '', price: '', totalHarvest: '', description: '', address: '', image: '' });
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('marketProducts', JSON.stringify(updated.filter(p => p.sellerName)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Adding item to dynamic cart state
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    alert(`🛒 Highland Product Added: "${product.title}" has been successfully appended to your transport docket list.`);
  };

  const handleUpdateQty = (productId: string, increment: boolean) => {
    setCart((prev) => 
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = increment ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesCategory = filterChip === 'all' || p.category === filterChip;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* Top Header - Deep Forest */}
      <header className="bg-[#002d1a] text-white fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 h-16 shadow-md border-b border-[#1a432f]">
        <div className="flex items-center gap-2">
          <img 
            alt="AGRI OPTIMA Logo" 
            className="w-8 h-8 object-contain brightness-0 invert" 
            src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
          />
          <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            AGRI OPTIMA
          </h1>
        </div>
        
        {/* Cart count overlay trigger */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCartDrawer(true)}
            className="bg-[#1a432f] border border-emerald-800 hover:bg-[#002d1a] text-white px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold font-sans tracking-wide relative cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">MY TRANSITS</span>
            {cartCount > 0 && (
              <span className="bg-amber-500 text-emerald-950 font-bold font-mono px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* Marketplace titles */}
        <section className="py-8">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="font-serif text-3xl md:text-4xl text-[#002d1a] font-bold">Marketplace</h2>
            <p className="text-[#414943] text-sm md:text-base max-w-xl">
              Premium processed agricultural goods and raw materials from verified crop cycles and precision farms.
            </p>
          </div>

          {/* Search bar inside view */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md shadow-sm rounded-lg bg-white overflow-hidden border border-gray-300">
              <input 
                type="text"
                placeholder="Search arabica, saffron, oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 outline-none text-emerald-950 text-xs font-bold placeholder:text-gray-400"
              />
              <Search className="w-4 h-4 text-emerald-800 absolute left-3 top-3.5" />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#002d1a] hover:bg-emerald-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap font-sans"
            >
              <Plus className="w-4 h-4" /> Tambahkan Hasil Tani
            </button>
          </div>

          {/* Category selection chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'processed', label: 'Processed Goods' },
              { id: 'raw', label: 'Raw Materials' },
              { id: 'direct', label: 'Direct Sales' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setFilterChip(chip.id as any)}
                className={`px-5 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                  filterChip === chip.id 
                    ? 'bg-[#002d1a] text-white' 
                    : 'bg-white border border-[#c1c8c1] text-[#414943] hover:bg-[#cdead0] hover:text-[#516a56]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic products list */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white border-2 border-slate-200/50 rounded-xl overflow-hidden group hover:shadow-lg hover:border-emerald-800/10 transition-all duration-300 flex flex-col shadow-sm"
              >
                {/* Crop Photo with Tag overlay */}
                <div className="relative h-56 overflow-hidden bg-emerald-50">
                  <img 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    src={product.image}
                  />
                  <div className="absolute top-3 right-3 bg-[#cdead0] text-[#516a56] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest block font-sans shadow-sm">
                    {product.tag}
                  </div>
                  {product.sellerName === userName && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                      className="absolute top-3 left-3 bg-white/90 text-red-600 hover:text-white hover:bg-red-600 p-1.5 rounded-full shadow transition-colors"
                      title="Hapus Produk Anda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-bold text-[#002d1a] mb-1.5">{product.title}</h3>
                  <p className="text-xs text-[#414943] mb-6 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                    <span className="font-serif text-xl font-extrabold text-[#002d1a] font-mono">
                      ${product.price.toFixed(2)}
                      <span className="text-[10px] font-sans font-medium text-gray-500 ml-0.5">/unit</span>
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#002d1a] text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 uppercase hover:bg-emerald-900 transition-all active:scale-95 shadow cursor-pointer font-sans"
                    >
                      <span>Add transport</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg border border-gray-200">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="font-serif font-bold text-gray-600">No Premium Goods Match Selected Query</p>
              <button 
                onClick={() => { setFilterChip('all'); setSearchQuery(''); }}
                className="mt-2 text-xs font-bold text-emerald-800 underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Featured Bundles: Artisan Harvest Pack */}
        <section className="py-8 border-t border-gray-300">
          <h2 className="font-serif text-2xl font-bold text-[#002d1a] mb-6">Featured Bundles</h2>
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Huge Green Banner Card */}
            <div className="flex-grow bg-[#1a432f] text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[300px] shadow-lg border border-[#002d1a]">
              <div className="relative z-10 max-w-xl">
                <span className="inline-block bg-amber-500 text-emerald-950 px-4 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase mb-4">
                  LIMITED OFFER
                </span>
                <h3 className="font-serif text-3xl font-extrabold text-white mb-3 leading-snug">The Artisan Harvest Pack</h3>
                <p className="text-sm opacity-90 mb-8 max-w-md leading-relaxed">
                  A curated batching selection of our highest-rated processed goods, delivered direct to your packaging facility with complete telemetry provenance data.
                </p>
                <button 
                  onClick={() => setShowBundleModal(true)}
                  className="bg-white text-[#002d1a] px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-emerald-100 transition-all active:scale-95 shadow cursor-pointer"
                >
                  RESERVE BUNDLE
                </button>
              </div>

              {/* Huge Background Emblem icon */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none flex items-center justify-end">
                <Compass className="w-64 h-64 -mr-16 -mt-16" />
              </div>
            </div>

            {/* Certified Quality Card */}
            <div className="md:w-80 bg-white rounded-2xl p-6 flex flex-col justify-between border border-[#c1c8c1] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-800">
                  <Verified className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#002d1a]">Certified Quality</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Every crop package transitions through comprehensive wet-labs verification testing for exact nutritional standards.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => alert("Verification Specifications URL: Purity assay: >99.4%, Moisture lock limit: <8.2% on Specialty coffee cycles.")}
                className="text-[#002d1a] mt-6 hover:text-emerald-800 font-bold text-[11px] flex items-center gap-1.5 uppercase font-sans tracking-wide"
              >
                <span>VIEW STANDARDS</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="bg-white max-w-md w-full h-full flex flex-col justify-between shadow-2xl relative animate-slide-in">
            
            {/* Header state */}
            <div className="bg-[#002d1a] text-white p-5 flex items-center justify-between border-b border-[#1a432f]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-lg font-bold">Your Transport Docket</h3>
              </div>
              <button 
                onClick={() => setShowCartDrawer(false)}
                className="p-1.5 rounded-full hover:bg-[#1a432f] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List items */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      className="w-16 h-16 rounded object-cover border"
                      src={item.product.image}
                      alt={item.product.title}
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#002d1a] truncate">{item.product.title}</h4>
                        <span className="font-mono text-xs font-bold text-[#002d1a]">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 capitalize">{item.product.category}</p>
                      
                      {/* Controls qty */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border rounded bg-white overflow-hidden border-gray-300 shadow-sm">
                          <button 
                            onClick={() => handleUpdateQty(item.product.id, false)}
                            className="p-1 hover:bg-gray-100 text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-emerald-950">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQty(item.product.id, true)}
                            className="p-1 hover:bg-gray-100 text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 font-serif">
                  <ShoppingCart className="w-14 h-14 mx-auto mb-3 opacity-30 text-[#002d1a]" />
                  <span>Your active transport docket is currently empty.</span>
                </div>
              )}
            </div>

            {/* Subtotal Checkout actions */}
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-serif font-bold text-gray-600">Telemetry subtotal:</span>
                <span className="font-mono text-xl font-extrabold text-[#002d1a]">${subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => {
                  if (cart.length === 0) {
                    alert('Add premium products to confirm logistics reservation.');
                    return;
                  }
                  alert(`📦 Transport logistics secured! Standard delivery set for Plot coordinates. Subtotal of $${subtotal.toFixed(2)} invoiced.`);
                  setCart([]);
                  setShowCartDrawer(false);
                }}
                className="w-full bg-[#002d1a] hover:bg-emerald-900 text-white font-sans font-bold text-xs uppercase py-3.5 rounded-lg tracking-wider transition-all cursor-pointer shadow"
              >
                Execute Transport Docket Checkout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reserve Bundle Modal */}
      {showBundleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c1c8c1] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#002d1a] mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-800" />
              <span>Reserve Artisan Harvest Bundle</span>
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Confirm reservation of "The Artisan Harvest Pack" containing the premium trio of specialty processed crops. Standard priority logistics locked.
            </p>

            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-emerald-950 font-bold font-mono mb-4 flex justify-between">
              <span>All-In Pack Price:</span>
              <span>$134.50</span>
            </div>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  alert("🎉 Bundle Reserved! Delivery code dispatched to certified coordinates.");
                  setShowBundleModal(false);
                }}
                className="flex-grow bg-[#002d1a] hover:bg-emerald-900 text-white font-sans font-bold text-xs uppercase py-2.5 rounded tracking-wider cursor-pointer"
              >
                Secure Reservation Ticket
              </button>
              <button 
                type="button"
                onClick={() => setShowBundleModal(false)}
                className="px-4 border border-gray-300 rounded text-gray-600 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-bold text-[#002d1a] mb-6 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-600" />
              Tambahkan Hasil Tani
            </h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Foto Produk</label>
                <div className="flex flex-col items-center justify-center w-full">
                  {newProduct.image ? (
                    <div className="relative w-full h-40 mb-2">
                      <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      <button type="button" onClick={() => setNewProduct({...newProduct, image: ''})} className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full shadow">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-200 border-dashed rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 text-emerald-500 mb-2" />
                        <p className="text-sm text-emerald-700 font-semibold">Pilih atau unggah foto</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-900 mb-1">Nama Produk</label>
                  <input required type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 outline-none" placeholder="Misal: Padi Ciherang" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-900 mb-1">Harga (Rp)</label>
                  <input required type="number" min={0} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 outline-none" placeholder="Misal: 50000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Jumlah Total Panen</label>
                <input type="text" value={newProduct.totalHarvest} onChange={e => setNewProduct({...newProduct, totalHarvest: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 outline-none" placeholder="Misal: 500 Kg / 2 Ton" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Deskripsi Produk</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 outline-none resize-none" placeholder="Deskripsikan kualitas, varietas, dll." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Alamat Penjual</label>
                <textarea rows={2} value={newProduct.address} onChange={e => setNewProduct({...newProduct, address: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 outline-none resize-none" placeholder="Lokasi panen atau titik jemput" />
              </div>

              <button type="submit" className="w-full bg-[#002d1a] hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-4">
                Posting Hasil Tani
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
