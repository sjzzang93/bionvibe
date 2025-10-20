'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryWithApps } from '@/lib/getApps';

export function CategoryCard({ category }: { category: CategoryWithApps }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/category/${category.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={category.bgImage}
          alt={category.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 transition-opacity duration-500 ${
          isHovered ? 'opacity-90' : 'opacity-70'
        }`} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-2 sm:p-6 min-h-[80px] sm:min-h-[300px] flex flex-col justify-center sm:justify-between items-center sm:items-start text-center sm:text-left">
        {/* Top Section */}
        <div className="w-full">
          <h3 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {category.name}
          </h3>
          <p className="text-gray-200 text-[10px] sm:text-sm leading-relaxed hidden sm:block">
            {category.description}
          </p>
        </div>

        {/* Apps List - Hidden on mobile */}
        <div className={`space-y-2 transition-all duration-500 hidden sm:block ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {category.apps.slice(0, 3).map((app, idx) => (
            <Link
              key={idx}
              href={app.url}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 
                       hover:bg-white/25 transition-all duration-300 border border-white/20
                       hover:border-white/40 hover:scale-105"
            >
              <span className="text-white text-sm font-medium">{app.name}</span>
            </Link>
          ))}
          {category.apps.length > 3 && (
            <div className="text-center text-white/60 text-xs mt-1">
              +{category.apps.length - 3}개 더
            </div>
          )}
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-1 right-1 sm:top-4 sm:right-4 w-6 h-6 sm:w-12 sm:h-12 border border-white/30 sm:border-2 rounded-full 
                    flex items-center justify-center backdrop-blur-sm bg-white/10
                    transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        <span className="text-white text-[9px] sm:text-sm font-bold">{category.apps.length}</span>
      </div>
    </Link>
  );
}
