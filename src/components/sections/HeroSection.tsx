import React from 'react';
import { Calendar, Star, Clock, ShieldCheck, Sparkles, MapPin, Scissors } from 'lucide-react';
import { SETTINGS } from '../../data/barbershop.data';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="hero-section"
      className="relative pt-24 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-surface-light to-white dark:from-[#000020] dark:via-[#090815] dark:to-[#000020]"
    >
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#480355]/15 via-[#9448AC]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-10 right-10 w-60 h-60 bg-[#9448AC]/10 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#480355]/10 dark:bg-[#9448AC]/15 border border-[#480355]/20 dark:border-[#9448AC]/30 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#9448AC]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#480355] dark:text-[#B66BD0]">
              Barbearia no Sacomã - SP
            </span>
          </div>

          {/* Logo with breathing halo - Scaled for mobile */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-br from-[#480355] via-[#9448AC] to-[#480355] shadow-glow flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-2.5 sm:p-3 flex items-center justify-center shadow-sm">
                <img
                  src={SETTINGS.logo_url}
                  alt={`${SETTINGS.name} Logo`}
                  className="w-full h-full object-contain select-none scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.ibb.co/WWwKRd36/Chat-GPT-Image-16-de-ago-de-2026-00-48-51.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display leading-[1.15]">
              Tradição, Estilo & <span className="bg-gradient-to-r from-[#480355] via-[#9448AC] to-[#B66BD0] bg-clip-text text-transparent">Precisão</span> em Cada Corte
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#45454C] dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              {SETTINGS.description}
            </p>
          </div>

          {/* Action Card (Agendamento Online Instantâneo) */}
          <div className="w-full max-w-2xl mt-2 p-4 sm:p-6 bg-[#000020] text-white rounded-2xl sm:rounded-3xl relative overflow-hidden border border-[#9448AC]/40 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#9448AC]/25 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#B66BD0] uppercase tracking-wider font-mono">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Agendamento Online</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
                  Reserve seu horário sem espera
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Confirmação em tempo real direto no seu WhatsApp.
                </p>
              </div>

              <button
                type="button"
                id="hero-btn-agendar"
                onClick={onOpenBooking}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#9448AC] to-[#B66BD0] hover:from-[#823a98] hover:to-[#a75bc2] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-glow hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Horário</span>
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 w-full max-w-3xl">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#9448AC] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#45454C] dark:text-slate-200">Pontualidade</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#45454C] dark:text-slate-200">5.0 no Google</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#45454C] dark:text-slate-200">Climatizado</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#480355] dark:text-[#B66BD0] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#45454C] dark:text-slate-200">Fácil Acesso</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
