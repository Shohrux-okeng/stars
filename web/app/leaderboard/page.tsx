'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PageContainer } from '@/components/page-container';
import { useState } from 'react';

const leaderboardData = [
  { rank: 1, name: '@UZ_CS', amount: 176760, badge: '🥇' },
  { rank: 2, name: '@Theo_updates', amount: 150000, badge: '🥈' },
  { rank: 3, name: '@Abdiazizova_0811', amount: 108000, badge: '🥉' },
  { rank: 4, name: '@wheyway', amount: 36000 },
  { rank: 5, name: '@mxmdvna_sh', amount: 29700 },
  { rank: 6, name: '@kamron201', amount: 27000 },
  { rank: 7, name: '@VAQTIM_YUO', amount: 18000 },
  { rank: 8, name: '@Berdaxxx', amount: 18000 },
  { rank: 9, name: '@gafurjanov_567', amount: 18000 },
  { rank: 10, name: '@abdusamadjon', amount: 18000 },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'bugun' | 'hafta' | 'oy'>('bugun');

  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Savdo reyting</h1>
          <p className="text-foreground-dim mb-6">Kim ko&apos;p sotib oldi?</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['bugun', 'hafta', 'oy'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab
                    ? 'gradient-button text-white'
                    : 'glass text-foreground-muted hover:text-foreground'
                }`}
              >
                {tab === 'bugun' && 'Bugun'}
                {tab === 'hafta' && 'Bu hafta'}
                {tab === 'oy' && 'Bu oy'}
              </button>
            ))}
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboardData.map((item) => (
              <div
                key={item.rank}
                className="glass glass-hover p-4 flex items-center justify-between hover:bg-background-card-hover transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white font-bold">
                    {item.badge || item.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold gradient-text">{item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Your Rank */}
          <div className="mt-8 glass glass-hover p-6 border border-accent-pink/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-blue to-accent-pink flex items-center justify-center text-white font-bold text-lg">
                  12
                </div>
                <div>
                  <p className="text-foreground-dim text-sm">Sizning o&apos;rningiz</p>
                  <p className="text-lg font-semibold text-foreground">@shohrux_okeng</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-foreground-dim text-sm">Jami buyurtma</p>
                <p className="text-2xl font-bold gradient-text">8,450</p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
