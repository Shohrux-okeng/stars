'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(2251);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('10000');

  return (
    <>
      <Header />
      <PageContainer>
        {/* Balance Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Balansingiz</h1>
          
          <div className="glass glass-hover p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-foreground-dim text-sm mb-2">So&apos;m</p>
                <div className="flex items-baseline gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink flex items-center justify-center text-white text-lg font-bold">⭐</div>
                  <span className="text-4xl md:text-5xl font-bold gradient-text">{balance.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddFundsModal(true)}
                className="gradient-button text-white px-8 py-3 rounded-lg font-semibold w-full md:w-auto flex items-center justify-center gap-2"
              >
                <span>+</span>
                Hisobni to&apos;ldirish
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Stars olish */}
            <Link href="/shop">
              <div className="glass glass-hover p-6 rounded-xl cursor-pointer group transition transform hover:scale-105">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl">⭐</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Stars olish</h3>
                    <p className="text-foreground-dim text-sm">Telegram Stars</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-foreground-muted group-hover:text-accent-pink transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>

            {/* Premium olish */}
            <Link href="/premium">
              <div className="glass glass-hover p-6 rounded-xl cursor-pointer group transition transform hover:scale-105">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl">👑</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Premium olish</h3>
                    <p className="text-foreground-dim text-sm">Telegram Premium</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-foreground-muted group-hover:text-accent-pink transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Referral Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Referral</h2>
          <div className="glass glass-hover p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-foreground-dim text-sm mb-1">Referral link</p>
                <p className="text-lg font-semibold text-foreground-muted break-all">https://stars.uz/ref/shohrux</p>
              </div>
              <button className="text-accent-pink hover:text-accent-blue transition font-semibold whitespace-nowrap">
                Copy
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-foreground-dim text-sm">2% doimiy ulus</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass p-4 text-center">
            <p className="text-foreground-dim text-sm mb-1">Jami o&apos;rnak</p>
            <p className="text-2xl font-bold gradient-text">15,420</p>
          </div>
          <div className="glass p-4 text-center">
            <p className="text-foreground-dim text-sm mb-1">O&apos;rnamdan kiritgan</p>
            <p className="text-2xl font-bold text-success">3,100</p>
          </div>
          <div className="glass p-4 text-center">
            <p className="text-foreground-dim text-sm mb-1">Premium xaridlar</p>
            <p className="text-2xl font-bold text-warning">12</p>
          </div>
        </div>
      </PageContainer>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full glass rounded-t-2xl p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Balanasni to&apos;ldirish</h2>
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="text-foreground-muted hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-foreground-dim text-sm mb-2">SUMMA</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full bg-background-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent-pink"
              />
            </div>

            <button
              onClick={() => {
                setBalance(balance + parseInt(fundAmount));
                setShowAddFundsModal(false);
              }}
              className="gradient-button w-full text-white py-3 rounded-lg font-semibold"
            >
              To&apos;ldirish
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
