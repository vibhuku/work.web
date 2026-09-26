'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { MOCK_MONTHLY_DATA } from '@/lib/mock-data';
import {
  Users,
  Sparkles,
  Gift,
  Store,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Crown,
  ChevronRight,
  Plus,
  BarChart3,
  Sliders,
  Bell
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { state } = useApp();

  // Aggregate metrics
  const totalMembers = 25430 + (state.customers.length - 22);
  const totalPointsIssued = '8.4M';
  const totalRewardsRedeemed = '12,540';
  const activeStores = 120;

  // Tier counts from live state
  const bronzeCount = state.customers.filter(c => c.currentTier === 'Bronze').length;
  const silverCount = state.customers.filter(c => c.currentTier === 'Silver').length;
  const goldCount = state.customers.filter(c => c.currentTier === 'Gold').length;
  const platinumCount = state.customers.filter(c => c.currentTier === 'Platinum').length;
  const totalStateCust = state.customers.length || 1;

  const tierPercentages = {
    Bronze: Math.round((bronzeCount / totalStateCust) * 100),
    Silver: Math.round((silverCount / totalStateCust) * 100),
    Gold: Math.round((goldCount / totalStateCust) * 100),
    Platinum: Math.round((platinumCount / totalStateCust) * 100),
  };

  return (
    <AdminLayout
      title="Loyalty Intelligence & Executive Overview"
      subtitle="Nationwide retail performance across 120+ physical stores, tier velocity, and points economics."
      actionButton={
        <div className="flex items-center gap-2">
          <Link href="/admin/purchases">
            <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
              <Receipt className="w-3.5 h-3.5" />
              Add Store Purchase (POS)
            </Button>
          </Link>
          <Link href="/admin/rewards">
            <Button size="sm" variant="outline" className="text-xs border-stone-300">
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Reward
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 4 Primary Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                  Total Loyalty Members
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {totalMembers.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+1,380 this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                  Total Points Issued
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {totalPointsIssued}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>₹250 = 1 Point rule</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                  Rewards Claimed
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {totalRewardsRedeemed}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>15 active vouchers</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                  Active Retail Stores
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {activeStores}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium mt-1">
                  <span>Pan-India POS terminals</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Monthly Velocity Trends Chart & Tier Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Trends Bar Visualization */}
          <div className="lg:col-span-8">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Monthly Loyalty Points Issuance</CardTitle>
                  <CardDescription className="text-xs">
                    In-store points earned vs points redeemed over the last 6 months.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#159028]"></span>
                    Earned
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-600"></span>
                    Redeemed
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2">
                  {MOCK_MONTHLY_DATA.map(item => {
                    const maxPt = 70000;
                    const earnedHeight = Math.round((item.pointsEarned / maxPt) * 100);
                    const redeemedHeight = Math.round((item.pointsRedeemed / maxPt) * 100);

                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex items-end justify-center gap-1.5 h-48">
                          {/* Earned Bar */}
                          <div
                            style={{ height: `${earnedHeight}%` }}
                            className="w-full max-w-[28px] bg-[#159028] rounded-t-md hover:bg-emerald-700 transition-all relative group/bar"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-stone-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              +{(item.pointsEarned / 1000).toFixed(0)}k pts
                            </span>
                          </div>

                          {/* Redeemed Bar */}
                          <div
                            style={{ height: `${redeemedHeight}%` }}
                            className="w-full max-w-[28px] bg-purple-600 rounded-t-md hover:bg-purple-700 transition-all relative group/bar2"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-stone-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/bar2:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              -{(item.pointsRedeemed / 1000).toFixed(0)}k pts
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-stone-600">{item.month}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Avg In-Store Bill</span>
                    <span className="font-bold text-stone-900">₹3,450</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Avg Points/Bill</span>
                    <span className="font-bold text-[#159028]">+14 Pts</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Redemption Ratio</span>
                    <span className="font-bold text-purple-700">28.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership Tier Distribution */}
          <div className="lg:col-span-4">
            <Card className="border-stone-200 shadow-sm h-full flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-base font-bold">Tier Distribution</CardTitle>
                <CardDescription className="text-xs">
                  Live segmentation across membership tiers.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5 text-amber-800">
                        <span>🥉</span> Bronze (0-999)
                      </span>
                      <span>{tierPercentages.Bronze}% ({bronzeCount})</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tierPercentages.Bronze}%` }}
                        className="h-full bg-amber-600 rounded-full"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span>🥈</span> Silver (1k-5k)
                      </span>
                      <span>{tierPercentages.Silver}% ({silverCount})</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tierPercentages.Silver}%` }}
                        className="h-full bg-slate-500 rounded-full"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5 text-yellow-700">
                        <span>🥇</span> Gold (5k-15k)
                      </span>
                      <span>{tierPercentages.Gold}% ({goldCount})</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tierPercentages.Gold}%` }}
                        className="h-full bg-yellow-500 rounded-full"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5 text-purple-800">
                        <span>💎</span> Platinum (15k+)
                      </span>
                      <span>{tierPercentages.Platinum}% ({platinumCount})</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tierPercentages.Platinum}%` }}
                        className="h-full bg-purple-600 rounded-full"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <span className="font-bold text-stone-900 block mb-0.5">Automated Tier Upgrades:</span>
                  Customers automatically transition between tiers the moment new bill points are recorded at POS.
                </div>
              </CardContent>

              <div className="p-4 border-t border-stone-100">
                <Link href="/admin/membership" className="w-full block">
                  <Button variant="outline" className="w-full text-xs">
                    Configure Tier Rules →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Recent Store Bills Log & Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Store Bills */}
          <div className="lg:col-span-7">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Recent POS Store Purchases</CardTitle>
                  <CardDescription className="text-xs">
                    Latest in-store transactions processed by cashier staff.
                  </CardDescription>
                </div>
                <Link href="/admin/purchases" className="text-xs text-[#159028] font-bold hover:underline">
                  + Add Bill
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-stone-100 text-xs">
                  {state.transactions.slice(0, 6).map(txn => {
                    const customer = state.customers.find(c => c.id === txn.customerId);
                    const isEarned = txn.points > 0;

                    return (
                      <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isEarned ? 'bg-emerald-50 text-[#159028]' : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {isEarned ? <Receipt className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900">
                              {customer ? customer.fullName : 'Customer'}
                              <span className="text-stone-400 font-normal ml-1">({txn.billNumber})</span>
                            </div>
                            <div className="text-[11px] text-stone-400 mt-0.5">
                              {formatDate(txn.date)} • {txn.store}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`font-black text-sm ${
                              isEarned ? 'text-[#159028]' : 'text-stone-900'
                            }`}
                          >
                            {isEarned ? `+${txn.points}` : `${txn.points}`} pts
                          </div>
                          {txn.purchaseAmount > 0 && (
                            <div className="text-[11px] text-stone-400 font-mono">
                              {formatCurrency(txn.purchaseAmount)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top VIP Loyalty Customers */}
          <div className="lg:col-span-5">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Top Store Shoppers</CardTitle>
                  <CardDescription className="text-xs">
                    Highest lifetime points and store frequency.
                  </CardDescription>
                </div>
                <Link href="/admin/customers" className="text-xs text-[#159028] font-bold hover:underline">
                  All ({state.customers.length})
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-stone-100 text-xs">
                  {state.customers
                    .slice()
                    .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
                    .slice(0, 5)
                    .map(cust => (
                      <Link
                        key={cust.id}
                        href={`/admin/customers/${cust.id}`}
                        className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors block"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                            {cust.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{cust.fullName}</span>
                              <Badge
                                variant={
                                  cust.currentTier === 'Platinum'
                                    ? 'platinum'
                                    : cust.currentTier === 'Gold'
                                    ? 'gold'
                                    : cust.currentTier === 'Silver'
                                    ? 'silver'
                                    : 'bronze'
                                }
                                className="text-[9px] py-0"
                              >
                                {cust.currentTier}
                              </Badge>
                            </div>
                            <div className="text-[11px] text-stone-400 font-mono">
                              +91 {cust.mobile} • {cust.totalPurchases} visits
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-stone-900">
                            {cust.availablePoints.toLocaleString('en-IN')} pts
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {formatCurrency(cust.totalPurchaseAmount)}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
