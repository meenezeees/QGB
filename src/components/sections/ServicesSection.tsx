import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Scissors, Clock, Sparkles, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICES } from '../../data/barbershop.data';
import { ServiceItem } from '../../types';

interface ServicesSectionProps {
  onSelectServiceToBook: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceToBook }) => {
  // Section visibility for scroll entrance animation
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Responsive itemsPerView: 1 on mobile (<768px), 2 on tablet (768-1023px), 3 on desktop (>=1024px)
  const [itemsPerView, setItemsPerView] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 1;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Touch gesture state
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwipingHorizontal = useRef<boolean>(false);

  // User preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Intersection observer for smooth scroll entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Listen to prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen to window resize and update itemsPerView
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group services into pages according to itemsPerView
  const pages = useMemo(() => {
    const grouped: ServiceItem[][] = [];
    for (let i = 0; i < SERVICES.length; i += itemsPerView) {
      grouped.push(SERVICES.slice(i, i + itemsPerView));
    }
    return grouped;
  }, [itemsPerView]);

  const maxIndex = Math.max(0, pages.length - 1);

  // Ensure currentIndex stays within bounds when itemsPerView changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch event handlers with velocity, boundary resistance & vertical scroll safety
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwipingHorizontal.current = false;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Check if movement is primarily vertical
    if (!isSwipingHorizontal.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        // Vertical page scroll detected -> do not block
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
      if (Math.abs(deltaX) > 8) {
        isSwipingHorizontal.current = true;
      }
    }

    if (isSwipingHorizontal.current) {
      // Boundary resistance dampening at edges
      let offset = deltaX;
      if ((currentIndex === 0 && deltaX > 0) || (currentIndex === maxIndex && deltaX < 0)) {
        offset = deltaX * 0.25;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (isSwipingHorizontal.current) {
      const threshold = 45; // Minimum px to trigger page shift
      if (dragOffset < -threshold && currentIndex < maxIndex) {
        handleNext();
      } else if (dragOffset > threshold && currentIndex > 0) {
        handlePrev();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    isSwipingHorizontal.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="scroll-mt-20 sm:scroll-mt-24 py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface-light dark:bg-[#070611] border-y border-[#6A6A70]/15 dark:border-[#9448AC]/20 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ==================================================================== */}
        {/* Section Header: Identification, Title, Count Badge & Nav Controls    */}
        {/* ==================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          {/* Left: Section Indicator & Title with narrow screen line-break */}
          <div className="space-y-1.5">
            <div
              id="services-header-badge"
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC] transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#9448AC] shadow-[0_0_8px_#9448AC]" />
              <span id="services-header-badge-text">NOSSOS SERVIÇOS</span>
            </div>

            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display leading-[1.18] transition-all duration-700 delay-100 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Tabela de <br className="xs:hidden" />Serviços & Valores
            </h2>
          </div>

          {/* Right: Total Count Badge + Previous/Next Round Buttons */}
          <div
            className={`flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 transition-all duration-700 delay-200 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Total Count Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
              <span>{SERVICES.length} serviços disponíveis</span>
            </div>

            {/* Circular Navigation Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Serviço anterior"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#9448AC] focus:ring-offset-2 dark:focus:ring-offset-[#070611] ${
                  currentIndex === 0
                    ? 'border-slate-200/80 dark:border-white/10 text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed'
                    : 'border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-[#480355] hover:bg-[#480355] hover:text-white dark:hover:border-[#9448AC] dark:hover:bg-[#9448AC] dark:hover:text-white active:scale-90 shadow-xs cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                aria-label="Próximo serviço"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#9448AC] focus:ring-offset-2 dark:focus:ring-offset-[#070611] ${
                  currentIndex === maxIndex
                    ? 'border-slate-200/80 dark:border-white/10 text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed'
                    : 'border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-[#480355] hover:bg-[#480355] hover:text-white dark:hover:border-[#9448AC] dark:hover:bg-[#9448AC] dark:hover:text-white active:scale-90 shadow-xs cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* Subtle Horizontal Divider Line below Header                          */}
        {/* ==================================================================== */}
        <div
          className={`h-px w-full bg-slate-200/90 dark:bg-white/10 mt-4 sm:mt-5 mb-6 sm:mb-8 transition-all duration-700 delay-250 ease-out ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-95'
          } origin-left`}
        />

        {/* ==================================================================== */}
        {/* Horizontal Carousel Container: Touch, Gestures & Keyboard Navigation */}
        {/* ==================================================================== */}
        <div
          className={`relative overflow-hidden w-full touch-pan-y outline-none transition-all duration-700 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrossel de Tabela de Serviços & Valores"
        >
          {/* Animated Carousel Track */}
          <div
            className="flex w-full"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging
                ? 'none'
                : prefersReducedMotion
                ? 'none'
                : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {pages.map((pageServices, pageIdx) => (
              <div
                key={pageIdx}
                className={`w-full shrink-0 flex-none ${
                  itemsPerView === 3
                    ? 'grid grid-cols-3 gap-5 lg:gap-6'
                    : itemsPerView === 2
                    ? 'grid grid-cols-2 gap-4'
                    : 'grid grid-cols-1 max-w-md mx-auto px-1'
                }`}
                aria-hidden={pageIdx !== currentIndex}
              >
                {pageServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 xs:p-5 sm:p-6 rounded-[20px] bg-white dark:bg-[#101026] border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_-5px_rgba(72,3,85,0.18)] hover:shadow-xl dark:hover:shadow-[0_8px_30px_-5px_rgba(148,72,172,0.25)] transition-all duration-300 flex flex-col justify-between group relative hover:-translate-y-1"
                  >
                    {/* Top Row: Service Thumbnail + Duration Compact Badge */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Service Thumbnail / Icon in Rounded Square */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-black border border-slate-200/60 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <Scissors className="w-6 h-6 text-white/50" />
                        )}
                      </div>

                      {/* Duration in Compact Badge with Clock Icon */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>

                    {/* Middle Info: Category, Full Name in Bold & Highlighted Purple Price */}
                    <div className="mt-4 sm:mt-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                            {service.category}
                          </span>
                          {service.popular && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#9448AC]/10 text-[#9448AC] text-[9px] font-bold uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5" />
                              Destaque
                            </span>
                          )}
                        </div>

                        {/* Full Service Name in Bold - Wrap naturally without cut-offs */}
                        <h3 className="text-base sm:text-lg font-bold text-[#000020] dark:text-white mt-1 leading-snug group-hover:text-[#9448AC] transition-colors">
                          {service.name}
                        </h3>

                        {/* Price in Bold Purple with Display Typography */}
                        <div className="text-2xl sm:text-3xl font-black text-[#9448AC] font-display mt-1 tracking-tight">
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </div>

                        {/* Subtle Description (Data Integrity Preserved) */}
                        <p className="text-xs text-[#45454C] dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Subtle Divider before Action */}
                      <div className="h-px w-full bg-slate-100 dark:bg-white/5 my-4 sm:my-5" />

                      {/* Full-width "AGENDAR SERVIÇO" Button with Calendar Icon */}
                      <button
                        type="button"
                        onClick={() => onSelectServiceToBook(service)}
                        className="w-full min-h-[46px] py-3.5 px-4 rounded-xl bg-[#480355] hover:bg-[#380242] active:bg-[#280130] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer group/btn overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-[#9448AC] focus:ring-offset-2 dark:focus:ring-offset-[#101026]"
                        aria-label={`Agendar ${service.name} por R$ ${service.price.toFixed(2).replace('.', ',')}`}
                      >
                        {/* Shimmer gradient effect on hover */}
                        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out pointer-events-none" />
                        <Calendar className="w-4 h-4 text-white shrink-0 transition-transform duration-200 group-hover/btn:scale-110" />
                        <span className="relative z-10">AGENDAR SERVIÇO</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* Animated Position Indicators (Morphing Pill + Dots)                  */}
        {/* ==================================================================== */}
        <div
          role="tablist"
          aria-label="Indicadores de posição dos serviços"
          className={`flex items-center justify-center gap-1.5 sm:gap-2 pt-6 sm:pt-8 transition-all duration-700 delay-400 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {pages.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para ${itemsPerView === 1 ? `serviço ${idx + 1}` : `página ${idx + 1}`}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9448AC] focus:ring-offset-2 dark:focus:ring-offset-[#070611] ${
                  isActive
                    ? 'w-7 sm:w-8 bg-[#480355] dark:bg-[#9448AC] shadow-xs'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
