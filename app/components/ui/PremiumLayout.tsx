'use client';

import { ReactNode } from 'react';
import AppFooter from '@/app/components/AppFooter';

interface PremiumLayoutProps {
  children: ReactNode;
  theme?: 'purple' | 'blue' | 'pink' | 'green' | 'orange' | 'indigo';
  showStars?: boolean;
}

const themeGradients = {
  purple: 'from-indigo-950 via-purple-900 to-pink-900',
  blue: 'from-blue-950 via-indigo-900 to-purple-900',
  pink: 'from-pink-950 via-rose-900 to-purple-900',
  green: 'from-emerald-950 via-teal-900 to-cyan-900',
  orange: 'from-orange-950 via-red-900 to-pink-900',
  indigo: 'from-slate-950 via-indigo-900 to-blue-900',
};

const themeAccents = {
  purple: ['purple', 'pink', 'blue'],
  blue: ['blue', 'indigo', 'cyan'],
  pink: ['pink', 'rose', 'fuchsia'],
  green: ['emerald', 'teal', 'green'],
  orange: ['orange', 'red', 'amber'],
  indigo: ['indigo', 'blue', 'violet'],
};

export default function PremiumLayout({ 
  children, 
  theme = 'purple',
  showStars = true 
}: PremiumLayoutProps) {
  const accents = themeAccents[theme];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated 3D Background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${themeGradients[theme]}`} style={{ perspective: '1000px' }}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Animated 3D Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={`absolute -top-1/2 -left-1/2 w-full h-full bg-${accents[0]}-500/10 rounded-full blur-3xl animate-blob`}
            style={{ 
              animationDuration: '8s',
              transform: 'translateZ(-50px) rotateX(15deg)'
            }}
          ></div>
          <div 
            className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-${accents[1]}-500/10 rounded-full blur-3xl animate-blob`}
            style={{ 
              animationDuration: '10s', 
              animationDelay: '2s',
              transform: 'translateZ(-30px) rotateY(15deg)'
            }}
          ></div>
          <div 
            className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${accents[2]}-500/5 rounded-full blur-3xl animate-blob`}
            style={{ 
              animationDuration: '12s', 
              animationDelay: '4s',
              transform: 'translateZ(-20px) rotate(45deg)'
            }}
          ></div>
        </div>

        {/* Floating particles with 3D effect */}
        {showStars && (
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-float-3d"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${1 + Math.random() * 3}px`,
                  height: `${1 + Math.random() * 3}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  transform: `translateZ(${Math.random() * 100}px)`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content with parallax */}
      <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>

      <AppFooter />

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { 
            transform: translateZ(-50px) rotateX(0deg) rotateY(0deg) scale(1);
          }
          33% { 
            transform: translateZ(-30px) rotateX(10deg) rotateY(10deg) scale(1.1);
          }
          66% { 
            transform: translateZ(-40px) rotateX(-5deg) rotateY(-5deg) scale(0.9);
          }
        }

        @keyframes float-3d {
          0%, 100% { 
            transform: translateZ(var(--z, 50px)) translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateZ(calc(var(--z, 50px) + 20px)) translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% { 
            transform: translateZ(var(--z, 50px)) translateY(-40px) translateX(-10px);
            opacity: 1;
          }
          75% {
            transform: translateZ(calc(var(--z, 50px) - 10px)) translateY(-20px) translateX(5px);
            opacity: 0.6;
          }
        }

        .animate-blob {
          animation: blob ease-in-out infinite;
        }

        .animate-float-3d {
          animation: float-3d ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

