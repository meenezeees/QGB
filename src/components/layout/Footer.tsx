import React from 'react';
import { MapPin, Phone, Star, Shield, Clock, Heart } from 'lucide-react';
import { SocialButtons } from '../common/SocialButtons';
import { SETTINGS, OPERATING_HOURS } from '../../data/barbershop.data';

interface FooterProps {
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  return (
    <footer className="bg-[#000020] text-white border-t border-[#9448AC]/20 relative overflow-hidden">
      {/* Decorative gradient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-[#9448AC]/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#9448AC] bg-[#000020] flex items-center justify-center p-0.5">
                <img
                  src={SETTINGS.logo_url}
                  alt="Logo QG Barber"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-display">
                {SETTINGS.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {SETTINGS.description}
            </p>

            {/* Social Media Buttons (Instagram & TikTok) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B66BD0] font-mono block">
                Redes Sociais Oficiais
              </span>
              <SocialButtons variant="footer" />
            </div>

            {/* WhatsApp & Maps Quick Access */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${SETTINGS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                aria-label="Falar no WhatsApp oficial da QG Barber"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={SETTINGS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                aria-label="Ver rota no Google Maps da QG Barber"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Google 5.0</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B66BD0] font-mono">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li><a href="#hero-section" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#services-section" className="hover:text-white transition-colors">Catálogo de Serviços</a></li>
              <li><a href="#barbers-section" className="hover:text-white transition-colors">Nossos Barbeiros</a></li>
              <li><a href="#monthly-plan-section" className="hover:text-white transition-colors">Plano Mensal (Clube QG)</a></li>
              <li><a href="#gallery-section" className="hover:text-white transition-colors">Galeria de Resultados</a></li>
              <li><a href="#products-section" className="hover:text-white transition-colors">Linha Piratas For Men</a></li>
              <li><a href="#contact-section" className="hover:text-white transition-colors">Localização & Contato</a></li>
            </ul>
          </div>

          {/* Column 3: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B66BD0] font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Horário de Funcionamento</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {OPERATING_HOURS.map((oh) => (
                <li key={oh.day} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">{oh.day}:</span>
                  <span className={`font-semibold ${oh.open ? 'text-white' : 'text-rose-400'}`}>
                    {oh.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location & Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B66BD0] font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Unidade Sacomã</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {SETTINGS.address}
            </p>

            <a
              id="footer-btn-review-maps"
              href={SETTINGS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all w-full justify-center"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Avaliar no Google Maps</span>
            </a>

            <div className="pt-2">
              <button
                id="footer-btn-auth"
                type="button"
                onClick={onOpenAuth}
                className="text-[11px] text-slate-400 hover:text-[#B66BD0] underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Acesso Barbeiro & Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 {SETTINGS.name}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com excelência e precisão</span>
            <Heart className="w-3 h-3 text-[#9448AC] fill-[#9448AC]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
