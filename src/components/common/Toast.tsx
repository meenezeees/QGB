import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#9448AC] shrink-0" />
  };

  const bgStyles = {
    success: 'bg-white dark:bg-[#101026] border-emerald-500/30 text-slate-800 dark:text-slate-100',
    error: 'bg-white dark:bg-[#101026] border-rose-500/30 text-slate-800 dark:text-slate-100',
    info: 'bg-white dark:bg-[#101026] border-[#9448AC]/30 text-slate-800 dark:text-slate-100'
  }[toast.type];

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xl animate-slide-up ${bgStyles}`}>
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
