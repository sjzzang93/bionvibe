'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/apps/eye-pro/acuity', label: '시력' },
  { href: '/apps/eye-pro/color', label: '색각' },
  { href: '/apps/eye-pro/presbyopia', label: '노안' },
];

export default function Tabs() {
  const p = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white/95 backdrop-blur">
      <ul className="grid grid-cols-3">
        {tabs.map((t) => {
          const active = p?.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`block text-center py-3 ${
                  active ? 'font-bold' : 'text-neutral-600'
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

