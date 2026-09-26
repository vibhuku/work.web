'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/store';
import { Customer } from '@/lib/types';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Crown,
  Gift,
  ArrowRight,
  Store,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

export default function JoinPage() {
  const router = useRouter();
  const { state, dispatch, getCustomerByMobile, generateCustomerId } = useApp();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [createdProfile, setCreatedProfile] = useState<Customer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    const cleanMobile = mobile.trim();

    if (!cleanName) {
      toast.error('Please enter your full name');
      return;
    }
    if (!cleanMobile || cleanMobile.length !== 10 || !/^\d+$/.test(cleanMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Check if already registered
    const existing = getCustomerByMobile(cleanMobile);
    if (existing) {
      toast.info(`Mobile number is already registered under ${existing.fullName}!`);
      dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: existing.id });
      setCreatedProfile(existing);
      return;
    }

    const newCustomerId = generateCustomerId();
    const newCustomer: Customer = {
      id: newCustomerId,
      fullName: cleanName,
      mobile: cleanMobile,
      registrationDate: new Date().toISOString().split('T')[0],
      totalPoints: 50, // Welcome bonus points!
      availablePoints: 50,
      lifetimePoints: 50,
      currentTier: 'Bronze',
      status: 'Active',
      totalPurchases: 0,
      totalPurchaseAmount: 0,
    };

    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
    dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: newCustomer.id });

    // Add welcome notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `NOT${Date.now()}`,
        customerId: newCustomer.id,
        title: 'Welcome to Westside Loyalty!',
        message: '🎉 Welcome to Westside Loyalty! You have been credited 50 welcome bonus points.',
        type: 'welcome',
        read: false,
        date: new Date().toISOString(),
        icon: '🎉',
      },
    });

    setCreatedProfile(newCustomer);
    toast.success('Your loyalty profile has been created successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {!createdProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                  MEMBERSHIP ENROLLMENT
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-2 font-serif">
                  Elevate Your Retail Experience.
                </h1>
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  Join Westside Loyalty in seconds. No complicated passwords or OTP verification required. Simply provide your name and mobile number to start earning points across all Westside stores nationwide.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">50 Welcome Bonus Points</h3>
                    <p className="text-xs text-stone-500">Get credited instantly upon registration today.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">₹250 = 1 Loyalty Point</h3>
                    <p className="text-xs text-stone-500">Earn points automatically when billing at any Westside store counter.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#159028]">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">Exclusive In-Store Rewards</h3>
                    <p className="text-xs text-stone-500">Redeem points for shopping vouchers, special discounts, and VIP sale previews.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-[#159028]" />
                <span>Zero password or OTP hassle • Identified securely by mobile number</span>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="md:col-span-6">
              <Card className="border-stone-200 shadow-xl bg-white">
                <CardHeader className="border-b border-stone-100">
                  <CardTitle className="text-xl font-bold">Create Loyalty Profile</CardTitle>
                  <CardDescription className="text-xs">
                    Enroll for free. No credit card, no password, no OTP needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="h-11 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                          +91
                        </span>
                        <Input
                          type="tel"
                          value={mobile}
                          onChange={e => setMobile(e.target.value)}
                          placeholder="9876543210"
                          className="pl-12 h-11 text-sm font-mono tracking-wider"
                          maxLength={10}
                          required
                        />
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Use this mobile number at store billing counters to earn and redeem points.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-11 bg-[#159028] hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Create Loyalty Profile
                      </Button>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-xs text-stone-500">
                        Already enrolled in store?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            // Select sample customer Rahul
                            dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: 'WS10001' });
                            router.push('/customer');
                          }}
                          className="text-[#159028] font-semibold hover:underline"
                        >
                          View Rahul's Dashboard
                        </button>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Profile Created Success Card */
          <div className="max-w-md mx-auto animate-in zoom-in-95">
            <Card className="border-emerald-200 shadow-2xl bg-white overflow-hidden text-center">
              <div className="bg-[#0D0D0D] text-white p-8">
                <div className="w-16 h-16 rounded-full bg-[#159028] text-white flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <Badge variant="green" className="mb-2 text-xs">
                  Membership Confirmed
                </Badge>
                <h2 className="text-2xl font-bold font-serif">Welcome, {createdProfile.fullName}!</h2>
                <p className="text-xs text-stone-300 mt-1">
                  Your Westside loyalty profile has been created successfully.
                </p>
              </div>

              <CardContent className="p-6 space-y-4 text-left">
                {/* Virtual Loyalty Card Preview */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#159028] font-bold">
                        WESTSIDE LOYALTY CARD
                      </span>
                      <div className="text-lg font-bold mt-1">{createdProfile.fullName}</div>
                    </div>
                    <Badge variant="bronze" className="text-[10px]">
                      {createdProfile.currentTier} Tier
                    </Badge>
                  </div>

                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-stone-400">CUSTOMER ID</div>
                      <div className="text-sm font-mono font-bold tracking-wider text-emerald-400">
                        {createdProfile.id}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400">INITIAL BALANCE</div>
                      <div className="text-base font-black text-white">
                        {createdProfile.availablePoints} Points
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Registered Mobile:</span>
                    <span className="font-mono font-semibold text-stone-900">+91 {createdProfile.mobile}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Welcome Bonus:</span>
                    <span className="font-semibold text-[#159028]">+50 Points Credited</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-stone-500">How to use:</span>
                    <span className="font-medium text-stone-900">Share mobile number at store checkout</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link href="/customer" className="w-full block">
                    <Button className="w-full bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5">
                      Open Loyalty Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/catalog" className="w-full block">
                    <Button variant="outline" className="w-full text-xs">
                      Browse Store Fashion Catalogue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
