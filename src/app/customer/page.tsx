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
import { getTierConfig, getNextTier, getPointsToNextTier } from '@/lib/tiers';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Sparkles,
  Crown,
  Gift,
  History,
  User,
  ArrowRight,
  TrendingUp,
  Receipt,
  Store,
  ChevronRight,
  CreditCard,
  Bell
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { state, dispatch, getCustomerTransactions, getCustomerNotifications } = useApp();

  // Active customer (defaults to Rahul Kumar if none selected)
  const customer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 text-center px-4">
          <h2 className="text-xl font-bold">No customer profile active</h2>
          <p className="text-sm text-stone-500 mt-2">
            Please register or select a customer profile to view the loyalty dashboard.
          </p>
          <Link href="/join" className="mt-4 inline-block">
            <Button>Create Loyalty Profile</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const transactions = getCustomerTransactions(customer.id);
  const notifications = getCustomerNotifications(customer.id);
  const tierConfig = getTierConfig(customer.currentTier);
  const nextTier = getNextTier(customer.currentTier);

  // Calculate tier progress percentage
  let progressPercent = 100;
  let remainingPoints = 0;
  if (nextTier) {
    const tierSpan = nextTier.minPoints - tierConfig.minPoints;
    const pointsInTier = customer.lifetimePoints - tierConfig.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((pointsInTier / tierSpan) * 100)));
    remainingPoints = Math.max(0, nextTier.minPoints - customer.lifetimePoints);
  }

  // Count available rewards customer can redeem right now
  const eligibleRewardsCount = state.rewards.filter(
    r => r.status === 'Active' && customer.availablePoints >= r.pointsRequired
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Header & Member Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#159028]">
                CUSTOMER LOYALTY DASHBOARD
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-mono text-stone-500">ID: {customer.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1 font-serif">
              Hi, {customer.fullName} 👋
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Physical store loyalty member since {formatDate(customer.registrationDate)} • Mobile: +91 {customer.mobile}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/customer/rewards">
              <Button className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
                <Gift className="w-3.5 h-3.5" />
                Redeem Rewards ({eligibleRewardsCount})
              </Button>
            </Link>
            <Link href="/admin/purchases">
              <Button variant="outline" className="text-xs border-stone-300 gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#159028]" />
                Simulate Store Bill
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Points */}
          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Available Points
                </span>
                <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {customer.availablePoints.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 ml-1">pts</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Ready to redeem for rewards
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Current Tier */}
          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Current Tier
                </span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {customer.currentTier}
                </span>
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
                  className="text-[10px]"
                >
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {tierConfig.benefits[0]}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Lifetime Points */}
          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Lifetime Points
                </span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {customer.lifetimePoints.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 ml-1">pts</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                From {customer.totalPurchases} store purchases
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Available Rewards */}
          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Available Rewards
                </span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Gift className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {eligibleRewardsCount}
                </span>
                <span className="text-xs text-stone-500 ml-1">unlocked</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Out of {state.rewards.length} rewards catalogue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Membership Tier Progress Card */}
        <Card className="border-stone-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Tier Advancement Progress
                </span>
                <div className="text-base font-bold text-stone-900 mt-0.5">
                  {nextTier ? (
                    <>
                      {customer.lifetimePoints.toLocaleString('en-IN')} / {nextTier.minPoints.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-stone-500">points</span>
                    </>
                  ) : (
                    <span>Highest Membership Tier Achieved (Platinum Elite)</span>
                  )}
                </div>
              </div>

              {nextTier && (
                <div className="text-xs font-semibold text-[#159028] bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-auto border border-emerald-100">
                  {remainingPoints.toLocaleString('en-IN')} points to {nextTier.name}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <Progress value={progressPercent} className="h-3" />

            <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-800">
                {customer.currentTier} ({tierConfig.minPoints.toLocaleString('en-IN')} pts)
              </span>
              {nextTier ? (
                <span className="font-semibold text-stone-800">
                  {nextTier.name} ({nextTier.minPoints.toLocaleString('en-IN')} pts)
                </span>
              ) : (
                <span className="text-purple-700 font-semibold">VIP Status Active</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/customer/rewards">
            <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#159028] hover:shadow-sm transition-all group flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#159028] transition-colors">
                  View Rewards
                </div>
                <div className="text-[11px] text-stone-500">Browse catalogue</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#159028] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/customer/transactions">
            <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#159028] hover:shadow-sm transition-all group flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#159028] transition-colors">
                  Transaction History
                </div>
                <div className="text-[11px] text-stone-500">Store bills & rewards</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#159028] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/customer/membership">
            <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#159028] hover:shadow-sm transition-all group flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#159028] transition-colors">
                  Membership Benefits
                </div>
                <div className="text-[11px] text-stone-500">Explore 4 tiers</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#159028] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/customer/profile">
            <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#159028] hover:shadow-sm transition-all group flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#159028] transition-colors">
                  View Profile
                </div>
                <div className="text-[11px] text-stone-500">Card details & ID</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#159028] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>

        {/* Grid: Recent Activity & Featured Unlocked Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Recent Activity</h3>
              <Link
                href="/customer/transactions"
                className="text-xs text-[#159028] font-semibold hover:underline flex items-center gap-1"
              >
                View all ({transactions.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
              {transactions.slice(0, 5).map(txn => {
                const isEarned = txn.points > 0;
                return (
                  <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isEarned
                            ? 'bg-emerald-50 text-[#159028]'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {isEarned ? <Receipt className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{txn.description}</div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(txn.date)}</span>
                          <span>•</span>
                          <span>{txn.store}</span>
                          {txn.billNumber !== '-' && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{txn.billNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-black ${
                          isEarned ? 'text-[#159028]' : 'text-stone-900'
                        }`}
                      >
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
                <div className="p-8 text-center text-xs text-stone-500">
                  No purchases recorded yet. Visit any Westside store and share your mobile number at checkout!
                </div>
              )}
            </div>
          </div>

          {/* Available Rewards Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Featured Rewards</h3>
              <Link
                href="/customer/rewards"
                className="text-xs text-[#159028] font-semibold hover:underline flex items-center gap-1"
              >
                All Rewards ({state.rewards.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {state.rewards.slice(0, 3).map(reward => {
                const canRedeem = customer.availablePoints >= reward.pointsRequired;
                return (
                  <Card key={reward.id} className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{reward.name}</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                            {reward.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-black text-[#159028]">
                              {reward.pointsRequired} pts
                            </span>
                            {canRedeem ? (
                              <Badge variant="green" className="text-[9px] py-0">
                                Unlocked
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-stone-400">
                                Need {reward.pointsRequired - customer.availablePoints} more pts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link href="/customer/rewards">
                        <Button
                          size="sm"
                          variant={canRedeem ? 'default' : 'outline'}
                          className={`text-xs h-8 px-3 shrink-0 ${
                            canRedeem ? 'bg-[#159028] hover:bg-emerald-700 text-white' : 'text-stone-500'
                          }`}
                        >
                          {canRedeem ? 'Redeem' : 'View'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
