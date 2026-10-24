import React from 'react';
import { InstagramIcon, TikTokIcon } from './Icons';
import { SETTINGS } from '../../data/barbershop.data';

interface SocialButtonsProps {
  variant?: 'cards' | 'pills' | 'footer';
  className?: string;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  variant = 'cards',
  className = ''
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <a
          id="btn-social-instagram-pill"
          href={SETTINGS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acessar Instagram oficial da QG Barber (abre em nova aba)"
          className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#9448AC]/20 text-[#000020] dark:text-white border border-[#9448AC]/30 hover:border-[#9448AC] text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
        >
          <InstagramIcon className="w-4 h-4 text-[#9448AC] dark:text-[#B66BD0] shrink-0" />
          <span>Instagram</span>
        </a>

        <a
          id="btn-social-tiktok-pill"
          href={SETTINGS.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acessar TikTok oficial da QG Barber (abre em nova aba)"
          className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#9448AC]/20 text-[#000020] dark:text-white border border-[#9448AC]/30 hover:border-[#9448AC] text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
        >
          <TikTokIcon className="w-4 h-4 text-[#9448AC] dark:text-[#B66BD0] shrink-0" />
          <span>TikTok</span>
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        <a
          id="footer-btn-social-instagram"
          href={SETTINGS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram oficial @_qgbarber_ (abre em nova aba)"
          className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#480355]/40 hover:to-[#9448AC]/40 text-slate-200 hover:text-white border border-white/10 hover:border-[#9448AC] text-xs font-semibold transition-all duration-200 flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
        >
          <InstagramIcon className="w-4 h-4 text-[#B66BD0] shrink-0" />
          <span>Instagram</span>
        </a>

        <a
          id="footer-btn-social-tiktok"
          href={SETTINGS.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok oficial @qgbarber (abre em nova aba)"
          className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#480355]/40 hover:to-[#9448AC]/40 text-slate-200 hover:text-white border border-white/10 hover:border-[#9448AC] text-xs font-semibold transition-all duration-200 flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
        >
          <TikTokIcon className="w-4 h-4 text-[#B66BD0] shrink-0" />
          <span>TikTok</span>
        </a>
      </div>
    );
  }

  // Default 'cards' variant (prominent, touch-friendly, high contrast)
  return (
    <div className={`grid grid-cols-2 gap-3 w-full ${className}`}>
      <a
        id="btn-social-instagram-card"
        href={SETTINGS.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Acessar Instagram oficial da QG Barber (abre em nova aba)"
        className="min-h-[48px] px-4 py-3 rounded-2xl bg-white dark:bg-[#101026] hover:bg-[#9448AC]/10 dark:hover:bg-[#9448AC]/20 text-[#000020] dark:text-white border border-[#9448AC]/30 hover:border-[#9448AC] transition-all duration-200 shadow-xs flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9448AC]/20 to-[#B66BD0]/20 flex items-center justify-center text-[#9448AC] dark:text-[#B66BD0] group-hover:scale-110 transition-transform">
          <InstagramIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight">Instagram</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">@_qgbarber_</span>
        </div>
      </a>

      <a
        id="btn-social-tiktok-card"
        href={SETTINGS.tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Acessar TikTok oficial da QG Barber (abre em nova aba)"
        className="min-h-[48px] px-4 py-3 rounded-2xl bg-white dark:bg-[#101026] hover:bg-[#9448AC]/10 dark:hover:bg-[#9448AC]/20 text-[#000020] dark:text-white border border-[#9448AC]/30 hover:border-[#9448AC] transition-all duration-200 shadow-xs flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9448AC]"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9448AC]/20 to-[#B66BD0]/20 flex items-center justify-center text-[#9448AC] dark:text-[#B66BD0] group-hover:scale-110 transition-transform">
          <TikTokIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight">TikTok</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">@qgbarber</span>
        </div>
      </a>
    </div>
  );
};
