import React from 'react';
import { Sparkles, Star, Clock, RefreshCw, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { MONTHLY_PLAN_BENEFITS, SETTINGS } from '../../data/barbershop.data';

interface MonthlyPlanSectionProps {
  onOpenWhatsAppInquiry: () => void;
}

export const MonthlyPlanSection: React.FC<MonthlyPlanSectionProps> = ({ onOpenWhatsAppInquiry }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="monthly-plan-section"
      className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface-light dark:bg-[#070611] border-y border-[#6A6A70]/15 dark:border-[#9448AC]/20 relative overflow-hidden"
    >
      {/* Background radial gradients */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#480355]/10 to-[#9448AC]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-[#9448AC]/10 to-[#480355]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div id="monthly-header-badge" className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#480355]/10 dark:bg-[#9448AC]/15 border border-[#480355]/20 dark:border-[#9448AC]/30 text-[#480355] dark:text-[#B66BD0] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-mono">
            <span id="monthly-header-badge-text">EXCLUSIVO QG BARBER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9448AC]" />
            <span className="text-[#9448AC] dark:text-white font-semibold">CLUBE QG</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display">
            Plano Mensal
          </h2>

          <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-300 font-normal leading-relaxed">
            Tenha uma experiência ainda mais exclusiva na QG Barber com horários fixos garantidos, prioridade e comunicação direta.
          </p>
        </div>

        {/* 4 Benefits Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
          {MONTHLY_PLAN_BENEFITS.map((b) => (
            <div
              key={b.id}
              id={b.id}
              className={`relative flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#101026] transition-all duration-300 ${
                b.highlighted
                  ? 'border-2 border-[#480355] dark:border-[#9448AC] shadow-md shadow-[#480355]/10 ring-1 ring-[#9448AC]/20'
                  : 'border border-[#6A6A70]/15 dark:border-white/10 hover:border-[#9448AC]/50'
              }`}
            >
              {b.highlighted && b.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#480355] to-[#9448AC] text-white text-[9px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{b.badge}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform ${
                    b.highlighted
                      ? 'bg-gradient-to-br from-[#480355] to-[#9448AC] text-white shadow-brand'
                      : 'bg-[#9448AC]/10 text-[#9448AC] dark:bg-white/5 dark:text-[#B66BD0]'
                  }`}
                >
                  {getIcon(b.iconName)}
                </div>

                <h3 className={`text-xs sm:text-sm font-bold tracking-tight leading-snug font-display ${b.highlighted ? 'text-[#480355] dark:text-[#B66BD0]' : 'text-[#000020] dark:text-white'}`}>
                  {b.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-[#45454C] dark:text-slate-300 leading-snug font-normal line-clamp-3">
                  {b.description}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-[#6A6A70]/10 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-[#9448AC]">
                <span>Clube QG</span>
                <span>• Exclusivo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action & commercial terms card */}
        <div
          id="monthly-plan-cta"
          className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-[#101026] border border-[#480355]/30 dark:border-[#9448AC]/30 shadow-md p-4 sm:p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#480355] via-[#9448AC] to-[#480355]" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9448AC] uppercase tracking-wider font-mono">
                <MessageSquare className="w-3 h-3" />
                <span>Informações & Adesão</span>
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-[#000020] dark:text-white tracking-tight font-display">
                Quer saber mais sobre o plano?
              </h4>
              <p className="text-xs text-[#45454C] dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                Converse diretamente com o barbeiro no atendimento para tirar dúvidas sobre valores e regras.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenWhatsAppInquiry}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Falar sobre o Plano</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
