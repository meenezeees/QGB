import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { SETTINGS } from '../../data/barbershop.data';

interface MobileFloatingCTAProps {
  onOpenBooking: () => void;
}

export const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({ onOpenBooking }) => {
  return (
    <div
      id="mobile-floating-cta-bar"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#000020]/95 backdrop-blur-lg border-t border-[#9448AC]/30 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl animate-fade-in"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Quick WhatsApp Call / Chat Button */}
        <a
          id="btn-mobile-float-whatsapp"
          href={`https://wa.me/${SETTINGS.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp oficial da barbearia"
          className="min-h-[46px] min-w-[46px] px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden xs:inline">WhatsApp</span>
        </a>

        {/* Primary Booking Button */}
        <button
          type="button"
          id="btn-mobile-float-booking"
          onClick={onOpenBooking}
          className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#480355] via-[#9448AC] to-[#B66BD0] text-white text-xs font-extrabold uppercase tracking-wider shadow-brand flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Horário</span>
        </button>
      </div>
    </div>
  );
};
