'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PageContainer } from '@/components/page-container';
import Link from 'next/link';

export default function Profile() {
  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Mening profil</h1>

          {/* Profile Card */}
          <div className="glass glass-hover p-6 md:p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">@shohrux_okeng</h2>
                  <p className="text-foreground-dim text-sm">ID: 1234567890</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-success/20 text-success text-xs rounded-full font-semibold">Faol</span>
                    <span className="px-3 py-1 bg-accent-pink/20 text-accent-pink text-xs rounded-full font-semibold">Premium</span>
                  </div>
                </div>
              </div>
              <button className="text-foreground-muted hover:text-foreground transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="glass p-4 text-center rounded-lg">
              <p className="text-foreground-dim text-xs mb-1">Balans</p>
              <p className="text-2xl font-bold gradient-text">2,251</p>
            </div>
            <div className="glass p-4 text-center rounded-lg">
              <p className="text-foreground-dim text-xs mb-1">Xaridlar</p>
              <p className="text-2xl font-bold text-success">47</p>
            </div>
            <div className="glass p-4 text-center rounded-lg">
              <p className="text-foreground-dim text-xs mb-1">Daromad</p>
              <p className="text-2xl font-bold text-warning">8,450</p>
            </div>
            <div className="glass p-4 text-center rounded-lg">
              <p className="text-foreground-dim text-xs mb-1">Reytingi</p>
              <p className="text-2xl font-bold text-accent-blue">#12</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3 mb-8">
            <Link href="/tarix">
              <div className="glass glass-hover p-4 flex items-center justify-between cursor-pointer rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-foreground">Tarix</span>
                </div>
                <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <div className="glass glass-hover p-4 flex items-center justify-between cursor-pointer rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                  </svg>
                </div>
                <span className="font-semibold text-foreground">Ko&apos;chirib olish</span>
              </div>
              <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="glass glass-hover p-4 flex items-center justify-between cursor-pointer rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-pink/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-foreground">Sozlamalar</span>
              </div>
              <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <button className="glass glass-hover p-4 flex items-center justify-between cursor-pointer rounded-lg w-full text-left hover:text-error">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-semibold text-foreground">Chiqib ketish</span>
              </div>
              <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
