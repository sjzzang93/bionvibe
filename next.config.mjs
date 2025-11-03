/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화
  reactStrictMode: true,

  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 이미지 최적화
  images: {
    unoptimized: false, // 최적화 활성화
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vfoecqunkmqxktgywkdp.supabase.co',
      },
    ],
  },

  // 실험적 기능 (성능 개선)
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'react',
      'react-dom',
      'lucide-react',
      '@supabase/supabase-js',
      'framer-motion',
    ],
  },
};

export default nextConfig;
