import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, ArrowLeft, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Appointment } from '../../types';

interface BarberDashboardProps {
  barberName: string;
  appointments: Appointment[];
  onBackToHome: () => void;
  onCancelAppointment: (id: string) => void;
}

export const BarberDashboard: React.FC<BarberDashboardProps> = ({
  barberName,
  appointments,
  onBackToHome,
  onCancelAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const barberAppointments = appointments.filter(a => 
    a.barber_name.toLowerCase().includes(barberName.toLowerCase().split(' ')[0]) ||
    barberName.toLowerCase().includes(a.barber_name.toLowerCase())
  );

  return (
    <div id="barber-dashboard" className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#6A6A70]/15 dark:border-white/10 pb-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-[#9448AC] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site Principal</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#9448AC]/10 text-[#9448AC] text-[10px] font-bold uppercase tracking-wider font-mono">
            Painel Operacional
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000020] dark:text-white font-display">
            Agenda do Barbeiro: {barberName}
          </h1>
          <p className="text-xs text-[#45454C] dark:text-slate-400">
            Acompanhe seus clientes agendados, horários livres e contate os clientes via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs font-bold outline-none"
          />
        </div>
      </div>

      {/* Timeline slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#000020] dark:text-white font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#9448AC]" />
            <span>Atendimentos Agendados</span>
          </h2>
          <span className="text-xs font-bold text-[#9448AC] bg-[#9448AC]/10 px-3 py-1 rounded-full">
            {barberAppointments.length} agendamentos registrados
          </span>
        </div>

        {barberAppointments.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#101026] border border-dashed border-[#6A6A70]/30 text-center space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#000020] dark:text-white">
              Nenhum agendamento para esta data
            </h3>
            <p className="text-xs text-[#45454C] dark:text-slate-400">
              Novas reservas feitas no site aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {barberAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#480355] text-white flex flex-col items-center justify-center font-bold font-display shrink-0">
                    <span className="text-xs">{apt.start_time}</span>
                    <span className="text-[9px] opacity-70">{apt.end_time}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#000020] dark:text-white">
                      {apt.client_name}
                    </h4>
                    <p className="text-xs text-[#45454C] dark:text-slate-400">
                      Serviço: <strong className="text-[#9448AC]">{apt.service_name}</strong> • R$ {apt.service_price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Telefone: {apt.client_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/55${apt.client_phone}?text=${encodeURIComponent(
                      `Olá ${apt.client_name}! Sou seu barbeiro da QG Barber referente ao seu agendamento de ${apt.service_name} no dia ${apt.date} às ${apt.start_time}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Deseja cancelar o agendamento de ${apt.client_name}?`)) {
                        onCancelAppointment(apt.id);
                      }
                    }}
                    className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
