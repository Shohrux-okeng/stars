'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-light backdrop-blur-sm bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-pink flex items-center justify-center text-white font-bold text-sm">⭐</div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">Stars</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-foreground-muted hover:text-foreground transition">
              Leaderboard
            </Link>
            <Link href="/shop" className="text-foreground-muted hover:text-foreground transition">
              Shop
            </Link>
            <Link href="/premium" className="text-foreground-muted hover:text-foreground transition">
              Premium
            </Link>
            <Link href="/referral" className="text-foreground-muted hover:text-foreground transition">
              Referral
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-lg hidden sm:flex items-center gap-2">
              <span className="text-foreground-dim text-sm">Balance:</span>
              <span className="text-lg font-bold gradient-text">2,251</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-background-secondary rounded-lg transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border-light space-y-2">
            <Link href="/leaderboard" className="block px-4 py-2 text-foreground-muted hover:text-foreground transition rounded-lg hover:bg-background-secondary">
              Leaderboard
            </Link>
            <Link href="/shop" className="block px-4 py-2 text-foreground-muted hover:text-foreground transition rounded-lg hover:bg-background-secondary">
              Shop
            </Link>
            <Link href="/premium" className="block px-4 py-2 text-foreground-muted hover:text-foreground transition rounded-lg hover:bg-background-secondary">
              Premium
            </Link>
            <Link href="/referral" className="block px-4 py-2 text-foreground-muted hover:text-foreground transition rounded-lg hover:bg-background-secondary">
              Referral
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
