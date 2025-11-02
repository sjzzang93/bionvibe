'use client';

import React, { useState, useEffect } from 'react';

interface RadarChart3DProps {
  data: { [key: string]: number };
  factorNames: { [key: string]: string } | ((key: string) => string);
  colorScheme?: 'purple' | 'indigo';
}

/**
 * 3D Radar Chart Component
 *
 * Displays psychological test results in an animated 3D radar chart format.
 * Supports multiple factors and customizable color schemes.
 */
const RadarChart3D: React.FC<RadarChart3DProps> = ({
  data,
  factorNames,
  colorScheme = 'purple'
}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const factors = Object.keys(data);
  const maxValue = Math.max(...Object.values(data), 1);
  const angleStep = (2 * Math.PI) / factors.length;

  // Color configurations based on scheme
  const colors = colorScheme === 'purple'
    ? {
        bgGradient: 'from-purple-50 to-indigo-50',
        shadowFill: 'rgba(139, 92, 246, 0.2)',
        shadowStroke: 'rgba(139, 92, 246, 0.3)',
        polygonFill: 'rgba(139, 92, 246, 0.4)',
        polygonStroke: '#8b5cf6',
        pointFill: '#7c3aed',
        labelFill: 'fill-purple-700',
      }
    : {
        bgGradient: 'from-indigo-50 to-blue-50',
        shadowFill: 'rgba(79, 70, 229, 0.2)',
        shadowStroke: 'rgba(79, 70, 229, 0.3)',
        polygonFill: 'rgba(79, 70, 229, 0.4)',
        polygonStroke: '#4f46e5',
        pointFill: '#4338ca',
        labelFill: 'fill-indigo-700',
      };

  return (
    <div className={`relative w-full h-96 flex items-center justify-center bg-gradient-to-br ${colors.bgGradient} rounded-xl overflow-hidden`}>
      <svg viewBox="-150 -150 300 300" className="w-full h-full">
        {/* 배경 원들 */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={100 * scale}
            fill="none"
            stroke="#e0e7ff"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* 축선들 */}
        {factors.map((factor, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = Math.cos(angle) * 100;
          const y = Math.sin(angle) * 100;
          return (
            <line
              key={factor}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke="#c7d2fe"
              strokeWidth="1"
            />
          );
        })}

        {/* 3D 효과를 위한 그림자 */}
        <polygon
          points={factors.map((factor, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const value = data[factor];
            const radius = (value / maxValue) * 100;
            const x = Math.cos(angle) * radius + 5;
            const y = Math.sin(angle) * radius + 5;
            return `${x},${y}`;
          }).join(' ')}
          fill={colors.shadowFill}
          stroke={colors.shadowStroke}
          strokeWidth="2"
        />

        {/* 데이터 폴리곤 */}
        <polygon
          points={factors.map((factor, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const value = data[factor];
            const radius = (value / maxValue) * 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill={colors.polygonFill}
          stroke={colors.polygonStroke}
          strokeWidth="3"
          className="animate-pulse"
        />

        {/* 데이터 포인트 */}
        {factors.map((factor, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = data[factor];
          const radius = (value / maxValue) * 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <circle
              key={`point-${factor}`}
              cx={x}
              cy={y}
              r="5"
              fill={colors.pointFill}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* 라벨 */}
        {factors.map((factor, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = Math.cos(angle) * 120;
          const y = Math.cos(angle) * 120;
          const name = typeof factorNames === 'function' ? factorNames(factor) : (factorNames[factor] || factor);

          // 긴 텍스트는 '/'로 줄바꿈 (9개 이상 요인일 때 유용)
          const words = name.split('/');

          return (
            <g key={`label-${factor}`}>
              {words.length > 1 ? (
                // Multi-line label
                words.map((word, idx) => (
                  <text
                    key={idx}
                    x={x}
                    y={y + (idx - words.length / 2 + 0.5) * 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-[8px] font-bold ${colors.labelFill}`}
                  >
                    {word}
                  </text>
                ))
              ) : (
                // Single-line label
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs font-bold ${colors.labelFill}`}
                >
                  {name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/50 to-transparent" />
    </div>
  );
};

export default RadarChart3D;
