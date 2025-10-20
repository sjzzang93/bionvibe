import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "./components/Navigation";

export const metadata: Metadata = {
  title: "BION - 일상을 특별하게",
  description: "기술이 아닌 사람을 위한 공간. 당신의 하루를 더욱 풍요롭게 만들어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-gradient-to-br from-gray-50 via-white to-gray-50" suppressHydrationWarning>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4564769502264231"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
