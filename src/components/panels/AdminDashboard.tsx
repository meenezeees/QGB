import React, { useState } from 'react';
import { LayoutDashboard, Scissors, Users, Calendar, Download, ArrowLeft, Star, Clock, CheckCircle2 } from 'lucide-react';
import { SERVICES, BARBERS, SETTINGS } from '../../data/barbershop.data';
import { Appointment } from '../../types';

interface AdminDashboardProps {
  onBackToHome: () => void;
  appointments: Appointment[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  appointments
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'barbers' | 'backup'>('overview');

  const downloadBackupFile = () => {
    const backupData = {
      _schema_version: 1,
      exported_at: new Date().toISOString(),
      barbershop: SETTINGS,
      services: SERVICES,
      barbers: BARBERS,
      appointments: appointments
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `qg_barber_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="admin-master-dashboard" className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#6A6A70]/15 dark:border-white/10 pb-6">
        <div className="space-y-1">
          <button
            type="button"
            id="admin-btn-back-home"
            onClick={onBackToHome}
            className="text-xs font-bold text-[#9448AC] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site Principal</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#480355]/10 text-[#480355] dark:text-[#B66BD0] text-[10px] font-bold uppercase tracking-wider font-mono">
            Painel Administrativo Mestre
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000020] dark:text-white font-display">
            Gestão Geral — QG Barber
          </h1>
          <p className="text-xs text-[#45454C] dark:text-slate-400">
            Controle de serviços, preços, equipe de barbeiros, métricas e exportação de backups.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadBackupFile}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-[#480355] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Backup JSON</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div id="admin-metric-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Agendamentos Hoje
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#480355] dark:text-[#B66BD0] font-display">
            17
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Fluxo operacional ativo</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Clientes Cadastrados
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#000020] dark:text-white font-display">
            237
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Base verificada no banco</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Barbeiros Ativos
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#9448AC] font-display">
            2
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Felipe e Bruno</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Vagas Restantes Hoje
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">
            2
          </div>
          <p className="text-[11px] text-amber-600 font-medium">Alta ocupação (90%)</p>
        </div>
      </div>

      {/* Tabs */}
      <div id="admin-tabs-nav" className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        {[
          { key: 'overview', label: 'Visão Geral' },
          { key: 'services', label: 'Serviços & Preços (15)' },
          { key: 'barbers', label: 'Barbeiros (2)' },
          { key: 'backup', label: 'Banco de Dados & Backup' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#480355] text-white shadow-sm'
                : 'text-[#45454C] dark:text-slate-400 hover:text-[#000020] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div id="admin-overview-tab" className="space-y-4">
          <h3 className="text-base font-bold text-[#000020] dark:text-white font-display">
            Próximos Agendamentos Confirmados
          </h3>

          <div className="rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table id="admin-overview-apts-table" className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 font-mono">
                  <tr>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4">Barbeiro</th>
                    <th className="p-4">Serviço</th>
                    <th className="p-4">Data e Hora</th>
                    <th className="p-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {appointments.slice(0, 10).map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="p-4 font-bold text-[#000020] dark:text-white">{a.client_name}</td>
                      <td className="p-4 text-slate-500">{a.client_phone}</td>
                      <td className="p-4 font-medium text-[#9448AC]">{a.barber_name}</td>
                      <td className="p-4">{a.service_name}</td>
                      <td className="p-4 font-semibold">{a.date} às {a.start_time}</td>
                      <td className="p-4 text-right font-bold text-[#480355] dark:text-[#B66BD0]">
                        R$ {a.service_price.toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Services */}
      {activeTab === 'services' && (
        <div id="admin-services-view" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#000020] dark:text-white font-display">
              Catálogo de Serviços Ativos (15)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 shadow-xs flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#9448AC] uppercase font-mono">{s.category}</span>
                  <h4 className="text-sm font-bold text-[#000020] dark:text-white">{s.name}</h4>
                  <p className="text-xs text-slate-400">{s.duration} minutos de atendimento</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#480355] dark:text-[#B66BD0]">
                    R$ {s.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Barbers */}
      {activeTab === 'barbers' && (
        <div id="admin-barbers-view" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BARBERS.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#480355] text-white flex items-center justify-center font-bold text-2xl">
                  {b.name[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#000020] dark:text-white">{b.name}</h4>
                  <p className="text-xs text-[#9448AC] font-semibold">{b.specialty}</p>
                  <p className="text-xs text-slate-400">{b.email} • {b.phone}</p>
                </div>
              </div>
              <p className="text-xs text-[#45454C] dark:text-slate-300">{b.bio}</p>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profissional Ativo na Agenda ({b.service_ids.length} serviços)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Backup */}
      {activeTab === 'backup' && (
        <div id="admin-backup-section" className="p-8 rounded-3xl bg-white dark:bg-[#101026] border border-slate-200 dark:border-white/10 space-y-4 max-w-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#000020] dark:text-white font-display">
              Exportar e Preservar Base de Dados
            </h3>
            <p className="text-xs text-[#45454C] dark:text-slate-400">
              Faça o download do arquivo de backup consolidado contendo os serviços, barbeiros, configurações da loja e histórico de agendamentos.
            </p>
          </div>

          <button
            type="button"
            id="btn-export-database-backup"
            onClick={downloadBackupFile}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] text-white font-bold text-xs uppercase tracking-wider shadow-brand flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-98 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Backup Completo em JSON</span>
          </button>
        </div>
      )}

    </div>
  );
};
