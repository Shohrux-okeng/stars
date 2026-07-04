'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border-light glass bg-background/80">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/') ? 'text-accent-pink' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9" />
          </svg>
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/leaderboard"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/leaderboard') ? 'text-accent-pink' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">Stars</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/shop') ? 'text-accent-pink' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">Shop</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/profile') ? 'text-accent-pink' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Me</span>
        </Link>
      </div>
    </nav>
  );
}
