import React from 'react';
import { Phone, MessageCircle, User, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { BARBERS, SETTINGS } from '../../data/barbershop.data';
import { BarberItem } from '../../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBarber?: BarberItem | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  selectedBarber
}) => {
  const getWhatsAppUrl = (phone: string, name?: string) => {
    const rawNumber = phone.replace(/\D/g, '');
    const formatted = rawNumber.startsWith('55') ? rawNumber : `55${rawNumber}`;
    const text = name
      ? `Olá ${name}! Vim pelo site da QG Barber e gostaria de falar com você sobre agendamento.`
      : `Olá! Vim pelo site da QG Barber e gostaria de tirar uma dúvida sobre horários e serviços.`;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Falar no WhatsApp"
      subtitle="Escolha com quem deseja conversar diretamente:"
      maxWidth="md"
    >
      <div id="whatsapp-barbers-options-list" className="space-y-3 pt-2">
        {/* Specific barber if selected */}
        {selectedBarber && (
          <a
            href={getWhatsAppUrl(selectedBarber.phone, selectedBarber.name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 hover:bg-emerald-500/20 text-[#000020] dark:text-white transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  Barbeiro Selecionado
                </span>
                <h4 className="text-base font-bold text-[#000020] dark:text-white">
                  {selectedBarber.name}
                </h4>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* Both Barbers */}
        {BARBERS.filter(b => b.id !== selectedBarber?.id).map((barber) => (
          <a
            key={barber.id}
            href={getWhatsAppUrl(barber.phone, barber.name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#9448AC] hover:bg-[#9448AC]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#480355] text-white flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                  Barbeiro
                </span>
                <h4 className="text-sm font-bold text-[#000020] dark:text-white">
                  {barber.name}
                </h4>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#9448AC] group-hover:translate-x-1 transition-transform" />
          </a>
        ))}

        {/* Central / General Barbershop WhatsApp */}
        <a
          href={getWhatsAppUrl(SETTINGS.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group mt-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                Atendimento Geral
              </span>
              <h4 className="text-sm font-bold text-[#000020] dark:text-white">
                Recepção QG Barber
              </h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </Modal>
  );
};
