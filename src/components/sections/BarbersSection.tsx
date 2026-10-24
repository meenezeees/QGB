import React from 'react';
import { User, Phone, Calendar, MessageCircle, Star, Sparkles } from 'lucide-react';
import { BARBERS } from '../../data/barbershop.data';
import { BarberItem } from '../../types';

interface BarbersSectionProps {
  onSelectBarberToBook: (barber: BarberItem) => void;
  onOpenWhatsAppBarber: (barber: BarberItem) => void;
}

export const BarbersSection: React.FC<BarbersSectionProps> = ({
  onSelectBarberToBook,
  onOpenWhatsAppBarber
}) => {
  return (
    <section id="barbers-section" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#6A6A70]/15 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC]">
            <span className="w-2 h-2 rounded-full bg-[#9448AC]" />
            <span>PROFISSIONAIS QUALIFICADOS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display">
            Nossos Barbeiros
          </h2>
          <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-400 max-w-xl">
            Profissionais dedicados, anos de experiência e pontualidade rigorosa para o seu visual.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectBarberToBook(BARBERS[0])}
          className="text-xs sm:text-sm font-bold text-[#9448AC] hover:text-[#480355] dark:hover:text-[#B66BD0] flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto active:scale-95 min-h-[44px]"
        >
          <span>Ver disponibilidade na agenda →</span>
        </button>
      </div>

      {/* Barbers Cards Grid */}
      <div id="public-barbers-list" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {BARBERS.map((barber) => (
          <div
            key={barber.id}
            id={`public-barber-card-${barber.id}`}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-white/10 hover:border-[#9448AC]/50 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group"
          >
            <div className="flex flex-row items-center sm:items-start gap-4 text-left">
              {/* Barber Avatar with Real Photo - Compact on mobile */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-[#480355] to-[#000020] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md border-2 border-[#9448AC]/40 group-hover:scale-105 transition-transform">
                {barber.photo_url ? (
                  <img
                    src={barber.photo_url}
                    alt={`Foto de ${barber.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <User className="w-10 h-10 text-[#B66BD0]" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9448AC]/10 text-[#9448AC] text-[9px] font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Especialista</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#000020] dark:text-white font-display">
                  {barber.name}
                </h3>

                <p className="text-xs font-semibold text-[#480355] dark:text-[#B66BD0] line-clamp-1">
                  {barber.specialty}
                </p>

                <p className="text-[11px] sm:text-xs text-[#45454C] dark:text-slate-300 leading-snug line-clamp-2 pt-0.5">
                  {barber.bio}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3.5 mt-3.5 border-t border-[#6A6A70]/10 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => onOpenWhatsAppBarber(barber)}
                className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp com {barber.name}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectBarberToBook(barber)}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar com {barber.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
