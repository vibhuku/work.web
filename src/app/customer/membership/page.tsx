'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TIER_CONFIG, getTierConfig, getNextTier } from '@/lib/tiers';
import {
  Crown,
  Sparkles,
  Check,
  Star,
  Gift,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Award
} from 'lucide-react';

export default function CustomerMembershipPage() {
  const { state } = useApp();

  const customer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const currentTierConfig = customer ? getTierConfig(customer.currentTier) : TIER_CONFIG[0];
  const nextTier = customer ? getNextTier(customer.currentTier) : TIER_CONFIG[1];

  let progressPercent = 100;
  let remainingPoints = 0;
  if (customer && nextTier) {
    const tierSpan = nextTier.minPoints - currentTierConfig.minPoints;
    const pointsInTier = customer.lifetimePoints - currentTierConfig.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((pointsInTier / tierSpan) * 100)));
    remainingPoints = Math.max(0, nextTier.minPoints - customer.lifetimePoints);
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
            MEMBERSHIP PRIVILEGES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-serif">
            Four Levels of Distinction.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every shopping trip to a physical Westside store elevates your tier. Earn points continuously to unlock elevated concierge perks, higher discounts, and VIP sale access.
          </p>
        </div>

        {/* Current Customer Milestone Banner */}
        {customer && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="green" className="text-xs">
                    Your Current Tier
                  </Badge>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-semibold text-stone-600">{customer.fullName}</span>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-black text-stone-900 font-serif">
                    {customer.currentTier} Member
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    ({customer.lifetimePoints.toLocaleString('en-IN')} Lifetime Points)
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Enjoying {currentTierConfig.rewardMultiplier}x point rewards multiplier and member benefits.
                </p>
              </div>

              {nextTier ? (
                <div className="md:w-80 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-500">Milestone to {nextTier.name}</span>
                    <span className="font-bold text-[#159028]">
                      {remainingPoints.toLocaleString('en-IN')} pts left
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2.5" />
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>{currentTierConfig.minPoints} pts</span>
                    <span>{nextTier.minPoints.toLocaleString('en-IN')} pts</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-xs font-medium flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>You have achieved our highest status: Platinum Member! 💎</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIER_CONFIG.map(tier => {
            const isCurrent = customer?.currentTier === tier.name;

            return (
              <div
                key={tier.name}
                className={`rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                  isCurrent
                    ? 'ring-2 ring-[#159028] bg-white shadow-xl -translate-y-1'
                    : 'bg-white border border-stone-200 shadow-sm hover:shadow-md'
                }`}
              >
                {isCurrent && (
                  <div className="bg-[#159028] text-white text-center py-1 text-[11px] font-bold tracking-wider uppercase">
                    Your Current Tier
                  </div>
                )}

                <div className="p-6 space-y-6">
                  {/* Top Tier Identity */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-1">{tier.icon}</div>
                      <h3 className="text-xl font-bold text-stone-900 font-serif">{tier.name}</h3>
                      <div className="text-xs text-stone-500 font-medium mt-0.5">
                        {tier.maxPoints === Infinity
                          ? `${tier.minPoints.toLocaleString('en-IN')}+ points`
                          : `${tier.minPoints.toLocaleString('en-IN')} – ${tier.maxPoints.toLocaleString('en-IN')} points`}
                      </div>
                    </div>
                    <Badge variant={tier.name.toLowerCase() as any} className="text-[10px]">
                      {tier.rewardMultiplier}x Points
                    </Badge>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-stone-100"></div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      TIER PRIVILEGES
                    </span>
                    <ul className="space-y-2.5 text-xs text-stone-600">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#159028] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 mt-4">
                  {isCurrent ? (
                    <Button disabled className="w-full bg-emerald-50 text-[#159028] font-bold text-xs border border-emerald-200 h-9">
                      Active Status
                    </Button>
                  ) : (
                    <Link href="/admin/purchases" className="w-full block">
                      <Button variant="outline" className="w-full text-xs h-9 text-stone-600 hover:text-stone-900">
                        Earn Points Toward Tier
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Comparison Matrix */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-100">
            <h3 className="text-lg font-bold text-stone-900 font-serif">Comprehensive Tier Comparison</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Side-by-side breakdown of privileges across Bronze, Silver, Gold, and Platinum.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Privilege / Feature</th>
                  <th className="py-3.5 px-4 text-center">Bronze</th>
                  <th className="py-3.5 px-4 text-center">Silver</th>
                  <th className="py-3.5 px-4 text-center">Gold</th>
                  <th className="py-3.5 px-4 text-center">Platinum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Points Requirement</td>
                  <td className="py-3.5 px-4 text-center font-mono">0 – 999</td>
                  <td className="py-3.5 px-4 text-center font-mono">1,000 – 4,999</td>
                  <td className="py-3.5 px-4 text-center font-mono">5,000 – 14,999</td>
                  <td className="py-3.5 px-4 text-center font-mono">15,000+</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Point Accrual Multiplier</td>
                  <td className="py-3.5 px-4 text-center">1.0x</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-[#159028]">1.25x</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-[#159028]">1.5x</td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#159028]">2.0x (Double)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Welcome Rewards</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Birthday Special Discount</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ (10% Off)</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ (15% Off)</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ (20% Off)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Early Access to Sales</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ 24 Hours</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ 48 Hours</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ 72 Hours VIP</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Complimentary Alterations</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Personal Stylist Session</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ (On Request)</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ Dedicated Stylist</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-stone-900">Complimentary Home Delivery</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">—</td>
                  <td className="py-3.5 px-4 text-center text-[#159028]">✓ Free Always</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
