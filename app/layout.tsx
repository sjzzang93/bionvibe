import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import GoogleAnalytics from "./components/GoogleAnalytics";
import GoogleAdSense from "./components/GoogleAdSense";
import { SupabaseProvider } from "@/lib/supabase-provider";

export const metadata: Metadata = {
  title: {
    default: "BION - 48개 무료 웹앱 | 계산기, 운세, 게임, 건강 도구 모음",
    template: "%s | BION"
  },
  description: "전기요금 계산기, MBTI 테스트, 칼로리 계산, 복리 계산, 운세, 타이핑 게임 등 48개 이상의 무료 웹앱을 한 곳에서! 광고 없이 깔끔하게, 모바일 최적화로 언제 어디서나 편리하게 사용하세요. ⭐",
  keywords: [
    "무료 웹앱", "계산기", "전기요금 계산기", "복리 계산기", "칼로리 계산", 
    "MBTI 테스트", "IQ 테스트", "운세", "사주", "타이핑 게임",
    "건강 도구", "금융 계산", "생산성 도구", "미니 게임",
    "모바일 웹앱", "무료 도구", "온라인 계산기"
  ],
  authors: [{ name: "Kim Seu Jun" }],
  creator: "BION",
  publisher: "BION",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bionvibe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BION - 48개 무료 웹앱 모음",
    description: "일상에 필요한 모든 도구를 한 곳에! 계산기, 운세, 게임, 건강 관리 등",
    url: 'https://bionvibe.com',
    siteName: 'BION',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BION - 48개 무료 웹앱 모음',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BION - 48개 무료 웹앱 모음",
    description: "일상에 필요한 모든 도구를 한 곳에!",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console에서 받은 코드로 교체
  },
  other: {
    "google-adsense-account": "ca-pub-4564769502264231",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Google Analytics ID
const GA_ID = 'G-DGQPGH00WH';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors" suppressHydrationWarning>
        {/* Google Analytics */}
        <GoogleAnalytics gaId={GA_ID} />
        
        {/* Google AdSense */}
        <GoogleAdSense publisherId="ca-pub-4564769502264231" />
        
        <SupabaseProvider>
          <Navigation />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
