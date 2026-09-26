'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reward } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Clock,
  Tag,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerRewardsPage() {
  const { state, dispatch } = useApp();

  const customer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Shopping' | 'Discount' | 'Experience' | 'Special'>('All');
  const [redeemedVoucher, setRedeemedVoucher] = useState<{
    reward: Reward;
    code: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const filteredRewards = state.rewards.filter(r => {
    if (activeCategory !== 'All' && r.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const handleOpenRedeemModal = (reward: Reward) => {
    if (customer.availablePoints < reward.pointsRequired) {
      toast.error(`You need ${reward.pointsRequired - customer.availablePoints} more points to redeem this reward.`);
      return;
    }
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    dispatch({
      type: 'REDEEM_REWARD',
      payload: {
        customerId: customer.id,
        reward: selectedReward,
      },
    });

    const voucherCode = `WS-REWARD-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 60);

    setRedeemedVoucher({
      reward: selectedReward,
      code: voucherCode,
      expiresAt: expiry.toISOString().split('T')[0],
    });

    toast.success(`🎉 ${selectedReward.name} redeemed! ${selectedReward.pointsRequired} points deducted.`);
    setSelectedReward(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header Strip with Customer Point Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#159028]">
                REWARDS REPERTORY
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">{customer.fullName} ({customer.currentTier} Member)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif mt-1">
              Unlock Westside Rewards
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Redeem your points for store shopping vouchers, discounts, and exclusive experiences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-right">
              <div className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                Available Balance
              </div>
              <div className="text-xl font-black text-[#159028]">
                {customer.availablePoints.toLocaleString('en-IN')} <span className="text-xs font-normal">pts</span>
              </div>
            </div>
            <Link href="/admin/purchases">
              <Button variant="outline" size="sm" className="text-xs border-stone-300">
                + Earn More Points
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Shopping', 'Discount', 'Experience', 'Special'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0D0D0D] text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat === 'All' ? 'All Rewards' : `${cat} Rewards`}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map(reward => {
            const canRedeem = customer.availablePoints >= reward.pointsRequired;
            const pointsNeeded = reward.pointsRequired - customer.availablePoints;

            return (
              <Card
                key={reward.id}
                className="border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group bg-white"
              >
                <div>
                  <div className="p-6 pb-4 flex items-start justify-between border-b border-stone-100 bg-stone-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                      {reward.icon}
                    </div>
                    <Badge
                      variant={
                        reward.category === 'Shopping'
                          ? 'green'
                          : reward.category === 'Discount'
                          ? 'gold'
                          : reward.category === 'Experience'
                          ? 'platinum'
                          : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {reward.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-[#159028] transition-colors">
                        {reward.name}
                      </h3>
                      <span className="text-sm font-bold text-stone-700 font-mono">
                        {reward.rewardValue}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed min-h-[36px]">
                      {reward.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Required</span>
                        <span className="text-lg font-black text-[#159028]">
                          {reward.pointsRequired.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-stone-500">Points</span>
                        </span>
                      </div>

                      {canRedeem ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          ✓ Ready to Redeem
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 font-medium">
                          Need {pointsNeeded} more pts
                        </span>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-6 pt-0 border-t border-stone-100 mt-2">
                  <Button
                    onClick={() => handleOpenRedeemModal(reward)}
                    disabled={!canRedeem}
                    className={`w-full text-xs font-bold h-10 rounded-xl transition-all ${
                      canRedeem
                        ? 'bg-[#159028] hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Redeem Reward' : `Insufficient Points (${pointsNeeded} pts left)`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {selectedReward && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#159028] flex items-center justify-center mx-auto mb-3 text-2xl">
                  {selectedReward.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Redeem {selectedReward.name}?
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Are you sure you want to redeem this reward for physical in-store redemption?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Reward Value:</span>
                  <span className="font-bold text-stone-900">{selectedReward.rewardValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Points to Deduct:</span>
                  <span className="font-bold text-red-600">-{selectedReward.pointsRequired} Points</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200">
                  <span className="text-stone-500">Current Balance:</span>
                  <span className="text-stone-700">{customer.availablePoints} pts</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Balance After Redemption:</span>
                  <span className="text-[#159028]">
                    {customer.availablePoints - selectedReward.pointsRequired} pts
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmRedeem}
                  className="flex-1 bg-[#159028] hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm Redemption
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Voucher Modal (After Redemption) */}
        {redeemedVoucher && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 text-center">
              <div className="bg-[#0D0D0D] text-white p-6">
                <div className="w-12 h-12 rounded-full bg-[#159028] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <Badge variant="green" className="text-[10px] mb-1">
                  Voucher Generated
                </Badge>
                <h3 className="text-lg font-bold">{redeemedVoucher.reward.name}</h3>
                <p className="text-xs text-stone-300 mt-1">
                  Present this voucher code to store staff at any Westside checkout.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 space-y-2">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    IN-STORE VOUCHER CODE
                  </span>
                  <div className="text-xl font-mono font-black text-stone-900 tracking-wider">
                    {redeemedVoucher.code}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(redeemedVoucher.code)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#159028] font-semibold hover:underline mt-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Voucher Code'}
                  </button>
                </div>

                <div className="text-xs text-stone-500 space-y-1">
                  <p>Valid at all 120+ Westside retail stores.</p>
                  <p>Expiry Date: <strong className="text-stone-800">{formatDate(redeemedVoucher.expiresAt)}</strong></p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    onClick={() => setRedeemedVoucher(null)}
                    className="w-full bg-[#159028] hover:bg-emerald-700 text-white text-xs"
                  >
                    Done & Back to Rewards
                  </Button>
                  <Link href="/customer/transactions">
                    <Button variant="ghost" className="w-full text-xs text-stone-500">
                      View in Transaction History
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
