import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverLift = false,
  glass = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl border border-border-custom bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40';
  
  const glassStyles = glass 
    ? 'glass-morphism dark:glass-morphism-dark' 
    : '';

  const hoverStyles = hoverLift 
    ? 'hover:-translate-y-1 hover:shadow-md transition-all duration-300' 
    : '';

  return (
    <div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
