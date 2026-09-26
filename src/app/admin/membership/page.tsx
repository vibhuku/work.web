'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TIER_CONFIG } from '@/lib/tiers';
import {
  Sliders,
  Sparkles,
  Crown,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMembershipRulesPage() {
  const { state, dispatch } = useApp();

  // Points conversion rule state (₹250 = 1 point)
  const [amountPerPoint, setAmountPerPoint] = useState<number>(state.pointsRule.amountPerPoint);

  // Local tier config for editing
  const [tiers, setTiers] = useState(TIER_CONFIG);

  const handleSavePointsRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPerPoint <= 0) {
      toast.error('Please enter a valid amount per point (e.g. 250)');
      return;
    }

    dispatch({
      type: 'UPDATE_POINTS_RULE',
      payload: { amountPerPoint },
    });

    toast.success(`Loyalty Points Rule updated! Now ₹${amountPerPoint} spent = 1 Point.`);
  };

  const handleUpdateMultiplier = (tierName: string, newMultiplier: number) => {
    setTiers(prev =>
      prev.map(t => (t.name === tierName ? { ...t, rewardMultiplier: newMultiplier } : t))
    );
    toast.success(`Updated multiplier for ${tierName} to ${newMultiplier}x`);
  };

  return (
    <AdminLayout
      title="Membership Rules & Loyalty Economics"
      subtitle="Adjust tier point qualification thresholds, multiplier coefficients, and spend-to-points ratio."
      actionButton={
        <Button
          onClick={() => {
            setAmountPerPoint(250);
            dispatch({ type: 'UPDATE_POINTS_RULE', payload: { amountPerPoint: 250 } });
            toast.success('Reset to standard Westside rule: ₹250 = 1 Point');
          }}
          variant="outline"
          size="sm"
          className="text-xs border-stone-300 gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Standard Defaults
        </Button>
      }
    >
      <div className="space-y-8 max-w-5xl">
        {/* Core Conversion Rule Configurator */}
        <Card className="border-emerald-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-emerald-50/70 border-b border-emerald-100 p-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#159028] text-white">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Global Loyalty Point Accrual Formula
                </h3>
                <p className="text-xs text-stone-500">
                  Defines how many physical store spend Rupees equal 1 loyalty point.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSavePointsRule} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
                  <span>Every Spend of ₹</span>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={amountPerPoint}
                    onChange={e => setAmountPerPoint(Number(e.target.value))}
                    className="w-28 text-center font-mono font-bold text-base h-11"
                  />
                  <span>= 1 Loyalty Point</span>
                </div>

                <Button
                  type="submit"
                  className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs h-11 px-6 rounded-xl"
                >
                  Save New Rule
                </Button>
              </div>

              {/* Simulation previews */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">₹2,500 Bill Earns</span>
                  <span className="font-bold text-stone-900">
                    +{Math.floor(2500 / amountPerPoint)} Points
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">₹5,000 Bill Earns</span>
                  <span className="font-bold text-[#159028] text-sm">
                    +{Math.floor(5000 / amountPerPoint)} Points
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">₹10,000 Bill Earns</span>
                  <span className="font-bold text-stone-900">
                    +{Math.floor(10000 / amountPerPoint)} Points
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 4 Membership Tiers Configurator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Membership Tiers Configuration</h3>
              <p className="text-xs text-stone-500">
                Thresholds, point multipliers, and tier privileges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(tier => (
              <Card key={tier.name} className="border-stone-200 shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <CardTitle className="text-base font-bold font-serif">{tier.name}</CardTitle>
                      <span className="text-xs text-stone-400 font-mono">
                        {tier.maxPoints === Infinity
                          ? `${tier.minPoints.toLocaleString('en-IN')}+ pts`
                          : `${tier.minPoints.toLocaleString('en-IN')} – ${tier.maxPoints.toLocaleString('en-IN')} pts`}
                      </span>
                    </div>
                  </div>
                  <Badge variant={tier.name.toLowerCase() as any} className="text-xs">
                    {tier.name}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Point Multiplier
                      </label>
                      <select
                        value={tier.rewardMultiplier}
                        onChange={e => handleUpdateMultiplier(tier.name, Number(e.target.value))}
                        className="w-full h-9 rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold"
                      >
                        <option value={1}>1.0x (Standard)</option>
                        <option value={1.25}>1.25x (+25%)</option>
                        <option value={1.5}>1.5x (+50%)</option>
                        <option value={2}>2.0x (Double)</option>
                        <option value={2.5}>2.5x</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Min Lifetime Points
                      </label>
                      <Input
                        type="number"
                        value={tier.minPoints}
                        disabled
                        className="h-9 text-xs bg-stone-50 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      Included Privileges
                    </label>
                    <ul className="space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px]">
                          <span className="text-[#159028] font-bold">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
