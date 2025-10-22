'use client';

import { ReactNode, ButtonHTMLAttributes, useState } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
}

const variants = {
  primary: 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
  secondary: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
  success: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
  danger: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
};

export default function PremiumButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props 
}: PremiumButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
        type="button"
      {...props}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${variants[variant]} 
        text-white font-bold rounded-xl
        transition-all duration-300 
        hover:scale-105 active:scale-95
        shadow-lg hover:shadow-2xl
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        transform: 'translateZ(0)',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 5px 15px -5px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
      
      {/* 3D depth layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>

      <style jsx>{`
        @keyframes ripple {
          to {
            width: 500px;
            height: 500px;
            margin-left: -250px;
            margin-top: -250px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </button>
  );
}

