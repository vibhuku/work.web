'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { generateBillNumber, formatCurrency } from '@/lib/utils';
import { getTierConfig, getNextTier, getPointsToNextTier, getTierForPoints } from '@/lib/tiers';
import { Customer, Transaction } from '@/lib/types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  UserPlus,
  Sparkles,
  ArrowRight,
  Store,
  CreditCard,
  Crown,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const WESTSIDE_STORES = [
  'Westside Phoenix Palladium, Mumbai',
  'Westside Select Citywalk, Saket, Delhi',
  'Westside DLF Mall of India, Noida',
  'Westside Inorbit Mall, Malad, Mumbai',
  'Westside Brigade Road, Bangalore',
  'Westside Forum South Mall, Bangalore',
  'Westside Express Avenue, Chennai',
  'Westside South City Mall, Kolkata',
  'Westside Phoenix Marketcity, Pune',
];

export default function AdminPurchasesPage() {
  const router = useRouter();
  const { state, dispatch, getCustomerByMobile, calculatePoints, generateCustomerId } = useApp();

  // Search state
  const [mobileQuery, setMobileQuery] = useState('9876543210');
  const [searchedCustomer, setSearchedCustomer] = useState<Customer | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // New customer quick-registration state (when not found)
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newMobile, setNewMobile] = useState('');

  // Bill entry state
  const [storeName, setStoreName] = useState(WESTSIDE_STORES[0]);
  const [billNumber, setBillNumber] = useState(generateBillNumber());
  const [purchaseAmount, setPurchaseAmount] = useState<number | ''>(5000);

  // Success summary modal state
  const [successReceipt, setSuccessReceipt] = useState<{
    customer: Customer;
    pointsEarned: number;
    prevPoints: number;
    newPoints: number;
    amount: number;
    billNo: string;
    tierUpgraded: boolean;
  } | null>(null);

  // Search handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanMobile = mobileQuery.trim();
    if (!cleanMobile) {
      toast.error('Please enter a mobile number');
      return;
    }
    const found = getCustomerByMobile(cleanMobile);
    setSearchedCustomer(found || null);
    setHasSearched(true);
    setIsCreatingNew(false);

    if (!found) {
      setNewMobile(cleanMobile);
    }
  };

  // Quick Register New Customer inline
  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newMobile.trim()) {
      toast.error('Please enter customer full name and 10-digit mobile number');
      return;
    }

    // Check if mobile already exists
    if (getCustomerByMobile(newMobile.trim())) {
      toast.error('A customer with this mobile number already exists');
      return;
    }

    const newId = generateCustomerId();
    const createdCustomer: Customer = {
      id: newId,
      fullName: newFullName.trim(),
      mobile: newMobile.trim(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalPoints: 0,
      availablePoints: 0,
      lifetimePoints: 0,
      currentTier: 'Bronze',
      status: 'Active',
      totalPurchases: 0,
      totalPurchaseAmount: 0,
    };

    dispatch({ type: 'ADD_CUSTOMER', payload: createdCustomer });
    setSearchedCustomer(createdCustomer);
    setIsCreatingNew(false);
    setMobileQuery(createdCustomer.mobile);
    toast.success(`Loyalty Profile created for ${createdCustomer.fullName} (ID: ${createdCustomer.id})`);
  };

  // Calculations
  const validAmount = typeof purchaseAmount === 'number' && purchaseAmount > 0 ? purchaseAmount : 0;
  const pointsEarned = calculatePoints(validAmount);
  const currentPoints = searchedCustomer?.availablePoints || 0;
  const newPoints = currentPoints + pointsEarned;
  const projectedLifetime = (searchedCustomer?.lifetimePoints || 0) + pointsEarned;
  const projectedTier = getTierForPoints(projectedLifetime);
  const isTierUpgrade = searchedCustomer ? projectedTier !== searchedCustomer.currentTier : false;

  // Submit Bill & Award Points
  const handleAwardPoints = () => {
    if (!searchedCustomer) {
      toast.error('Please search and select a customer first');
      return;
    }
    if (validAmount <= 0) {
      toast.error('Please enter a valid purchase bill amount');
      return;
    }

    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      customerId: searchedCustomer.id,
      date: new Date().toISOString().split('T')[0],
      store: storeName,
      billNumber: billNumber || generateBillNumber(),
      purchaseAmount: validAmount,
      points: pointsEarned,
      type: 'Earned',
      status: 'Completed',
      description: `Store Purchase — ${formatCurrency(validAmount)}`,
    };

    dispatch({
      type: 'ADD_PURCHASE',
      payload: {
        customerId: searchedCustomer.id,
        transaction,
        pointsEarned,
      },
    });

    // Automatically set current customer for preview
    dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: searchedCustomer.id });

    // Confetti celebration
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#159028', '#34d399', '#fef08a', '#10b981'],
    });

    // Show success receipt
    setSuccessReceipt({
      customer: searchedCustomer,
      pointsEarned,
      prevPoints: searchedCustomer.availablePoints,
      newPoints: searchedCustomer.availablePoints + pointsEarned,
      amount: validAmount,
      billNo: transaction.billNumber,
      tierUpgraded: isTierUpgrade,
    });

    toast.success(`+${pointsEarned} Points successfully awarded to ${searchedCustomer.fullName}!`);
  };

  const handleResetForNextCustomer = () => {
    setSuccessReceipt(null);
    setSearchedCustomer(null);
    setHasSearched(false);
    setMobileQuery('');
    setBillNumber(generateBillNumber());
    setPurchaseAmount(5000);
  };

  return (
    <AdminLayout
      title="Store Purchase & Billing Terminal (POS)"
      subtitle="Issue loyalty points to in-store customers upon checkout. Automatic rule calculation and tier evaluation."
      actionButton={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetForNextCustomer}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Bill
          </Button>
          <Link href="/customer">
            <Button size="sm" variant="secondary" className="text-xs gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Customer View
            </Button>
          </Link>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Step-by-step progress banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span className="w-6 h-6 rounded-full bg-[#159028] text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <span>Customer Mobile</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span className="w-6 h-6 rounded-full bg-[#159028] text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <span>Bill Details</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span className="w-6 h-6 rounded-full bg-[#159028] text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span>Auto Points Math</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span className="w-6 h-6 rounded-full bg-[#159028] text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <span>Award & Update</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Customer Identification & Registration */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Customer Search Card */}
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0D0D0D] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <CardTitle className="text-base font-bold">Search Customer</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Unique Mobile
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Ask customer for their 10-digit registered mobile number.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium">
                      +91
                    </span>
                    <Input
                      type="tel"
                      value={mobileQuery}
                      onChange={e => setMobileQuery(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="pl-11 h-11 text-sm font-medium tracking-wide"
                      maxLength={10}
                    />
                  </div>
                  <Button type="submit" className="h-11 px-5 bg-[#159028] hover:bg-emerald-700 gap-1.5">
                    <Search className="w-4 h-4" />
                    Lookup
                  </Button>
                </form>

                {/* Quick Presets for Demo */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-600">Demo Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileQuery('9876543210');
                      const found = getCustomerByMobile('9876543210');
                      setSearchedCustomer(found || null);
                      setHasSearched(true);
                      setIsCreatingNew(false);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
                  >
                    Rahul (Silver)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileQuery('9876543211');
                      const found = getCustomerByMobile('9876543211');
                      setSearchedCustomer(found || null);
                      setHasSearched(true);
                      setIsCreatingNew(false);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
                  >
                    Priya (Gold)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileQuery('9876543213');
                      const found = getCustomerByMobile('9876543213');
                      setSearchedCustomer(found || null);
                      setHasSearched(true);
                      setIsCreatingNew(false);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
                  >
                    Sneha (Platinum)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileQuery('9999900000');
                      setSearchedCustomer(null);
                      setHasSearched(true);
                      setIsCreatingNew(true);
                      setNewMobile('9999900000');
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-50 text-[#159028] font-mono hover:bg-emerald-100 transition-colors"
                  >
                    Test Not Found
                  </button>
                </div>

                {/* Customer Found Card */}
                {searchedCustomer && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#159028] text-white flex items-center justify-center font-bold text-base shadow-sm">
                          {searchedCustomer.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-stone-900">{searchedCustomer.fullName}</h3>
                            <span className="text-xs text-emerald-700 font-mono">
                              ({searchedCustomer.id})
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 font-mono">
                            +91 {searchedCustomer.mobile}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          searchedCustomer.currentTier === 'Platinum'
                            ? 'platinum'
                            : searchedCustomer.currentTier === 'Gold'
                            ? 'gold'
                            : searchedCustomer.currentTier === 'Silver'
                            ? 'silver'
                            : 'bronze'
                        }
                      >
                        {searchedCustomer.currentTier} Member
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-100 text-center">
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <div className="text-[10px] text-stone-500 uppercase font-medium">Available Pts</div>
                        <div className="text-sm font-bold text-[#159028]">
                          {searchedCustomer.availablePoints.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <div className="text-[10px] text-stone-500 uppercase font-medium">Lifetime Pts</div>
                        <div className="text-sm font-bold text-stone-800">
                          {searchedCustomer.lifetimePoints.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <div className="text-[10px] text-stone-500 uppercase font-medium">Purchases</div>
                        <div className="text-sm font-bold text-stone-800">
                          {searchedCustomer.totalPurchases}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Not Found & Quick Register */}
                {hasSearched && !searchedCustomer && (
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Customer not found for mobile +91 {mobileQuery}</span>
                    </div>

                    {!isCreatingNew ? (
                      <div>
                        <p className="text-xs text-stone-600 mb-2">
                          This shopper is not yet enrolled in Westside Loyalty. Enrol them now in 5 seconds without password or OTP.
                        </p>
                        <Button
                          type="button"
                          onClick={() => setIsCreatingNew(true)}
                          size="sm"
                          className="w-full bg-[#0D0D0D] text-white hover:bg-stone-800 text-xs gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                          Create New Loyalty Profile
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleQuickRegister} className="space-y-3 pt-2">
                        <div className="text-xs font-bold text-stone-800 border-b border-amber-200/60 pb-1">
                          Quick Enrollment Form
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Customer Full Name
                          </label>
                          <Input
                            value={newFullName}
                            onChange={e => setNewFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Mobile Number (10 digits)
                          </label>
                          <Input
                            value={newMobile}
                            onChange={e => setNewMobile(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="h-9 text-xs font-mono"
                            maxLength={10}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCreatingNew(false)}
                            className="flex-1 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            className="flex-1 bg-[#159028] text-white hover:bg-emerald-700 text-xs"
                          >
                            Create & Select
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loyalty Point Conversion Rule Helper */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#159028]" />
                  Active Loyalty Calculation Rule:
                </span>
                <Badge variant="outline" className="text-[10px] text-emerald-700 font-mono">
                  Configurable in Admin
                </Badge>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Every <strong className="text-stone-900">₹{state.pointsRule.amountPerPoint}</strong> spent generates{' '}
                <strong className="text-[#159028]">1 loyalty point</strong>.
              </p>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-center justify-between font-mono text-[11px]">
                <span>Sample ₹5,000 Purchase:</span>
                <span className="text-[#159028] font-bold">5,000 / 250 = +20 Points</span>
              </div>
            </div>
          </div>

          {/* Right Column: Step 2 & 3 Bill Entry & Real-time Math */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0D0D0D] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <CardTitle className="text-base font-bold">Enter Bill Details</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    POS Register
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Provide retail receipt number and store bill gross total.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Store selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Store Location
                  </label>
                  <select
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159028]"
                  >
                    {WESTSIDE_STORES.map(store => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bill Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">
                        Bill / Receipt Number
                      </label>
                      <button
                        type="button"
                        onClick={() => setBillNumber(generateBillNumber())}
                        className="text-[10px] text-[#159028] hover:underline"
                      >
                        Auto-generate
                      </button>
                    </div>
                    <Input
                      value={billNumber}
                      onChange={e => setBillNumber(e.target.value)}
                      placeholder="WS-2026-0926-001"
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Purchase Amount */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Purchase Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                        ₹
                      </span>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={purchaseAmount}
                        onChange={e =>
                          setPurchaseAmount(e.target.value ? Number(e.target.value) : '')
                        }
                        placeholder="5000"
                        className="pl-8 text-sm font-bold tracking-wide"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Automatic Calculation Breakdown */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#159028]" />
                      Real-Time Points Calculation
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      ₹{validAmount.toLocaleString()} ÷ ₹{state.pointsRule.amountPerPoint}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-500">Points Earned</div>
                      <div className="text-lg font-black text-[#159028]">+{pointsEarned}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-500">Previous Points</div>
                      <div className="text-lg font-bold text-stone-700">{currentPoints}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-500">New Balance</div>
                      <div className="text-lg font-black text-[#0D0D0D]">{newPoints}</div>
                    </div>
                  </div>

                  {/* Tier status indicator */}
                  {searchedCustomer && (
                    <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <div>
                          <span className="text-stone-500">Membership Tier:</span>{' '}
                          <span className="font-semibold text-stone-900">{searchedCustomer.currentTier}</span>
                          {isTierUpgrade && (
                            <span className="ml-1 text-emerald-600 font-bold">
                              → Upgrading to {projectedTier}! 🏆
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        Lifetime: {projectedLifetime} pts
                      </span>
                    </div>
                  )}
                </div>

                {/* Step 4: Submit Button */}
                <Button
                  type="button"
                  onClick={handleAwardPoints}
                  disabled={!searchedCustomer || validAmount <= 0}
                  className="w-full h-12 bg-[#159028] hover:bg-emerald-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Add Purchase & Award +{pointsEarned} Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal / Receipt Confirmation Overlay */}
        {successReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
              {/* Receipt Header */}
              <div className="bg-[#0D0D0D] text-white p-6 text-center relative">
                <div className="w-12 h-12 rounded-full bg-[#159028] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Purchase Recorded!</h3>
                <p className="text-xs text-stone-300 mt-1">
                  Loyalty points successfully credited to customer profile.
                </p>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-2 border-b border-stone-200 pb-3">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Customer:</span>
                    <span className="font-bold text-stone-900">{successReceipt.customer.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Customer ID:</span>
                    <span className="font-mono text-stone-900">{successReceipt.customer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mobile:</span>
                    <span className="font-mono text-stone-900">+91 {successReceipt.customer.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Bill Number:</span>
                    <span className="font-mono text-stone-900">{successReceipt.billNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Bill Amount:</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {formatCurrency(successReceipt.amount)}
                    </span>
                  </div>
                </div>

                {/* Points highlights */}
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 font-medium">Points Awarded:</span>
                    <span className="text-lg font-black text-[#159028]">
                      +{successReceipt.pointsEarned} Points
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600 text-[11px] pt-1 border-t border-emerald-200/50">
                    <span>Previous: {successReceipt.prevPoints} pts</span>
                    <span>→</span>
                    <span className="font-bold text-stone-900">
                      New Balance: {successReceipt.newPoints} pts
                    </span>
                  </div>
                </div>

                {/* Tier upgrade notification */}
                {successReceipt.tierUpgraded && (
                  <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center gap-2 text-yellow-900">
                    <Crown className="w-5 h-5 text-yellow-600 shrink-0" />
                    <div>
                      <div className="font-bold">Tier Upgrade!</div>
                      <div className="text-[11px] text-yellow-800">
                        Customer has been upgraded to a higher tier!
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/customer" className="w-full">
                    <Button className="w-full bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Customer Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleResetForNextCustomer}
                    className="w-full text-xs"
                  >
                    Add Another Bill
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
