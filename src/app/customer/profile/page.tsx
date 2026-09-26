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
import { getTierConfig, getNextTier } from '@/lib/tiers';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  User,
  Phone,
  Calendar,
  Sparkles,
  Crown,
  Gift,
  History,
  ShieldCheck,
  CreditCard,
  Receipt,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { state, getCustomerTransactions } = useApp();

  const customer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  if (!customer) return null;

  const transactions = getCustomerTransactions(customer.id);
  const earnedTxns = transactions.filter(t => t.type === 'Earned');
  const redeemedTxns = transactions.filter(t => t.type === 'Redeemed');
  const tierConfig = getTierConfig(customer.currentTier);
  const nextTier = getNextTier(customer.currentTier);

  let progressPercent = 100;
  let remainingPoints = 0;
  if (nextTier) {
    const tierSpan = nextTier.minPoints - tierConfig.minPoints;
    const pointsInTier = customer.lifetimePoints - tierConfig.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((pointsInTier / tierSpan) * 100)));
    remainingPoints = Math.max(0, nextTier.minPoints - customer.lifetimePoints);
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
              Customer Loyalty Profile
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Complete loyalty account details, membership tier progress, and in-store activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/customer/rewards">
              <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Redeem Rewards
              </Button>
            </Link>
            <Link href="/admin/purchases">
              <Button size="sm" variant="outline" className="text-xs border-stone-300">
                Staff Bill Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Section: Membership Card + Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Virtual Membership Card */}
          <div className="md:col-span-5">
            <div className="h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D0D0D] via-stone-900 to-stone-800 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-stone-700">
              {/* Background emblem */}
              <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-[#159028]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-widest text-white font-serif uppercase">
                      WESTSIDE
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#159028] font-bold">
                      CLUB REWARDS
                    </span>
                  </div>
                  <Badge
                    variant={
                      customer.currentTier === 'Platinum'
                        ? 'platinum'
                        : customer.currentTier === 'Gold'
                        ? 'gold'
                        : customer.currentTier === 'Silver'
                        ? 'silver'
                        : 'bronze'
                    }
                    className="text-xs font-semibold px-3 py-1 shadow-sm"
                  >
                    {customer.currentTier} Member
                  </Badge>
                </div>

                <div className="mt-8">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">MEMBER NAME</div>
                  <div className="text-xl font-bold tracking-wide mt-0.5">{customer.fullName}</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-700/60 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">LOYALTY ID</div>
                  <div className="text-sm font-mono font-bold tracking-widest text-emerald-400">
                    {customer.id}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider text-right">
                    AVAILABLE POINTS
                  </div>
                  <div className="text-xl font-black text-white text-right">
                    {customer.availablePoints.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile Details Card */}
          <div className="md:col-span-7">
            <Card className="border-stone-200 shadow-sm h-full">
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-base font-bold">Profile Information</CardTitle>
                <CardDescription className="text-xs">
                  Physical store identification and credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block mb-1">Full Legal Name</span>
                    <span className="font-bold text-stone-900 text-sm">{customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-1">Registered Mobile</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      +91 {customer.mobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-1">Customer Loyalty ID</span>
                    <span className="font-mono font-bold text-[#159028] text-sm">{customer.id}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-1">Enrolment Date</span>
                    <span className="font-medium text-stone-900">{formatDate(customer.registrationDate)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-1">Account Status</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#159028]"></span>
                      Active & Good Standing
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-1">Total Store Visits</span>
                    <span className="font-bold text-stone-900">{customer.totalPurchases} purchases</span>
                  </div>
                </div>

                {/* Tier Progress Inside Profile */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800">
                      Tier Progress: {customer.currentTier}
                    </span>
                    {nextTier ? (
                      <span className="text-stone-600 font-semibold">
                        {customer.lifetimePoints.toLocaleString('en-IN')} / {nextTier.minPoints.toLocaleString('en-IN')} pts
                      </span>
                    ) : (
                      <span className="text-purple-700 font-bold">Max Tier</span>
                    )}
                  </div>
                  <Progress value={progressPercent} className="h-2.5" />
                  {nextTier && (
                    <p className="text-[11px] text-stone-500">
                      Spend ₹{(remainingPoints * state.pointsRule.amountPerPoint).toLocaleString('en-IN')} (earn {remainingPoints} pts) to advance to <strong className="text-stone-800">{nextTier.name}</strong>.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Points Breakdown Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-stone-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-[#159028]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-medium">Available to Redeem</span>
                <div className="text-2xl font-black text-stone-900">
                  {customer.availablePoints.toLocaleString('en-IN')} pts
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-medium">Lifetime Earned</span>
                <div className="text-2xl font-black text-stone-900">
                  {customer.lifetimePoints.toLocaleString('en-IN')} pts
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-700">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-medium">Rewards Redeemed</span>
                <div className="text-2xl font-black text-stone-900">
                  {redeemedTxns.length} Vouchers
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Activity: Purchase History vs Points History vs Redemption History */}
        <Card className="border-stone-200">
          <CardHeader className="border-b border-stone-100">
            <CardTitle className="text-base font-bold">Activity History</CardTitle>
            <CardDescription className="text-xs">
              Review your full record of physical in-store purchases and reward redemptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="divide-y divide-stone-100">
              {transactions.map(txn => {
                const isEarned = txn.points > 0;
                return (
                  <div key={txn.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          isEarned ? 'bg-emerald-50 text-[#159028]' : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {isEarned ? '+' : '-'}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{txn.description}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {formatDate(txn.date)} • {txn.store}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${isEarned ? 'text-[#159028]' : 'text-stone-900'}`}>
                        {isEarned ? `+${txn.points}` : `${txn.points}`} pts
                      </div>
                      {txn.purchaseAmount > 0 && (
                        <div className="text-[11px] text-stone-400">
                          {formatCurrency(txn.purchaseAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {transactions.length === 0 && (
                <div className="text-center py-8 text-xs text-stone-500">
                  No transaction history recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
