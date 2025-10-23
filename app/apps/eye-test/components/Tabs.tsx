'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/apps/eye-test', label: '홈' },
  { href: '/apps/eye-test/acuity', label: '시력' },
  { href: '/apps/eye-test/color', label: '색각' },
  { href: '/apps/eye-test/presbyopia', label: '노안' },
];

export default function Tabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white/95 backdrop-blur-sm z-50 safe-area-inset-bottom">
      <ul className="grid grid-cols-4 max-w-md mx-auto">
        {tabs.map((t) => {
          const active = pathname === t.href || (t.href !== '/apps/eye-test' && pathname?.startsWith(t.href));
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`block text-center py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'text-black font-bold border-t-2 border-black'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

