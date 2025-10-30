import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-700/50">
      <div className="text-center">
        {/* 필수 페이지 링크 - 애드센스 승인 필수 */}
        <div className="flex justify-center gap-4 mb-4 text-xs">
          <Link
            href="/about"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            About
          </Link>
          <span className="text-gray-600">·</span>
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
          <span className="text-gray-600">·</span>
          <Link
            href="/terms"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Terms
          </Link>
          <span className="text-gray-600">·</span>
          <Link
            href="/contact"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            문의하기
          </Link>
        </div>

        <p className="text-gray-400 text-sm font-medium mb-1" style={{ fontFamily: 'system-ui, -apple-system' }}>
          Make Blight, Make Play
        </p>
        <p className="text-gray-500 text-xs">
          — by <span className="text-gray-300 font-semibold">BION</span> · <span className="text-gray-400">Seojun Kim</span>
        </p>
      </div>
    </footer>
  );
}
