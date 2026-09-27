'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  History,
  Receipt,
  Gift,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Sparkles,
  Download,
  Calendar,
  LayoutList,
  Columns
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerTransactionsPage() {
  const { state, getCustomerTransactions } = useApp();

  const customer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const [activeFilter, setActiveFilter] = useState<'All' | 'Earned' | 'Redeemed' | 'Expired'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  if (!customer) return null;

  const rawTransactions = getCustomerTransactions(customer.id);

  // Filter & Search
  const filteredTransactions = rawTransactions.filter(txn => {
    // Type Filter
    if (activeFilter !== 'All' && txn.type !== activeFilter) {
      return false;
    }
    // Search Query (store, description, billNumber)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStore = txn.store.toLowerCase().includes(q);
      const matchDesc = txn.description.toLowerCase().includes(q);
      const matchBill = txn.billNumber.toLowerCase().includes(q);
      if (!matchStore && !matchDesc && !matchBill) return false;
    }
    return true;
  });

  const totalEarnedPoints = rawTransactions
    .filter(t => t.type === 'Earned')
    .reduce((sum, t) => sum + t.points, 0);

  const totalRedeemedPoints = Math.abs(
    rawTransactions
      .filter(t => t.type === 'Redeemed')
      .reduce((sum, t) => sum + t.points, 0)
  );

  const totalSpentAmount = rawTransactions
    .filter(t => t.type === 'Earned')
    .reduce((sum, t) => sum + t.purchaseAmount, 0);

  const handleExportStatement = () => {
    toast.success('Transaction statement downloaded for ' + customer.fullName);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#159028]">
                STATEMENT OF ACTIVITY
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">{customer.fullName} ({customer.id})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif mt-1">
              Transaction History
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Chronological log of physical store bills, earned points, and redeemed vouchers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStatement}
              className="text-xs border-stone-300 gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download Statement
            </Button>
            <Link href="/admin/purchases">
              <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white text-xs">
                + Simulate Store Bill
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-stone-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500">Total Store Spend</span>
                <div className="text-xl font-black text-stone-900 mt-0.5">
                  {formatCurrency(totalSpentAmount)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                <Receipt className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500">Points Accumulated</span>
                <div className="text-xl font-black text-[#159028] mt-0.5">
                  +{totalEarnedPoints.toLocaleString('en-IN')} pts
                </div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500">Points Redeemed</span>
                <div className="text-xl font-black text-stone-800 mt-0.5">
                  -{totalRedeemedPoints.toLocaleString('en-IN')} pts
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter bar & Search */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                {(['All', 'Earned', 'Redeemed', 'Expired'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeFilter === tab
                        ? 'bg-white text-stone-900 font-bold shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab === 'All' ? 'All Transactions' : tab === 'Earned' ? 'Points Earned' : tab === 'Redeemed' ? 'Points Redeemed' : 'Expired'}
                  </button>
                ))}
              </div>

              {/* View Toggle & Search */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all ${
                      viewMode === 'timeline'
                        ? 'bg-white text-stone-900 font-bold shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#159028]" />
                    Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-stone-900 font-bold shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    Table
                  </button>
                </div>

                <div className="relative sm:w-56">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search store, bill no..."
                    className="pl-8 h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* TIMELINE VIEW */}
            {viewMode === 'timeline' && (
              <div className="pt-4 pb-2">
                <div className="relative border-l-2 border-emerald-200/80 ml-4 sm:ml-6 pl-6 space-y-6">
                  {filteredTransactions.map(txn => {
                    const isEarned = txn.points > 0;
                    return (
                      <div key={txn.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <div
                          className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md transition-transform group-hover:scale-110 ${
                            isEarned ? 'bg-[#159028] ring-4 ring-emerald-50' : 'bg-purple-600 ring-4 ring-purple-50'
                          }`}
                        >
                          {isEarned ? '₹' : '🎁'}
                        </div>

                        {/* Event Card */}
                        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{txn.description}</span>
                              <Badge
                                variant={isEarned ? 'green' : 'secondary'}
                                className="text-[10px]"
                              >
                                {txn.type}
                              </Badge>
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">
                              {formatDate(txn.date)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-stone-100 gap-2">
                            <div className="flex items-center gap-3 text-stone-500">
                              <span>Store: <strong className="text-stone-700">{txn.store}</strong></span>
                              <span>•</span>
                              <span>Bill: <strong className="font-mono text-stone-700">{txn.billNumber}</strong></span>
                              {txn.purchaseAmount > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Amount: <strong className="text-stone-900">{formatCurrency(txn.purchaseAmount)}</strong></span>
                                </>
                              )}
                            </div>

                            <div>
                              <span
                                className={`text-base font-black ${
                                  isEarned ? 'text-[#159028]' : 'text-stone-800'
                                }`}
                              >
                                {isEarned ? `+${txn.points}` : `${txn.points}`} Points
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredTransactions.length === 0 && (
                    <div className="py-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl p-6">
                      No transactions found matching your criteria.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Store / Description</th>
                      <th className="py-3 px-4">Bill Number</th>
                      <th className="py-3 px-4 text-right">Purchase Amount</th>
                      <th className="py-3 px-4 text-right">Points</th>
                      <th className="py-3 px-4 text-center">Type</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredTransactions.map(txn => {
                      const isEarned = txn.points > 0;
                      return (
                        <tr key={txn.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-stone-800 whitespace-nowrap">
                            {formatDate(txn.date)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{txn.description}</div>
                            <div className="text-[11px] text-stone-400">{txn.store}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600 whitespace-nowrap">
                            {txn.billNumber}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-stone-900 whitespace-nowrap">
                            {txn.purchaseAmount > 0 ? formatCurrency(txn.purchaseAmount) : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span
                              className={`font-black text-sm ${
                                isEarned ? 'text-[#159028]' : 'text-stone-900'
                              }`}
                            >
                              {isEarned ? `+${txn.points}` : `${txn.points}`}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#159028]"></span>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-stone-500">
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
