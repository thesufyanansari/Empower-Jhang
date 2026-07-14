import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-blue hover:bg-opacity-90 text-white shadow-md shadow-primary-blue/15 focus:ring-primary-blue dark:bg-primary-blue dark:hover:bg-opacity-80',
    secondary: 'bg-primary-green hover:bg-opacity-90 text-white shadow-md shadow-primary-green/15 focus:ring-primary-green dark:bg-primary-green',
    outline: 'border border-border-custom text-heading hover:bg-bg-section focus:ring-primary-blue dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'bg-danger hover:bg-opacity-90 text-white focus:ring-danger shadow-md shadow-danger/15',
    ghost: 'text-heading hover:bg-bg-section dark:text-slate-200 dark:hover:bg-slate-800 focus:ring-primary-blue',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
