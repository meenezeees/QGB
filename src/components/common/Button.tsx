import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-7 py-3.5 gap-2.5 min-h-[50px] shadow-lg'
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white shadow-brand hover:shadow-glow',
    secondary: 'bg-[#000020] hover:bg-[#101026] text-white border border-[#9448AC]/30 shadow-md',
    outline: 'bg-transparent border-2 border-[#9448AC] text-[#9448AC] hover:bg-[#9448AC] hover:text-white',
    ghost: 'bg-transparent hover:bg-[#9448AC]/10 text-[#000020] dark:text-white',
    whatsapp: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30'
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
