'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PageContainer } from '@/components/page-container';
import Link from 'next/link';

const premiumPlans = [
  {
    name: 'Starter',
    price: 9999,
    duration: 'har oy',
    features: ['Ad-free experience', 'Priority support', '2 GB storage', 'Custom themes'],
    emoji: '🌟',
  },
  {
    name: 'Pro',
    price: 24999,
    duration: 'har oy',
    features: ['Everything in Starter', 'Advanced analytics', '50 GB storage', 'API access', 'Custom branding'],
    emoji: '⚡',
    popular: true,
  },
  {
    name: 'Elite',
    price: 49999,
    duration: 'har oy',
    features: ['Everything in Pro', 'Dedicated support', 'Unlimited storage', 'White label', 'Custom domain'],
    emoji: '👑',
  },
];

export default function Premium() {
  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Premium olish</h1>
          <p className="text-foreground-dim mb-8">Eksklusiv xususiyatlarni ochib tashlang</p>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {premiumPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`glass glass-hover p-6 rounded-xl relative transition transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-accent-pink md:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-blue to-accent-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Eng mashhur
                    </span>
                  </div>
                )}

                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                
                <div className="mb-6 pb-6 border-b border-border-light">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold gradient-text">{plan.price.toLocaleString()}</span>
                    <span className="text-foreground-dim text-sm">/{plan.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      <span className="text-foreground-dim text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'gradient-button text-white'
                      : 'glass text-foreground hover:bg-background-card-hover'
                  }`}
                >
                  Sotib olish
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Ko&apos;p beriladigan savollar</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'Premium otkasil, pulla qaytarila?',
                  a: 'Ha, 30 kun ichida pulla qaytarish garantiyasi bor. Istalgan vaqtda bekor qilish mumkin.',
                },
                {
                  q: 'Nechta qurilmada foydalanish mumkin?',
                  a: 'Siz 5 ta qurilmada bir vaqtda foydalanishingiz mumkin.',
                },
                {
                  q: 'Obunani bekor qilish qanday?',
                  a: 'Hisob sozlamalariga o\'ting va "Obunani bekor qilish" tugmasini bosing.',
                },
              ].map((item, idx) => (
                <details key={idx} className="glass p-4 rounded-lg cursor-pointer group">
                  <summary className="font-semibold text-foreground flex items-center justify-between">
                    {item.q}
                    <svg className="w-5 h-5 text-foreground-muted group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </summary>
                  <p className="text-foreground-dim text-sm mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}
