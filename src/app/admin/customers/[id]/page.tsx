'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getTierConfig, getNextTier, getTierForPoints } from '@/lib/tiers';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Customer, Transaction } from '@/lib/types';
import {
  User,
  Phone,
  Calendar,
  Sparkles,
  Crown,
  Receipt,
  Gift,
  ArrowLeft,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const resolvedParams = 'then' in params ? use(params) : params;
  const customerId = resolvedParams.id;

  const { state, dispatch, getCustomerById, getCustomerTransactions } = useApp();

  const customer = getCustomerById(customerId);
  const transactions = getCustomerTransactions(customerId);

  // Points adjustment modal/form state
  const [adjustmentAmount, setAdjustmentAmount] = useState<number | ''>('');
  const [adjustmentReason, setAdjustmentReason] = useState('Store Courtesy Adjustment');
  const [isAdjusting, setIsAdjusting] = useState(false);

  if (!customer) {
    return (
      <AdminLayout title="Customer Not Found">
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-600">No customer found with ID: {customerId}</p>
          <Link href="/admin/customers" className="mt-4 inline-block">
            <Button size="sm">Back to Customer Directory</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const tierConfig = getTierConfig(customer.currentTier);
  const nextTier = getNextTier(customer.currentTier);

  // Handle Manual Points Adjustment
  const handlePointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = typeof adjustmentAmount === 'number' ? adjustmentAmount : 0;
    if (pts === 0) {
      toast.error('Please enter a non-zero points adjustment amount');
      return;
    }

    const newAvailable = Math.max(0, customer.availablePoints + pts);
    const newLifetime = pts > 0 ? customer.lifetimePoints + pts : customer.lifetimePoints;
    const newTier = getTierForPoints(newLifetime);

    const updatedCustomer: Customer = {
      ...customer,
      availablePoints: newAvailable,
      totalPoints: newAvailable,
      lifetimePoints: newLifetime,
      currentTier: newTier,
    };

    const adjustmentTxn: Transaction = {
      id: `TXN${Date.now()}`,
      customerId: customer.id,
      date: new Date().toISOString().split('T')[0],
      store: 'Admin Customer Care',
      billNumber: 'ADJUSTMENT',
      purchaseAmount: 0,
      points: pts,
      type: 'Adjusted',
      status: 'Completed',
      description: `${pts > 0 ? '+' : ''}${pts} Points Adjusted (${adjustmentReason})`,
    };

    dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
    dispatch({ type: 'ADD_TRANSACTION', payload: adjustmentTxn });

    toast.success(`Points adjusted by ${pts > 0 ? `+${pts}` : pts} for ${customer.fullName}.`);
    setIsAdjusting(false);
    setAdjustmentAmount('');
  };

  return (
    <AdminLayout
      title={`Customer Record: ${customer.fullName}`}
      subtitle={`Customer ID: ${customer.id} • Registered ${formatDate(customer.registrationDate)}`}
      actionButton={
        <div className="flex items-center gap-2">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm" className="text-xs border-stone-300 gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to List
            </Button>
          </Link>
          <Link href="/admin/purchases">
            <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
              <Receipt className="w-3.5 h-3.5" />
              Add In-Store Bill
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                <span>AVAILABLE POINTS</span>
                <Sparkles className="w-4 h-4 text-[#159028]" />
              </div>
              <div className="text-2xl font-black text-stone-900 mt-2">
                {customer.availablePoints.toLocaleString('en-IN')} <span className="text-xs text-stone-500 font-normal">pts</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjusting(!isAdjusting)}
                className="text-[11px] text-[#159028] font-semibold hover:underline mt-1"
              >
                ± Adjust Points Manually
              </button>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                <span>MEMBERSHIP TIER</span>
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-stone-900 mt-2 flex items-center gap-2">
                <span>{customer.currentTier}</span>
                <Badge variant={customer.currentTier.toLowerCase() as any} className="text-[10px]">
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {tierConfig.rewardMultiplier}x point rewards
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                <span>LIFETIME SPEND</span>
                <Receipt className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-stone-900 mt-2">
                {formatCurrency(customer.totalPurchaseAmount)}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Across {customer.totalPurchases} store purchases
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                <span>LIFETIME POINTS</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-stone-900 mt-2">
                {customer.lifetimePoints.toLocaleString('en-IN')} <span className="text-xs text-stone-500 font-normal">pts</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Last visit: {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : '—'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Manual Points Adjustment Form (Collapsible) */}
        {isAdjusting && (
          <Card className="border-amber-200 bg-amber-50/60 shadow-sm animate-in fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-amber-900">
                Manual Points Adjustment
              </CardTitle>
              <CardDescription className="text-xs text-amber-700">
                Directly add or deduct loyalty points (e.g. courtesy compensation or correction).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handlePointsAdjustment} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Points (Use negative to deduct, e.g. -50 or 100)
                  </label>
                  <Input
                    type="number"
                    value={adjustmentAmount}
                    onChange={e =>
                      setAdjustmentAmount(e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder="e.g. 50 or -50"
                    className="h-10 text-xs bg-white"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Reason
                  </label>
                  <Input
                    value={adjustmentReason}
                    onChange={e => setAdjustmentReason(e.target.value)}
                    placeholder="e.g. Courtesy Points"
                    className="h-10 text-xs bg-white"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdjusting(false)}
                    className="h-10 text-xs bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 text-xs bg-[#159028] hover:bg-emerald-700 text-white font-bold"
                  >
                    Apply Adjustment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Customer In-Store Transaction Ledger */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="border-b border-stone-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Transaction Ledger</CardTitle>
              <CardDescription className="text-xs">
                History of in-store purchases, point accruals, and redeemed coupons.
              </CardDescription>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Total Records: {transactions.length}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Store Location / Detail</th>
                    <th className="py-3 px-4">Bill Number</th>
                    <th className="py-3 px-4 text-right">Bill Total</th>
                    <th className="py-3 px-4 text-right">Points</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {transactions.map(txn => {
                    const isEarned = txn.points > 0;
                    return (
                      <tr key={txn.id} className="hover:bg-stone-50">
                        <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                          {formatDate(txn.date)}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {txn.description}
                          <div className="text-[11px] font-normal text-stone-400">{txn.store}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                          {txn.billNumber}
                        </td>
                        <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                          {txn.purchaseAmount > 0 ? formatCurrency(txn.purchaseAmount) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`font-black text-sm ${
                              isEarned ? 'text-[#159028]' : 'text-stone-900'
                            }`}
                          >
                            {isEarned ? `+${txn.points}` : `${txn.points}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <Badge
                            variant={
                              txn.type === 'Earned'
                                ? 'green'
                                : txn.type === 'Redeemed'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-[10px]"
                          >
                            {txn.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className="text-emerald-700 font-medium text-[11px]">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-stone-500">
                        No transactions recorded for this customer yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
