import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import GoogleAnalytics from "./components/GoogleAnalytics";
import GoogleAdSense from "./components/GoogleAdSense";

export const metadata: Metadata = {
  title: "BION - 일상을 특별하게",
  description: "기술이 아닌 사람을 위한 공간. 당신의 하루를 더욱 풍요롭게 만들어드립니다.",
  other: {
    "google-adsense-account": "ca-pub-4564769502264231",
  },
};

// Google Analytics ID
const GA_ID = 'G-DGQPGH00WH';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Google Analytics */}
        <GoogleAnalytics gaId={GA_ID} />
        
        {/* Google AdSense */}
        <GoogleAdSense publisherId="ca-pub-4564769502264231" />
        
        <Navigation />
        {children}
      </body>
    </html>
  );
}
