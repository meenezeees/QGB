import React, { useState, useEffect } from 'react';
import { Scissors, User, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Phone, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { SERVICES, BARBERS, SETTINGS } from '../../data/barbershop.data';
import { ServiceItem, BarberItem, Appointment } from '../../types';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialBarber?: BarberItem | null;
  onAppointmentBooked: (appointment: Appointment) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialBarber,
  onAppointmentBooked
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<BarberItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [lgpdConsent, setLgpdConsent] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Initialize service or barber if passed as props
  useEffect(() => {
    if (initialService) {
      setSelectedServices([initialService]);
    } else if (selectedServices.length === 0 && SERVICES.length > 0) {
      setSelectedServices([SERVICES[0]]);
    }

    if (initialBarber) {
      setSelectedBarber(initialBarber);
    } else if (!selectedBarber && BARBERS.length > 0) {
      setSelectedBarber(BARBERS[0]);
    }
  }, [initialService, initialBarber, isOpen]);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      if (!confirmedAppointment) {
        // If not already in confirmed view, reset to step 1
        setCurrentStep(1);
        setErrorMessage(null);
      }
    } else {
      // Delay reset on close
      setTimeout(() => {
        setConfirmedAppointment(null);
        setCurrentStep(1);
      }, 300);
    }
  }, [isOpen]);

  // Totals calculation
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Toggle service selection
  const handleToggleService = (service: ServiceItem) => {
    if (selectedServices.some(s => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      } else {
        setErrorMessage('Selecione pelo menos um serviço para agendar.');
        return;
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
    setErrorMessage(null);
  };

  // Generate available dates (next 14 days, excluding Sundays)
  const availableDates: { dateStr: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // Exclude Sunday
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      availableDates.push({ dateStr, label, weekday: weekday.toUpperCase() });
    }
  }

  // Pre-select first date if empty
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDate]);

  // Generate time slots (08:30 to 18:30 in 30-min increments)
  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Steps Navigation
  const handleNextStep = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (selectedServices.length === 0) {
        setErrorMessage('Selecione ao menos um serviço.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedBarber) {
        setSelectedBarber(BARBERS[0]);
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) {
        setErrorMessage('Escolha uma data para o agendamento.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedTime) {
        setErrorMessage('Selecione um horário disponível.');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Confirmação de agendamento 100% no cliente com alta performance
  const handleConfirmBooking = () => {
    if (!clientName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }
    if (!lgpdConsent) {
      setErrorMessage('É necessário aceitar os termos de consentimento para prosseguir.');
      return;
    }

    setErrorMessage(null);

    // Calcula horário de término
    const [h, m] = selectedTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + totalDuration;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      client_id: `usr-${Date.now().toString(36)}`,
      client_name: clientName.trim(),
      client_phone: clientPhone.replace(/\D/g, ''),
      client_email: clientEmail.trim() || undefined,
      barber_id: selectedBarber?.id || BARBERS[0].id,
      barber_name: selectedBarber?.name || BARBERS[0].name,
      service_ids: selectedServices.map(s => s.id),
      service_name: selectedServices.map(s => s.name).join(' + '),
      service_price: totalPrice,
      service_duration: totalDuration,
      date: selectedDate,
      start_time: selectedTime,
      end_time: endTime,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    setConfirmedAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setCurrentStep(6);

    // Dispara celebração com confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignora se indisponível
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentStep === 6 ? 'Agendamento Confirmado!' : `Agendar Horário — Etapa ${currentStep} de 5`}
      subtitle={currentStep <= 5 ? 'Reserve seu horário em segundos com confirmação imediata' : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* Step Progress Bar */}
        {currentStep <= 5 && (
          <div className="flex items-center justify-between pb-4 border-b border-[#6A6A70]/15 dark:border-white/10">
            {[
              { num: 1, label: 'Serviços' },
              { num: 2, label: 'Barbeiro' },
              { num: 3, label: 'Data' },
              { num: 4, label: 'Horário' },
              { num: 5, label: 'Confirmar' }
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#480355] text-white shadow-md ring-2 ring-[#9448AC]'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-[10px] mt-1 hidden sm:block font-semibold ${isCurrent ? 'text-[#480355] dark:text-[#B66BD0]' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Selecionar Serviços */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                  01. Selecione os Serviços
                </h4>
                <p className="text-xs text-[#45454C] dark:text-slate-400">
                  Você pode selecionar um ou múltiplos serviços para o mesmo atendimento:
                </p>
              </div>
              <span className="text-xs font-bold text-[#9448AC] bg-[#9448AC]/10 px-2.5 py-1 rounded-full">
                {selectedServices.length} {selectedServices.length === 1 ? 'selecionado' : 'selecionados'}
              </span>
            </div>

            <div id="booking-services-list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {SERVICES.map((s) => {
                const isSelected = selectedServices.some(item => item.id === s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleService(s)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#000020] text-white border-[#9448AC] shadow-md ring-2 ring-[#9448AC]'
                        : 'bg-surface-light dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#9448AC]/40 text-[#000020] dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {s.image_url && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-[#9448AC]/20 shrink-0">
                          <img
                            src={s.image_url}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm line-clamp-1">
                          {s.name}
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-[#45454C] dark:text-slate-400'} line-clamp-1`}>
                          {s.duration} min • {s.category}
                        </div>
                      </div>
                    </div>
                    <div className={`font-extrabold text-sm shrink-0 ${isSelected ? 'text-[#B66BD0]' : 'text-[#480355] dark:text-[#B66BD0]'}`}>
                      R$ {s.price.toFixed(2).replace('.', ',')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Total summary bar */}
            <div className="p-3.5 rounded-2xl bg-[#480355]/10 dark:bg-white/5 border border-[#480355]/20 flex items-center justify-between text-xs font-bold">
              <span className="text-[#480355] dark:text-[#B66BD0]">
                Tempo estimado: {totalDuration} min
              </span>
              <span className="text-base text-[#480355] dark:text-white font-display">
                Total: R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Selecionar Barbeiro */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                02. Selecione o Barbeiro
              </h4>
              <p className="text-xs text-[#45454C] dark:text-slate-400">
                Escolha o profissional de sua preferência para realizar o atendimento:
              </p>
            </div>

            <div id="booking-barbers-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BARBERS.map((b) => {
                const isSelected = selectedBarber?.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBarber(b)}
                    className={`p-5 rounded-3xl border text-left transition-all flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-[#000020] text-white border-[#9448AC] shadow-lg ring-2 ring-[#9448AC]'
                        : 'bg-surface-light dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#9448AC]/40 text-[#000020] dark:text-white'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#480355] text-white flex items-center justify-center font-bold text-xl shrink-0 border border-[#9448AC]/30">
                      {b.photo_url ? (
                        <img
                          src={b.photo_url}
                          alt={b.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <User className="w-7 h-7 text-[#B66BD0]" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                        Especialista
                      </span>
                      <h4 className="text-base font-bold">{b.name}</h4>
                      <p className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'} line-clamp-1`}>
                        {b.specialty}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Escolher Data */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                03. Escolha a Data
              </h4>
              <p className="text-xs text-[#45454C] dark:text-slate-400">
                Barbearia aberta de Segunda a Sábado. Selecione o dia desejado:
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-h-[300px] overflow-y-auto">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#480355] text-white border-[#9448AC] shadow-md ring-2 ring-[#9448AC]'
                        : 'bg-surface-light dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#9448AC]/40 text-[#000020] dark:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {item.weekday}
                    </span>
                    <span className="text-base font-extrabold font-display">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Escolher Horário */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                04. Escolha o Horário
              </h4>
              <p className="text-xs text-[#45454C] dark:text-slate-400">
                Horários disponíveis para {selectedBarber?.name} na data selecionada:
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[280px] overflow-y-auto">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-2 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#000020] text-white border-[#9448AC] shadow-md ring-2 ring-[#9448AC]'
                        : 'bg-surface-light dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#9448AC]/40 text-[#000020] dark:text-white'
                    }`}
                  >
                    <span>{time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Revisão e Dados do Cliente */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9448AC] font-mono">
                05. Revisão & Dados do Cliente
              </h4>
              <p className="text-xs text-[#45454C] dark:text-slate-400">
                Confira o resumo da sua reserva e informe seus dados para confirmação:
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-light dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Serviço(s):</span>
                <span className="font-bold text-[#000020] dark:text-white text-right">
                  {selectedServices.map(s => s.name).join(' + ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Barbeiro:</span>
                <span className="font-bold text-[#000020] dark:text-white">
                  {selectedBarber?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data e Horário:</span>
                <span className="font-bold text-[#9448AC]">
                  {selectedDate} às {selectedTime} ({totalDuration} min)
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-sm">
                <span className="font-bold">Valor Total a Pagar no Local:</span>
                <span className="font-extrabold text-[#480355] dark:text-[#B66BD0] font-display text-base">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Client Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs sm:text-sm font-medium focus:border-[#9448AC] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs sm:text-sm font-medium focus:border-[#9448AC] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs sm:text-sm font-medium focus:border-[#9448AC] outline-none"
                  />
                </div>
              </div>

              {/* LGPD Consent Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#9448AC] focus:ring-[#9448AC] w-4 h-4"
                />
                <span className="text-[11px] text-[#45454C] dark:text-slate-400 leading-tight">
                  Concordo com a utilização das informações preenchidas (nome, número e e-mail) para criação da conta e realização de agendamentos. *
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Agendamento Confirmado */}
        {currentStep === 6 && confirmedAppointment && (
          <div id="booking-success-view" className="text-center py-4 space-y-5 animate-slide-up">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight text-[#000020] dark:text-white font-display">
                Agendamento Confirmado!
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Código da Reserva: <strong className="text-[#9448AC]">{confirmedAppointment.id}</strong>
              </p>
            </div>

            <div className="p-5 bg-surface-light dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-left space-y-2.5 max-w-md mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <span className="font-bold">{confirmedAppointment.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serviço(s):</span>
                <span className="font-bold">{confirmedAppointment.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Barbeiro:</span>
                <span className="font-bold">{confirmedAppointment.barber_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data e Horário:</span>
                <span className="font-bold text-[#9448AC]">
                  {confirmedAppointment.date} às {confirmedAppointment.start_time}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-sm font-bold">
                <span>Valor Total:</span>
                <span className="text-[#480355] dark:text-[#B66BD0]">
                  R$ {confirmedAppointment.service_price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <a
                href={`https://wa.me/55${confirmedAppointment.client_phone}?text=${encodeURIComponent(
                  `Olá! Meu agendamento na QG Barber foi confirmado para o dia ${confirmedAppointment.date} às ${confirmedAppointment.start_time} com ${confirmedAppointment.barber_name}. Código: ${confirmedAppointment.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Salvar no WhatsApp</span>
              </a>

              <button
                type="button"
                id="btn-close-booking-success"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#000020] hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Concluir e Fechar
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {currentStep <= 5 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#6A6A70]/15 dark:border-white/10">
            {currentStep > 1 ? (
              <button
                type="button"
                id="booking-btn-back"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-[#45454C] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                id="booking-btn-next"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white text-xs font-bold uppercase tracking-wider shadow-brand flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="booking-btn-confirm"
                onClick={handleConfirmBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Agendamento</span>
              </button>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
};
