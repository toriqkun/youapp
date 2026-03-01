import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  isLoading,
  ...props
}) => {
  const baseStyles = "w-full rounded-lg py-4 px-6 text-white text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants = {
    primary: "btn-gradient hover:opacity-90 shadow-lg",
    ghost: "bg-transparent hover:bg-white/5 font-medium border-none text-white",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
