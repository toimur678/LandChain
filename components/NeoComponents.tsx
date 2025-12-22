import React from 'react';

// NeoButton
export const NeoButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) => {
  const baseStyle = "px-6 py-3 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-150 uppercase tracking-wider";

  const variants = {
    primary: "bg-neo-primary hover:bg-neo-primary-hover text-white",
    secondary: "bg-neo-secondary hover:bg-neo-secondary-hover text-white",
    danger: "bg-neo-secondary hover:bg-neo-secondary-hover text-white",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// NeoCard
export const NeoCard = ({ 
  children, 
  className = '', 
  title 
}: { 
  children: React.ReactNode; 
  className?: string; 
  title?: string; 
}) => {
  return (
    <div className={`bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-black uppercase border-b-2 border-black pb-2 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

// NeoInput
export const NeoInput = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className={`w-full p-3 border-2 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow ${className}`} 
      {...props} 
    />
  );
};

// NeoBadge
export const NeoBadge = ({ 
  children, 
  variant = 'success',
  className = ''
}: { 
  children: React.ReactNode; 
  variant?: 'success' | 'warning' | 'error';
  className?: string;
}) => {
  const colors = {
    success: 'bg-neo-primary text-white', // Verified/Valid
    warning: 'bg-neo-accent text-black', // Pending
    error: 'bg-neo-secondary text-white', // Flagged/Invalid
  };

  return (
    <span className={`${colors[variant]} px-2 py-1 border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      {children}
    </span>
  );
};
