import React from 'react';

export const Card: React.FC<{ children?: React.ReactNode, className?: string, noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 border border-transparent hover:-translate-y-0.5",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 shadow-sm",
    danger: "bg-white text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 shadow-sm",
    ghost: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-700"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${disabled ? 'opacity-50 cursor-not-allowed hover:none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children?: React.ReactNode, color?: string }> = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        yellow: 'bg-amber-50 text-amber-600 border-amber-100',
        gray: 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${colors[color as keyof typeof colors]} uppercase tracking-wider`}>
            {children}
        </span>
    );
};