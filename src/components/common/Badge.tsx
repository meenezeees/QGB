import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'plum' | 'green' | 'gold' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  icon,
  className = '',
  id
}) => {
  const variantStyles = {
    purple: 'bg-[#9448AC]/10 text-[#9448AC] border-[#9448AC]/25',
    plum: 'bg-[#480355]/10 text-[#480355] dark:text-[#B66BD0] border-[#480355]/25',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    gold: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
    neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25'
  }[variant];

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
