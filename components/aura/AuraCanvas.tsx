"use client";
import { HSL, toCssHsl } from "@/lib/aura/palette";

export default function AuraCanvas({primary, secondary}:{primary:HSL; secondary:HSL}){
  const primaryColor = toCssHsl(primary);
  const secondaryColor = toCssHsl(secondary);
  
  return (
    <div className="w-full aspect-square rounded-3xl overflow-hidden ring-2 ring-white/20 relative
                    shadow-2xl shadow-purple-500/20 backdrop-blur-sm">
      {/* 고정된 그라데이션 배경 */}
      <div 
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`
        }}
      />
      
      <div className="absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm 
                    text-white border border-white/20 font-mono">
        {primaryColor}
      </div>
      <div className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm 
                    text-white border border-white/20">
        오늘의 색
      </div>
    </div>
  );
}
