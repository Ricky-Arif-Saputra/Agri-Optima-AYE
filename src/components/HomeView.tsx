import React, { useState } from 'react';
import { X } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  image: string;
  content: string;
  videoUrl?: string;
  related?: { id: string; title: string; image: string }[];
};

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Inovasi Irigasi Presisi untuk Tanaman Padi',
    image: 'https://picsum.photos/seed/padi/400/200',
    content: `Teknologi irigasi presisi membantu petani menghemat air hingga 30% dan meningkatkan hasil panen secara signifikan.\n\nDengan sensor tanah dan sistem kontrol otomatis, irigasi dapat diatur secara real‑time berdasarkan kebutuhan tanaman.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    related: [
      { id: '1-1', title: 'Manfaat Sensor Soil Moisture', image: 'https://picsum.photos/seed/soil/200/120' },
      { id: '1-2', title: 'Studi Kasus: Irigasi di Jawa Barat', image: 'https://picsum.photos/seed/jawa/200/120' },
    ],
  },
  {
    id: '2',
    title: 'Penggunaan Drone untuk Pemantauan Tanaman',
    image: 'https://picsum.photos/seed/drone/400/200',
    content: `Drone dapat memberikan data NDVI secara real‑time, memungkinkan petani mendeteksi stres tanaman sejak dini.\n\nIntegrasi AI pada citra drone mempercepat analisis dan rekomendasi tindakan agronomi.`,
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    related: [
      { id: '2-1', title: 'Analisis Citra Satelit vs Drone', image: 'https://picsum.photos/seed/satellite/200/120' },
    ],
  },
];

export default function HomeView({ userName, onNavigateToTab }: { userName: string; onNavigateToTab: (tab: string) => void }) {
  const [selected, setSelected] = useState<Article | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 to-emerald-50 p-6 font-sans text-gray-800">
      {/* Hero */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-emerald-900 mb-2">Berita Pertanian Terbaru</h1>
        <p className="text-lg text-emerald-800">Inovasi, teknologi, dan pasar pertanian terbaru untuk Anda.</p>
      </section>

      {/* Carousel */}
      <section className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x snap-mandatory">
        {mockArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelected(article)}
            className="snap-start min-w-[280px] flex-shrink-0 bg-white/30 backdrop-blur-lg rounded-xl border border-emerald-200 hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden"
          >
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-3">
              <h2 className="text-emerald-900 font-semibold">{article.title}</h2>
            </div>
          </button>
        ))}
      </section>

      {/* Profit Chart Placeholder */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-emerald-900 mb-4">Grafik Potensi Laba</h2>
        {/* Simple bar chart using CSS */}
        <div className="flex items-end space-x-4 h-40">
          <div className="flex-1 bg-emerald-600 rounded-t" style={{ height: '70%' }}></div>
          <div className="flex-1 bg-emerald-500 rounded-t" style={{ height: '50%' }}></div>
          <div className="flex-1 bg-emerald-400 rounded-t" style={{ height: '30%' }}></div>
        </div>
        <p className="text-sm text-emerald-700 mt-2">* Contoh grafik, nanti terhubung dengan hasil optimasi.</p>
      </section>

      {/* Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelected(article)}
            className="bg-white/30 backdrop-blur-lg rounded-xl border border-emerald-200 hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden"
          >
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-3">
              <h2 className="text-emerald-900 font-semibold">{article.title}</h2>
            </div>
          </button>
        ))}
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-full overflow-y-auto p-6 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-emerald-900">{selected.title}</h2>
            <img src={selected.image} alt={selected.title} className="w-full h-56 object-cover rounded-md mb-4" />
            <p className="whitespace-pre-line mb-4 text-gray-700">{selected.content}</p>
            {selected.videoUrl && (
              <div className="aspect-video mb-4">
                <iframe
                  src={selected.videoUrl}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
            )}
            {selected.related && selected.related.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-emerald-900">Berita Terkait</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        const found = mockArticles.find((a) => a.id === rel.id.split('-')[0]);
                        if (found) setSelected(found);
                      }}
                      className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-md p-2 hover:bg-white/90"
                    >
                      <img src={rel.image} alt={rel.title} className="w-16 h-12 object-cover rounded" />
                      <span className="text-gray-800 text-sm font-medium">{rel.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
