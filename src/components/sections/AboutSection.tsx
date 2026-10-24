import React from 'react';
import { Award, Clock, Armchair, Sparkles, CheckCircle2, Users, Scissors } from 'lucide-react';
import { SETTINGS } from '../../data/barbershop.data';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* Main Text & Core Pillars (col-span-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-[#9448AC]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xs">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC]">
              <span className="w-2 h-2 rounded-full bg-[#9448AC] animate-pulse" />
              <span>SOBRE A BARBEARIA</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white leading-tight font-display">
              Mais do que um corte, uma experiência de precisão e estilo.
            </h2>

            <p className="text-xs sm:text-sm md:text-base font-normal text-[#45454C] dark:text-slate-300 leading-relaxed">
              {SETTINGS.description} Nosso espaço no Sacomã foi projetado para oferecer um refúgio acolhedor com atendimento de barbearia clássica somado às mais modernas técnicas de visagismo capilar e barba terapia.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-[#6A6A70]/15 dark:border-white/10 mt-6">
            <div className="p-3 sm:p-4 bg-surface-light dark:bg-white/5 border border-slate-200/70 dark:border-white/5 rounded-xl sm:rounded-2xl hover:border-[#9448AC]/40 transition-colors text-center sm:text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#9448AC]/10 dark:bg-[#9448AC]/20 flex items-center justify-center mb-2 text-[#9448AC] mx-auto sm:mx-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-[#000020] dark:text-white">Qualidade</div>
              <div className="text-[10px] sm:text-xs text-[#45454C] dark:text-slate-400 mt-0.5 line-clamp-2">Técnica apurada</div>
            </div>

            <div className="p-3 sm:p-4 bg-surface-light dark:bg-white/5 border border-slate-200/70 dark:border-white/5 rounded-xl sm:rounded-2xl hover:border-[#9448AC]/40 transition-colors text-center sm:text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#9448AC]/10 dark:bg-[#9448AC]/20 flex items-center justify-center mb-2 text-[#9448AC] mx-auto sm:mx-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-[#000020] dark:text-white">Pontualidade</div>
              <div className="text-[10px] sm:text-xs text-[#45454C] dark:text-slate-400 mt-0.5 line-clamp-2">Horário marcado</div>
            </div>

            <div className="p-3 sm:p-4 bg-surface-light dark:bg-white/5 border border-slate-200/70 dark:border-white/5 rounded-xl sm:rounded-2xl hover:border-[#9448AC]/40 transition-colors text-center sm:text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#9448AC]/10 dark:bg-[#9448AC]/20 flex items-center justify-center mb-2 text-[#9448AC] mx-auto sm:mx-0">
                <Armchair className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-[#000020] dark:text-white">Ambiente</div>
              <div className="text-[10px] sm:text-xs text-[#45454C] dark:text-slate-400 mt-0.5 line-clamp-2">Estilo e conforto</div>
            </div>
          </div>
        </div>

        {/* Side Image / Stats Card (col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#480355] to-[#000020] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between border border-[#9448AC]/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9448AC]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2.5 relative z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#9448AC]/20 border border-[#9448AC]/40 text-[10px] font-bold uppercase tracking-wider text-[#B66BD0] inline-block font-mono">
              ESPAÇO EXCLUSIVO
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              Compromisso com o seu visual
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aqui você não é apenas mais um cliente na fila. Cada atendimento é individualizado, respeitando seu estilo e seu tempo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10 mt-6 relative z-10">
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[#B66BD0] font-display">680+</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Agendamentos</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[#B66BD0] font-display">15</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Serviços</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[#B66BD0] font-display">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Navalhas descartáveis</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[#B66BD0] font-display">5.0 ★</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Avaliações</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
