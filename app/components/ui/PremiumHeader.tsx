'use client';

interface PremiumHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  gradient?: string;
}

export default function PremiumHeader({ 
  icon, 
  title, 
  subtitle,
  gradient = 'from-yellow-200 via-pink-200 to-purple-200'
}: PremiumHeaderProps) {
  return (
    <div className="text-center mb-16">
      <div className="inline-block mb-6">
        <div className="text-8xl mb-4 animate-float">{icon}</div>
      </div>
      <h1 className={`text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-white/80 font-light">
        {subtitle}
      </p>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

