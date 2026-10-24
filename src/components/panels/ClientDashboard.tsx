import React from 'react';
import { Calendar, Clock, User, X, Star, Plus, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Appointment } from '../../types';
import { SETTINGS } from '../../data/barbershop.data';

interface ClientDashboardProps {
  userName: string;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onOpenBooking: () => void;
  onBackToHome: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  userName,
  appointments,
  onCancelAppointment,
  onOpenBooking,
  onBackToHome
}) => {
  return (
    <div id="client-dashboard" className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Header */}
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000020] dark:text-white font-display">
            Olá, {userName}!
          </h1>
          <p className="text-xs text-[#45454C] dark:text-slate-400">
            Gerencie seus agendamentos na QG Barber e avalie sua experiência.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="client-btn-agendar-novo"
            onClick={onOpenBooking}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] text-white text-xs font-bold uppercase tracking-wider shadow-brand flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#000020] dark:text-white font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#9448AC]" />
          <span>Meus Agendamentos</span>
        </h2>

        {appointments.length === 0 ? (
          <div id="client-empty-appointments" className="p-8 rounded-3xl bg-white dark:bg-[#101026] border border-dashed border-[#6A6A70]/30 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#000020] dark:text-white">
              Nenhum agendamento ativo no momento
            </h3>
            <p className="text-xs text-[#45454C] dark:text-slate-400 max-w-sm mx-auto">
              Que tal reservar um horário agora com nossos barbeiros Felipe ou Bruno?
            </p>
            <button
              type="button"
              onClick={onOpenBooking}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#480355] text-white text-xs font-bold transition-all shadow-md inline-block cursor-pointer"
            >
              Agendar Horário
            </button>
          </div>
        ) : (
          <div id="client-appointments-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                      {apt.status === 'confirmed' ? 'Confirmado' : apt.status}
                    </span>
                    <h4 className="text-base font-bold text-[#000020] dark:text-white">
                      {apt.service_name}
                    </h4>
                    <p className="text-xs text-[#45454C] dark:text-slate-400">
                      Barbeiro: <strong>{apt.barber_name}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#480355] dark:text-[#B66BD0]">
                      R$ {apt.service_price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {apt.service_duration} min
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-light dark:bg-white/5 text-xs font-semibold flex items-center justify-between text-[#000020] dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#9448AC]" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9448AC]" />
                    <span>{apt.start_time} às {apt.end_time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#6A6A70]/10 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {apt.id.slice(0, 12)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja realmente cancelar este agendamento?')) {
                        onCancelAppointment(apt.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#480355] to-[#9448AC] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold font-display">Gostou do seu atendimento?</h3>
          <p className="text-xs text-slate-200">
            Deixe sua avaliação com 5 estrelas no perfil do Google da QG Barber Sacomã!
          </p>
        </div>
        <a
          id="client-btn-rate-service"
          href={SETTINGS.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md transition-all"
        >
          <Star className="w-4 h-4 fill-slate-950" />
          <span>Avaliar no Google</span>
        </a>
      </div>

    </div>
  );
};
