import React, { useState } from 'react';
import { Camera, ZoomIn, ChevronDown, ChevronUp } from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/barbershop.data';
import { Modal } from '../common/Modal';

export const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ title: string; tag: string; img: string } | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Show 6 initial items on mobile for compact scanning, expandable to all 11
  const displayedItems = showAll ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, 6);

  return (
    <section id="gallery-section" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Section Header - Compact */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#6A6A70]/15 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div id="results-header-badge" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC]">
            <span className="w-2 h-2 rounded-full bg-[#9448AC]" />
            <span id="results-header-badge-text">TRANSFORMAÇÕES REAIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display">
            Nossos Resultados
          </h2>
          <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-400 max-w-xl">
            Cortes, degradês, barboterapia e finalizações de alto padrão realizados na QG Barber. Toque para ampliar.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs text-[#9448AC] font-semibold bg-[#9448AC]/10 px-3 py-1.5 rounded-full border border-[#9448AC]/20 self-start md:self-auto">
          <Camera className="w-3.5 h-3.5" />
          <span>{GALLERY_ITEMS.length} fotos reais</span>
        </div>
      </div>

      {/* Gallery Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-[#9448AC]/20 shadow-xs aspect-square cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95"
            role="button"
            tabIndex={0}
            aria-label={`Ver foto ampliada de ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedImage(item);
              }
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000020]/90 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Hover/Touch zoom icon */}
            <div className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
            </div>

            {/* Bottom Meta */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-0.5 text-white">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#9448AC] text-[9px] font-bold uppercase tracking-wider font-mono">
                {item.tag}
              </span>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button for Mobile */}
      {GALLERY_ITEMS.length > 6 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#9448AC]/40 bg-white dark:bg-[#101026] hover:bg-[#9448AC]/10 text-xs font-bold text-[#000020] dark:text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
          >
            <span>{showAll ? 'Mostrar menos fotos' : `Ver mais resultados (+${GALLERY_ITEMS.length - 6} fotos)`}</span>
            {showAll ? <ChevronUp className="w-4 h-4 text-[#9448AC]" /> : <ChevronDown className="w-4 h-4 text-[#9448AC]" />}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title}
        subtitle={selectedImage?.tag}
        maxWidth="3xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedImage.img}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </Modal>

    </section>
  );
};
