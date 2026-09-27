'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TIER_CONFIG } from '@/lib/tiers';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/types';
import { Hero3DLoyaltyCard } from '@/components/3d/Hero3DLoyaltyCard';
import { SpotlightReveal } from '@/components/3d/SpotlightReveal';
import { LoyaltyJourney3D } from '@/components/3d/LoyaltyJourney3D';
import { PurchasePointsAnimation } from '@/components/3d/PurchasePointsAnimation';
import { TierCard3D } from '@/components/3d/TierCard3D';
import { ProductCard3D } from '@/components/3d/ProductCard3D';
import {
  Sparkles,
  ShoppingBag,
  Phone,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Store,
  Crown,
  Receipt,
  HelpCircle,
  MapPin,
  X,
  Info,
  Layers,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { state, calculatePoints } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeCustomer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const faqs = [
    {
      q: 'How do I earn Westside Loyalty points?',
      a: `Simply visit any of our physical Westside retail stores across India. While paying for your clothes at the billing counter, share your registered mobile number with our store staff. For every ₹${state.pointsRule.amountPerPoint} spent on your bill, 1 point is automatically credited to your loyalty balance.`,
    },
    {
      q: 'Is there any password or OTP required?',
      a: 'No! Westside Loyalty is designed for frictionless store checkout. You only need your 10-digit mobile number. There are no passwords to remember and no OTP delays while standing in the billing queue.',
    },
    {
      q: 'Can I purchase clothes directly on this website?',
      a: 'No. This website is a retail loyalty and store catalogue platform, not an e-commerce website. The clothing collections shown here are for in-store browsing. All trials, styling, purchases, and reward redemptions happen at physical Westside store counters.',
    },
    {
      q: 'How do I redeem my accumulated loyalty points?',
      a: 'You can browse available vouchers in your Rewards Catalogue. Once you select a reward, points are deducted and an in-store voucher code is generated. Present this voucher to store staff at checkout to claim your shopping discount.',
    },
    {
      q: 'How do membership tiers work?',
      a: 'We have 4 prestigious tiers: Bronze (0–999 pts), Silver (1,000–4,999 pts), Gold (5,000–14,999 pts), and Platinum (15,000+ pts). As your lifetime points grow from store purchases, you automatically unlock higher points multipliers, birthday discounts, free alterations, and VIP preview access.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 space-y-24 sm:space-y-32 pb-20">
        {/* ============================================================ */}
        {/* 1. HERO SECTION: 3D INTERACTIVE LOYALTY CARD & EDITORIAL COPY */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden pt-10 sm:pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Editorial Headline & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#159028] animate-pulse" />
                  <span>Physical Store Loyalty Redefined</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight font-serif leading-[1.05]">
                  Earn. <br />
                  Elevate. <br />
                  <span className="text-[#159028] italic">Enjoy.</span>
                </h1>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-lg">
                  Shop in-store. Earn loyalty points. Unlock exclusive rewards. Experience fashion privileges tailored for every visit to your neighborhood Westside store.
                </p>

                {/* Conversion Strip */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200/90 text-xs flex items-center justify-between font-medium max-w-md shadow-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#159028]" />
                    Loyalty Conversion Rule:
                  </span>
                  <span className="font-bold text-[#159028] font-mono text-sm bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                    ₹{state.pointsRule.amountPerPoint} Spent = 1 Point
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/join">
                    <Button size="lg" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-sm px-7 h-12 rounded-xl shadow-lg hover:shadow-emerald-900/20 transition-all gap-2">
                      <Sparkles className="w-4 h-4" />
                      Join Loyalty Free
                    </Button>
                  </Link>

                  <Link href="/catalog">
                    <Button size="lg" variant="outline" className="border-stone-300 font-semibold text-sm px-6 h-12 rounded-xl hover:bg-white bg-white/70">
                      Explore Store Lookbook
                    </Button>
                  </Link>

                  <Link href="/admin/purchases">
                    <Button size="lg" variant="ghost" className="text-xs text-stone-600 hover:text-stone-900 gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#159028]" />
                      Store Staff POS Terminal →
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-4 text-xs text-stone-500 border-t border-stone-200/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>No Password Required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>Instant Mobile ID</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>120+ Retail Stores</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D WebGL Loyalty Card */}
              <div className="lg:col-span-6 flex justify-center">
                <Hero3DLoyaltyCard customer={activeCustomer} />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. SPOTLIGHT RUNWAY REVEAL SECTION */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpotlightReveal />
        </section>

        {/* ============================================================ */}
        {/* 3. YOUR LOYALTY JOURNEY (3D PROGRESS & LIVE SIMULATOR) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoyaltyJourney3D customer={activeCustomer} />
        </section>

        {/* ============================================================ */}
        {/* 4. POS BILLING & POINTS CALCULATION (INTERACTIVE PIPELINE) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <PurchasePointsAnimation />

          {/* 4-Step Retail Flow Cards */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#159028]">
                FOUR SIMPLE STEPS
              </span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight font-serif">
                How Store Shopping Turns Into Privileges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Shop In Store</h4>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Visit any of our 120+ retail fashion stores nationwide. Try on your favorite garments from Men, Women, Kids, or Accessories.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Share Mobile Number</h4>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    At the billing counter, simply speak your 10-digit mobile number to our store staff. No OTP or login password needed.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Earn Points Automatically</h4>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Points calculate instantly at ₹{state.pointsRule.amountPerPoint} = 1 point. A ₹5,000 purchase awards +20 loyalty points right to your account.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Unlock Exclusive Rewards</h4>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Redeem accumulated points for shopping vouchers (₹100, ₹500), 10% discounts, birthday specials, and elevated membership tiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. 3D MEMBERSHIP TIERS SHOWCASE */}
        {/* ============================================================ */}
        <section className="bg-[#0D0D0D] text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden border border-stone-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#159028]/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                EXCLUSIVE PRIVILEGES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
                Four Tiers of Fashion Distinction
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Interactive 3D privilege cards. Hover to inspect tier multiplier, benefits, and qualifying points.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIER_CONFIG.map(tier => (
                <TierCard3D
                  key={tier.name}
                  tier={tier}
                  customer={activeCustomer}
                />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link href="/customer/membership">
                <Button variant="outline" className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-xs px-6 h-11 rounded-xl">
                  View Comprehensive Membership Guide →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. FEATURED IN-STORE CLOTHING (3D CARD PREVIEWS) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                IN-STORE COLLECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif mt-1">
                Featured Clothing On Racks
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Preview our latest garments available in store. Browse only — try on & purchase at your local Westside.
              </p>
            </div>

            <Link href="/catalog">
              <Button variant="outline" className="border-stone-300 text-xs gap-1.5 h-11 px-5 rounded-xl bg-white hover:bg-stone-50">
                View Full 20+ Lookbook
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products.slice(0, 4).map(product => {
              const points = calculatePoints(product.price);
              return (
                <ProductCard3D
                  key={product.id}
                  product={product}
                  pointsEarned={points}
                  onQuickView={prod => setSelectedProduct(prod)}
                />
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. CURATED STORE REWARDS */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                STORE REWARDS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif mt-1">
                Curated Store Vouchers
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Redeem your points for immediate billing discounts and exclusive experiences at checkout.
              </p>
            </div>

            <Link href="/customer/rewards">
              <Button variant="outline" className="border-stone-300 text-xs gap-1.5 h-11 px-5 rounded-xl bg-white hover:bg-stone-50">
                All 15 Rewards
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.rewards.slice(0, 3).map(reward => (
              <Card key={reward.id} className="border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {reward.icon}
                    </div>
                    <Badge variant="green" className="text-[10px]">
                      {reward.pointsRequired} Points
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900">{reward.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">{reward.rewardValue}</span>
                    <Link href="/customer/rewards">
                      <Button size="sm" className="h-8 text-xs bg-[#159028] hover:bg-emerald-700 text-white rounded-lg">
                        Redeem In Store
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. EDITORIAL PHILOSOPHY & WHY JOIN */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                THE IN-STORE ADVANTAGE
              </span>
              <h2 className="text-3xl font-black text-stone-900 tracking-tight font-serif">
                Designed for the Retail Experience
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Fashion is personal, tactile, and best experienced in person. We designed our loyalty program to elevate that visit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50/60 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Zero Password Friction</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Never forget a password or get stuck waiting for SMS OTPs in store queues. Your unique 10-digit mobile number is your instant key.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-stone-50/60 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Instant Points Accrual</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Every ₹{state.pointsRule.amountPerPoint} spent awards 1 loyalty point calculated automatically by our store POS terminal at the checkout counter.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-stone-50/60 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">True Fashion Rewards</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  From ₹100 and ₹500 instant store billing credits to free alterations, personal styling sessions, and VIP sale previews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. FREQUENTLY ASKED QUESTIONS */}
        {/* ============================================================ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
              CLARIFICATIONS
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-stone-500">
              Everything you need to know about our retail physical-store loyalty management system.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-2 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#159028] shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10. BOTTOM LUXURY CALL-TO-ACTION */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0D0D0D] via-stone-900 to-[#0D0D0D] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-stone-800">
            <div className="max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                START EARNING TODAY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif">
                Join 25,000+ Westside Shoppers
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Enroll your profile now in 10 seconds. Enjoy 50 welcome bonus points and step into a world of retail style privileges.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/join">
                <Button size="lg" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-sm px-8 h-12 rounded-xl shadow-lg gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Free Profile
                </Button>
              </Link>
              <Link href="/admin/purchases">
                <Button size="lg" variant="outline" className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-sm h-12 rounded-xl">
                  Store Staff Billing POS →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* QUICK VIEW GARMENT MODAL (NO CART / IN-STORE ONLY) */}
      {/* ============================================================ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[3/4] relative bg-stone-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/95 text-[10px]">
                    {selectedProduct.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#159028]">
                      {selectedProduct.tag}
                    </span>
                    <h3 className="text-xl font-black text-stone-900 font-serif mt-1">
                      {selectedProduct.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-stone-900 font-serif">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                    <span className="text-xs font-bold text-[#159028] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Earns +{calculatePoints(selectedProduct.price)} Points
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
                    <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#159028]" />
                      Trial & Fitting In Store
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Available across all metro Westside flagships. Visit store fitting rooms for personalized trial.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Loyalty Rate:</span>
                    <span className="font-semibold text-stone-900">₹{state.pointsRule.amountPerPoint} = 1 Pt</span>
                  </div>
                  <Link href="/catalog" className="w-full block">
                    <Button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full bg-[#159028] hover:bg-emerald-700 text-white text-xs h-10 rounded-xl"
                    >
                      Browse Lookbook
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
