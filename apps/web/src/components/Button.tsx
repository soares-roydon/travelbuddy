import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'brand' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-white text-zinc-900 hover:bg-zinc-200 border border-transparent focus:ring-white/50',
    brand: 'bg-brand-600 text-white hover:bg-brand-500 border border-transparent focus:ring-brand-500/50',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10 focus:ring-zinc-700/50',
    outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5 focus:ring-white/20',
    ghost: 'shadow-none bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white focus:ring-white/20',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1 h-7 rounded-md gap-1.5',
    md: 'text-sm px-4 py-1.5 h-9 rounded-md gap-2',
    lg: 'text-base px-6 py-2 h-11 rounded-lg gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
