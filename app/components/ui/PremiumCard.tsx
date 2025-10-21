'use client';

import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  depth?: boolean;
  style?: React.CSSProperties;
}

export default function PremiumCard({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  depth = true,
  style: customStyle
}: PremiumCardProps) {
  return (
    <div 
      className={`
        bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-3 sm:p-5 md:p-8 border border-white/20 
        relative overflow-hidden
        ${hover ? 'transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:bg-white/15' : ''}
        ${depth ? 'transform-gpu perspective-1000' : ''}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: depth 
          ? '0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 10px 40px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          : undefined,
        ...customStyle
      }}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-500/10 animate-gradient"></div>
      )}
      
      {/* 3D depth layer */}
      {depth && (
        <>
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-50 blur-sm"></div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
        </>
      )}
      
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .animate-gradient {
          animation: gradient 4s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

