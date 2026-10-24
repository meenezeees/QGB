import React, { useState, useEffect } from 'react';
import { Calendar, User, Menu, X, Clock, MapPin, Sparkles } from 'lucide-react';
import { SocialButtons } from '../common/SocialButtons';
import { SETTINGS } from '../../data/barbershop.data';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  currentRole: UserRole | null;
  onSelectRoleView: (role: UserRole | 'home') => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  currentRole,
  onSelectRoleView,
  activeView
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check real-time opening hours (America/Sao_Paulo)
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      // Brasilia time is UTC-3
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const spDate = new Date(utc - (3600000 * 3));
      const day = spDate.getDay(); // 0 is Sunday, 6 is Saturday
      const hour = spDate.getHours() + (spDate.getMinutes() / 60);

      if (day === 0) {
        setIsOpenNow(false); // Closed on Sundays
      } else if (day === 6) {
        setIsOpenNow(hour >= 8.5 && hour < 16.0); // Saturday 08:30 - 16:00
      } else {
        setIsOpenNow(hour >= 8.5 && hour < 19.5); // Mon-Fri 08:30 - 19:30
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#hero-section' },
    { label: 'Serviços', href: '#services-section' },
    { label: 'Barbeiros', href: '#barbers-section' },
    { label: 'Clube QG', href: '#monthly-plan-section' },
    { label: 'Resultados', href: '#gallery-section' },
    { label: 'Produtos', href: '#products-section' },
    { label: 'Contato', href: '#contact-section' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (activeView !== 'home') {
      onSelectRoleView('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#000020]/95 backdrop-blur-md shadow-md border-b border-[#9448AC]/15 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a
            href="#hero-section"
            onClick={(e) => handleLinkClick(e, '#hero-section')}
            id="navbar-brand"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#9448AC] shadow-brand group-hover:scale-105 transition-transform bg-[#000020] flex items-center justify-center p-0.5">
              <img
                src={SETTINGS.logo_url}
                alt="QG Barber Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.ibb.co/WWwKRd36/Chat-GPT-Image-16-de-ago-de-2026-00-48-51.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#000020] dark:text-white font-display">
                {SETTINGS.name}
              </span>
              <span className="text-[10px] font-semibold text-[#9448AC] tracking-widest uppercase flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {isOpenNow ? 'Aberto Agora' : 'Fechado no momento'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs font-bold uppercase tracking-wider text-[#45454C] hover:text-[#9448AC] dark:text-slate-300 dark:hover:text-[#B66BD0] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#9448AC] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentRole ? (
              <button
                type="button"
                onClick={() => onSelectRoleView(currentRole)}
                id="nav-btn-client-panel"
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#9448AC]/30 text-[#000020] dark:text-white hover:bg-[#9448AC]/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#9448AC]" />
                <span>
                  {currentRole === 'admin' ? 'Painel Admin' : currentRole === 'barber' ? 'Painel Barbeiro' : 'Meus Agendamentos'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                id="nav-btn-login"
                className="px-3.5 py-2 text-xs font-bold text-[#45454C] dark:text-slate-300 hover:text-[#9448AC] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#9448AC]" />
                <span>Entrar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenBooking}
              id="nav-btn-agendar-desktop"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white text-xs font-bold uppercase tracking-wider shadow-brand hover:shadow-glow transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Horário</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="p-2 rounded-xl bg-[#480355] text-white shadow-md text-xs font-bold flex items-center gap-1"
              aria-label="Agendar Horário"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-btn-toggle-menu"
              className="p-2 rounded-xl border border-[#9448AC]/30 text-[#000020] dark:text-white hover:bg-[#9448AC]/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="navbar-mobile-menu" className="sm:hidden fixed inset-x-0 top-[65px] bg-white dark:bg-[#000020] border-b border-[#9448AC]/20 shadow-2xl p-6 space-y-5 animate-slide-up">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-bold uppercase tracking-wider text-[#000020] dark:text-white hover:text-[#9448AC] py-2 border-b border-slate-100 dark:border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              id="nav-btn-agendar-mobile"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] text-white font-bold text-xs uppercase tracking-wider shadow-brand flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Horário Online</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentRole) {
                  onSelectRoleView(currentRole);
                } else {
                  onOpenAuth();
                }
              }}
              className="w-full min-h-[44px] py-3 rounded-xl border border-[#9448AC]/30 text-[#000020] dark:text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <User className="w-4 h-4 text-[#9448AC]" />
              <span>{currentRole ? 'Acessar Meu Painel' : 'Acessar Conta / Cadastrar'}</span>
            </button>

            {/* Official Social Links in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Redes Sociais Oficiais
              </span>
              <SocialButtons variant="pills" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
