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
    <div className="p-4 min-h-[calc(100vh-80px)] bg-[#f0f5f9] flex flex-col gap-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {userName}!</h1>
      <p className="text-sm text-gray-600">Berita terbaru pertanian</p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelected(article)}
            className="relative overflow-hidden rounded-xl bg-white/30 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-shadow"
          >
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <h2 className="text-white text-lg font-semibold">{article.title}</h2>
            </div>
          </button>
        ))}
      </div>

      {/* Modal / Detail View */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl max-w-3xl w-full max-h-full overflow-y-auto p-6 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selected.title}</h2>
            <img src={selected.image} alt={selected.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <p className="text-gray-700 whitespace-pre-line mb-4">{selected.content}</p>
            {selected.videoUrl && (
              <div className="aspect-video mb-4">
                <iframe
                  src={selected.videoUrl}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                />
              </div>
            )}
            {selected.related && selected.related.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Berita Terkait</h3>
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



