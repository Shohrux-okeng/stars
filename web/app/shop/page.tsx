'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PageContainer } from '@/components/page-container';
import { useState } from 'react';

const shopItems = [
  { id: 1, name: 'Uzbekistan', price: 100, emoji: '🇺🇿', description: 'Uzbek flag sticker' },
  { id: 2, name: 'Star Pack', price: 500, emoji: '⭐', description: '5 premium stars' },
  { id: 3, name: 'Galaxy Bundle', price: 1000, emoji: '🌌', description: '10 premium stars + bonus' },
  { id: 4, name: 'Diamond Pass', price: 5000, emoji: '💎', description: 'Premium for 1 month' },
  { id: 5, name: 'Platinum Elite', price: 10000, emoji: '👑', description: 'VIP status + benefits' },
  { id: 6, name: 'Ultimate Pack', price: 50000, emoji: '🚀', description: 'All features unlocked' },
];

export default function Shop() {
  const [cart, setCart] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<typeof shopItems[0] | null>(null);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, id) => {
      const item = shopItems.find(item => item.id === id);
      return total + (item?.price || 0);
    }, 0);
  };

  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Do&apos;kon</h1>
          <p className="text-foreground-dim mb-6">Premium xizmatlarni sotib oling</p>

          {/* Shop Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {shopItems.map((item) => (
              <div
                key={item.id}
                className="glass glass-hover p-6 rounded-xl cursor-pointer group transition transform hover:scale-105"
              >
                <div className="flex flex-col h-full">
                  <div className="text-5xl mb-3">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.name}</h3>
                  <p className="text-foreground-dim text-sm mb-4 flex-1">{item.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-foreground-dim text-xs">Narxi</p>
                      <p className="text-2xl font-bold gradient-text">{item.price}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="gradient-button text-white px-4 py-2 rounded-lg font-semibold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96">
              <div className="glass p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-foreground-dim text-sm">Jami narx</p>
                    <p className="text-2xl font-bold gradient-text">{getTotalPrice().toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-accent-pink text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                      {cart.length}
                    </span>
                  </div>
                </div>
                <button className="gradient-button w-full text-white py-3 rounded-lg font-semibold">
                  Sotib olish
                </button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
