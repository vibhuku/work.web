'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Customer, MembershipTier } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Eye,
  Receipt,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const router = useRouter();
  const { state, dispatch, generateCustomerId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Filtered customer list
  const filteredCustomers = state.customers.filter(customer => {
    // Tier filter
    if (selectedTier !== 'All' && customer.currentTier !== selectedTier) {
      return false;
    }
    // Search query (name, mobile, id)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = customer.fullName.toLowerCase().includes(q);
      const matchMobile = customer.mobile.includes(q);
      const matchId = customer.id.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    toast.success(`Exported ${filteredCustomers.length} customer records to CSV.`);
  };

  return (
    <AdminLayout
      title="Customer Loyalty Directory"
      subtitle="Lookup physical store customer records, review lifetime points, and manage membership profiles."
      actionButton={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs border-stone-300 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Link href="/admin/purchases">
            <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
              <Receipt className="w-3.5 h-3.5" />
              Add Store Bill
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Toolbar */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Field */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name, mobile, or ID (e.g. WS10001)..."
                  className="pl-9 h-11 text-xs"
                />
              </div>

              {/* Tier Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Bronze', 'Silver', 'Gold', 'Platinum'] as const).map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedTier === tier
                        ? 'bg-[#0D0D0D] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Directory Table */}
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4 text-center">Tier</th>
                  <th className="py-3 px-4 text-right">Available Points</th>
                  <th className="py-3 px-4 text-right">Lifetime Points</th>
                  <th className="py-3 px-4 text-center">Purchases</th>
                  <th className="py-3 px-4">Last Store Visit</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#159028] whitespace-nowrap">
                      {customer.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {customer.fullName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600 whitespace-nowrap">
                      +91 {customer.mobile}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
                        {customer.currentTier}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-stone-900 whitespace-nowrap">
                      {customer.availablePoints.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-stone-500 font-medium whitespace-nowrap">
                      {customer.lifetimePoints.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-semibold text-stone-800">{customer.totalPurchases}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-[#159028] hover:bg-emerald-50">
                            Details
                          </Button>
                        </Link>
                        <Link href={`/admin/purchases?mobile=${customer.mobile}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-stone-700">
                            Bill
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-stone-500">
                      No customer records found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
