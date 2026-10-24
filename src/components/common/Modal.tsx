import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = '2xl',
  children,
  showCloseButton = true
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent background body scroll
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle native cancel (Esc key)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Modern Web Guidance: Light-dismiss fallback for browsers without native `closedby="any"`
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInsideContent = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );

    if (!isInsideContent) {
      onClose();
    }
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
      aria-modal="true"
      {...{ closedby: 'any' }}
      className={`w-full ${maxWidthClasses} bg-white dark:bg-[#101026] text-[#000020] dark:text-white p-0 rounded-3xl shadow-2xl border border-[#9448AC]/20 backdrop:bg-midnight/80 backdrop:backdrop-blur-md outline-none m-auto overflow-hidden animate-fade-in`}
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#6A6A70]/15 dark:border-[#9448AC]/20 bg-surface-light dark:bg-[#0A0915]">
            <div className="space-y-1 pr-4">
              {title && (
                <h3 id="modal-dialog-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#000020] dark:text-white font-display">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-muted">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar janela"
                className="p-2 -mr-2 -mt-2 rounded-full text-slate-grey hover:text-[#000020] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content with scrollable body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </dialog>
  );
};
