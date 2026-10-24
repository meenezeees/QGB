import React from 'react';
import { MapPin, Phone, Copy, ExternalLink, Clock, Wifi, Coffee, Wind, Car, Home } from 'lucide-react';
import { SocialButtons } from '../common/SocialButtons';
import { SETTINGS, OPERATING_HOURS, ENVIRONMENT_ITEMS } from '../../data/barbershop.data';

interface ContactSectionProps {
  onCopyAddress: () => void;
  onOpenWhatsApp: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onCopyAddress,
  onOpenWhatsApp
}) => {
  return (
    <section id="contact-section" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#6A6A70]/15 dark:border-white/10 pb-4 sm:pb-6">
        <div className="space-y-1.5">
          <div id="contact-header-badge" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC]">
            <span className="w-2 h-2 rounded-full bg-[#9448AC]" />
            <span id="contact-header-badge-text">NOSSO ESPAÇO & LOCALIZAÇÃO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display">
            Conheça a QG Barber
          </h2>
          <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-400 max-w-xl">
            Espaço moderno com bancadas profissionais, climatização e comodidades no coração do Sacomã em São Paulo.
          </p>
        </div>
      </div>

      {/* Ambiente & Estrutura - Fotos do Espaço com Scroll Horizontal no Mobile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#480355] to-[#9448AC] text-white flex items-center justify-center shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#000020] dark:text-white">Ambiente & Estrutura</h3>
              <p className="text-[11px] sm:text-xs text-[#45454C] dark:text-slate-400">Espaço moderno, climatizado e acolhedor</p>
            </div>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#9448AC] bg-[#9448AC]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
            3 fotos
          </span>
        </div>

        {/* Responsive layout: smooth horizontal snap on mobile, 3-col grid on tablet/desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 pb-2 md:grid md:grid-cols-3 md:gap-6 md:pb-0">
          {ENVIRONMENT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="w-[82vw] max-w-[320px] md:w-auto shrink-0 snap-center rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-[#6A6A70]/15 dark:border-white/10 shadow-md flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 sm:h-60 md:h-64 w-full overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-sm sm:text-base tracking-tight">{item.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Details (col-5) & Map Card (col-7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* Info Column (col-5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-sm space-y-5">
          <div className="space-y-5">
            
            {/* Address */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                Endereço da Unidade
              </span>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#9448AC] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-[#000020] dark:text-white leading-relaxed">
                  {SETTINGS.address}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  id="btn-copy-address"
                  onClick={onCopyAddress}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#9448AC]/30 bg-surface-light dark:bg-white/5 hover:bg-[#9448AC]/10 text-[#000020] dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5 text-[#9448AC]" />
                  <span>Copiar Endereço</span>
                </button>

                <a
                  id="btn-open-maps"
                  href={SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-[#9448AC] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir no GPS</span>
                </a>
              </div>
            </div>

            {/* Direct Contact Channels (WhatsApp) */}
            <div className="space-y-2.5 pt-3 border-t border-[#6A6A70]/10 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono block">
                Atendimento Rápido
              </span>

              <button
                type="button"
                id="btn-whatsapp-direct"
                onClick={onOpenWhatsApp}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Oficial: (11) 97833-4717</span>
              </button>
            </div>

            {/* Official Social Media Buttons (Instagram & TikTok) */}
            <div className="space-y-2 pt-3 border-t border-[#6A6A70]/10 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono block">
                Redes Sociais Oficiais
              </span>
              <SocialButtons variant="cards" />
            </div>

            {/* Amenities */}
            <div className="space-y-2 pt-4 border-t border-[#6A6A70]/10 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                Comodidades do Espaço
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#45454C] dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-[#9448AC]" />
                  <span>Wi-Fi de Alta Velocidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-[#9448AC]" />
                  <span>Ambiente Climatizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-[#9448AC]" />
                  <span>Café Espresso Cortesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#9448AC]" />
                  <span>Estacionamento Fácil</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Map & Visual Embed (col-7) */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#6A6A70]/15 dark:border-white/10 shadow-lg bg-slate-900 relative min-h-[380px] flex flex-col justify-between">
          <iframe
            title="Localização QG Barber Sacomã"
            src="https://maps.google.com/maps?q=-23.6234166,-46.6040515&hl=pt-BR&z=16&output=embed"
            className="w-full h-full min-h-[380px] border-0 select-none"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="p-4 bg-[#000020]/90 backdrop-blur-md text-white border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B66BD0]" />
              <span className="font-semibold">Rua Orlando Tarquinio, 129 - Sacomã</span>
            </div>
            <a
              id="btn-banner-google-maps"
              href={SETTINGS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B66BD0] hover:text-white underline font-bold"
            >
              Traçar rota no GPS →
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
