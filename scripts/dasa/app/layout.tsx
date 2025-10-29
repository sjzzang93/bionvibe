import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "고깃집 가격 시뮬레이터",
  description: "고깃집의 가격 인하 및 회전율 전략을 검증하는 계산기",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  )
}
