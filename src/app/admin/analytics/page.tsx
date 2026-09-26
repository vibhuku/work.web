'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { MOCK_MONTHLY_DATA } from '@/lib/mock-data';
import {
  BarChart3,
  TrendingUp,
  Users,
  Sparkles,
  Gift,
  Store,
  Download,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAnalyticsPage() {
  const { state } = useApp();

  const storePerformance = [
    { name: 'Westside Phoenix Palladium, Mumbai', members: 4200, pointsIssued: 1450000, revenue: 36250000 },
    { name: 'Westside Select Citywalk, Delhi', members: 3850, pointsIssued: 1320000, revenue: 33000000 },
    { name: 'Westside DLF Mall of India, Noida', members: 3400, pointsIssued: 1180000, revenue: 29500000 },
    { name: 'Westside Brigade Road, Bangalore', members: 2950, pointsIssued: 980000, revenue: 24500000 },
    { name: 'Westside South City Mall, Kolkata', members: 2600, pointsIssued: 840000, revenue: 21000000 },
    { name: 'Westside Phoenix Marketcity, Pune', members: 2400, pointsIssued: 790000, revenue: 19750000 },
  ];

  const handleExportReport = () => {
    toast.success('Analytics report exported as PDF/Excel');
  };

  return (
    <AdminLayout
      title="Analytics & Executive Intelligence"
      subtitle="Deep-dive metrics across revenue attribution, loyalty velocity, and store branch rankings."
      actionButton={
        <Button
          onClick={handleExportReport}
          variant="outline"
          size="sm"
          className="text-xs border-stone-300 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Report
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Revenue Attribution Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <span className="text-xs text-stone-500 font-medium">TOTAL LOYALTY REVENUE</span>
              <div className="text-2xl font-black text-stone-900 mt-1">₹6.70 Cr</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                +14.2% YoY across 120 stores
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-5">
              <span className="text-xs text-stone-500 font-medium">AVG BASKET SIZE (MEMBERS)</span>
              <div className="text-2xl font-black text-stone-900 mt-1">₹3,450</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                2.4x higher than non-members
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-5">
              <span className="text-xs text-stone-500 font-medium">REPEAT VISIT FREQUENCY</span>
              <div className="text-2xl font-black text-stone-900 mt-1">4.6 Visits</div>
              <p className="text-[11px] text-stone-500 mt-1">Per active member annually</p>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardContent className="p-5">
              <span className="text-xs text-stone-500 font-medium">VOUCHER REDEMPTION RATE</span>
              <div className="text-2xl font-black text-stone-900 mt-1">82.4%</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">High customer retention</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue & Purchases Trend */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="border-b border-stone-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Monthly Store Revenue & In-Store Bills</CardTitle>
              <CardDescription className="text-xs">
                Revenue generated from purchases where loyalty mobile numbers were captured.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Apr – Sep 2026
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-end justify-between gap-4 pb-2">
              {MOCK_MONTHLY_DATA.map(item => {
                const maxRev = 15000000;
                const height = Math.round((item.revenue / maxRev) * 100);

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center h-48">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-stone-900 to-[#159028] rounded-t-lg group-hover:brightness-110 transition-all relative"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-stone-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-bold">
                          ₹{(item.revenue / 10000000).toFixed(2)} Cr
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-stone-800">{item.month}</div>
                      <div className="text-[10px] text-stone-400">{item.purchases} bills</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Store Branch Ranking Table */}
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-stone-100 pb-3">
            <CardTitle className="text-base font-bold">Store Branch Loyalty Performance</CardTitle>
            <CardDescription className="text-xs">
              Top performing physical Westside outlets by loyalty membership capture.
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Store Branch</th>
                  <th className="py-3 px-4 text-right">Loyalty Members</th>
                  <th className="py-3 px-4 text-right">Points Issued</th>
                  <th className="py-3 px-4 text-right">Attributed Revenue</th>
                  <th className="py-3 px-4 text-center">Capture Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {storePerformance.map((store, i) => (
                  <tr key={store.name} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 font-mono text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span>{store.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {store.members.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#159028]">
                      {(store.pointsIssued / 1000).toFixed(0)}k pts
                    </td>
                    <td className="py-3.5 px-4 text-right font-serif font-bold text-stone-900">
                      {formatCurrency(store.revenue)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="green" className="text-[10px]">
                        94.{8 - i}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
