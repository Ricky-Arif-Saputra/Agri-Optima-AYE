import React from 'react';

export default function HomeView({ onNavigateToTab, userName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700 text-white p-4 pb-safe">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Selamat datang, {userName}!</h1>
        <p className="text-sm opacity-80">Informasi pertanian dan perkembangan terbaru.</p>
      </header>

      {/* Sections – placeholders */}
      <section className="mb-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">Informasi</h2>
        <p className="text-sm opacity-80">[Data agrikultur terbaru – akan diisi kemudian]</p>
      </section>

      <section className="mb-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">Optimasi Laba</h2>
        <p className="text-sm opacity-80">[Ringkasan ROI dan rekomendasi – placeholder]</p>
        <button
          onClick={() => onNavigateToTab('dashboard')}
          className="mt-2 text-emerald-300 underline"
        >
          Lihat detail
        </button>
      </section>

      <section className="mb-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">Farm</h2>
        <p className="text-sm opacity-80">[Statistik lahan, cuaca, dll.]</p>
        <button
          onClick={() => onNavigateToTab('farm')}
          className="mt-2 text-emerald-300 underline"
        >
          Buka Farm
        </button>
      </section>

      <section className="mb-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">Market</h2>
        <p className="text-sm opacity-80">[Produk, harga pasar, dll.]</p>
        <button
          onClick={() => onNavigateToTab('market')}
          className="mt-2 text-emerald-300 underline"
        >
          Buka Market
        </button>
      </section>

      <section className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">Setting</h2>
        <p className="text-sm opacity-80">Pengaturan akun dan preferensi.</p>
        <button
          onClick={() => onNavigateToTab('settings')}
          className="mt-2 text-emerald-300 underline"
        >
          Buka Setting
        </button>
      </section>
    </div>
  );
}
