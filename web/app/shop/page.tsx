'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PageContainer } from '@/components/page-container';
import { useState } from 'react';

// Product catalogs from bot
const STARS_PRESETS = [50, 75, 100, 150, 250, 350, 500, 750, 1000, 1500, 2500, 5000, 10000];
const STAR_RATE = 11.5; // so'm per star

const PREMIUM_PLANS = [
  { id: 'p1', label: '1 oy', price: 40000, emoji: '💎' },
  { id: 'p3', label: '3 oy', price: 160000, emoji: '💎' },
  { id: 'p6', label: '6 oy', price: 220000, emoji: '💎' },
  { id: 'p12', label: '12 oy', price: 390000, emoji: '💎' },
];

const PUBG_PLANS = [
  { id: 'uc60', label: '60 UC', price: 12000, emoji: '🎮' },
  { id: 'uc325', label: '325 UC', price: 60000, emoji: '🎮' },
  { id: 'uc660', label: '660 UC', price: 115000, emoji: '🎮' },
  { id: 'uc1800', label: '1800 UC', price: 300000, emoji: '🎮' },
  { id: 'uc3850', label: '3850 UC', price: 620000, emoji: '🎮' },
  { id: 'uc8100', label: '8100 UC', price: 1250000, emoji: '🎮' },
];

const GIFTS = [
  { id: 'heart', label: 'Yurak', price: 3000, emoji: '💝' },
  { id: 'bear', label: 'Ayiq', price: 3000, emoji: '🧸' },
  { id: 'giftbox', label: 'Sovg\'a qutisi', price: 5000, emoji: '🎁' },
  { id: 'rose', label: 'Gul', price: 5000, emoji: '🌹' },
  { id: 'cake', label: 'Keks', price: 10000, emoji: '🎂' },
  { id: 'rocket', label: 'Raketa', price: 10000, emoji: '🚀' },
  { id: 'ring', label: 'Halqa', price: 20000, emoji: '💍' },
  { id: 'trophy', label: 'Kupa', price: 20000, emoji: '🏆' },
  { id: 'diamond', label: 'Almoz', price: 20000, emoji: '💎' },
];

type CartItem = {
  id: string;
  category: string;
  label: string;
  price: number;
  emoji: string;
};

export default function Shop() {
  const [activeTab, setActiveTab] = useState<'stars' | 'premium' | 'pubg' | 'gifts'>('stars');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const renderProducts = () => {
    switch (activeTab) {
      case 'stars':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {STARS_PRESETS.map((amount) => (
              <div
                key={amount}
                className="glass glass-hover p-4 rounded-lg cursor-pointer group transition transform hover:scale-105 flex flex-col items-center"
                onClick={() =>
                  addToCart({
                    id: `stars-${amount}`,
                    category: 'Stars',
                    label: `${amount} ⭐`,
                    price: Math.round(amount * STAR_RATE),
                    emoji: '⭐',
                  })
                }
              >
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-center font-bold text-foreground text-sm">{amount}</p>
                <p className="text-center text-foreground-dim text-xs mt-2">
                  {Math.round(amount * STAR_RATE).toLocaleString()} so&apos;m
                </p>
              </div>
            ))}
          </div>
        );
      case 'premium':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {PREMIUM_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="glass glass-hover p-6 rounded-lg cursor-pointer group transition transform hover:scale-105"
                onClick={() =>
                  addToCart({
                    id: plan.id,
                    category: 'Premium',
                    label: `Telegram Premium - ${plan.label}`,
                    price: plan.price,
                    emoji: plan.emoji,
                  })
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Telegram Premium</h3>
                    <p className="text-foreground-dim text-sm mb-3">{plan.label}</p>
                  </div>
                  <div className="text-2xl">{plan.emoji}</div>
                </div>
                <p className="text-2xl font-bold gradient-text">{plan.price.toLocaleString()} so&apos;m</p>
              </div>
            ))}
          </div>
        );
      case 'pubg':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {PUBG_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="glass glass-hover p-6 rounded-lg cursor-pointer group transition transform hover:scale-105"
                onClick={() =>
                  addToCart({
                    id: plan.id,
                    category: 'PUBG UC',
                    label: `${plan.label}`,
                    price: plan.price,
                    emoji: plan.emoji,
                  })
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">PUBG UC</h3>
                    <p className="text-foreground-dim text-sm mb-3">{plan.label}</p>
                  </div>
                  <div className="text-2xl">{plan.emoji}</div>
                </div>
                <p className="text-2xl font-bold gradient-text">{plan.price.toLocaleString()} so&apos;m</p>
              </div>
            ))}
          </div>
        );
      case 'gifts':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {GIFTS.map((gift) => (
              <div
                key={gift.id}
                className="glass glass-hover p-4 rounded-lg cursor-pointer group transition transform hover:scale-105 flex flex-col items-center text-center"
                onClick={() =>
                  addToCart({
                    id: gift.id,
                    category: 'Gifts',
                    label: gift.label,
                    price: gift.price,
                    emoji: gift.emoji,
                  })
                }
              >
                <div className="text-3xl mb-2">{gift.emoji}</div>
                <p className="text-center font-bold text-foreground text-sm">{gift.label}</p>
                <p className="text-center text-foreground-dim text-xs mt-2">
                  {gift.price.toLocaleString()} so&apos;m
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Do&apos;kon</h1>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'stars' as const, label: '⭐ Stars', icon: '⭐' },
              { id: 'premium' as const, label: '💎 Premium', icon: '💎' },
              { id: 'pubg' as const, label: '🎮 PUBG UC', icon: '🎮' },
              { id: 'gifts' as const, label: '🎁 Gifts', icon: '🎁' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'gradient-button text-white'
                    : 'glass text-foreground-dim hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="mb-8">{renderProducts()}</div>

          {/* Cart Modal */}
          {cart.length > 0 && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
              <div className="w-full glass rounded-t-2xl p-6 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Savat</h2>
                  <button
                    onClick={() => setCart([])}
                    className="text-foreground-muted hover:text-foreground"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-background-secondary rounded-lg">
                      <div>
                        <p className="text-foreground font-semibold">{item.label}</p>
                        <p className="text-foreground-dim text-sm">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-bold">{item.price.toLocaleString()} so&apos;m</span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-error hover:text-red-300 transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="border-t border-border-light pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-foreground-dim text-lg">Jami:</p>
                    <p className="text-2xl font-bold gradient-text">{getTotalPrice().toLocaleString()} so&apos;m</p>
                  </div>
                  <button className="gradient-button w-full text-white py-3 rounded-lg font-semibold">
                    Sotib olish ({cart.length})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
