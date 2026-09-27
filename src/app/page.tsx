'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TIER_CONFIG } from '@/lib/tiers';
import { formatCurrency } from '@/lib/utils';
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
  ExternalLink,
  MapPin,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const { state, calculatePoints } = useApp();

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
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 space-y-20 sm:space-y-28 pb-16">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Editorial Headline & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#159028]" />
                  <span>Physical Store Loyalty Redefined</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight font-serif leading-[1.08]">
                  Earn. <br />
                  Elevate. <br />
                  <span className="text-[#159028] italic">Enjoy.</span>
                </h1>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-lg">
                  Shop in-store. Earn loyalty points. Unlock exclusive rewards. Experience fashion privileges tailored for every visit to your neighborhood Westside store.
                </p>

                {/* Conversion Strip */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between font-medium max-w-md shadow-sm">
                  <span className="text-stone-500">Loyalty Conversion Rule:</span>
                  <span className="font-bold text-[#159028]">
                    ₹{state.pointsRule.amountPerPoint} Spent In Store = 1 Point
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/join">
                    <Button size="lg" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-sm px-7 h-12 rounded-xl shadow-lg gap-2">
                      <Sparkles className="w-4 h-4" />
                      Join Loyalty Free
                    </Button>
                  </Link>

                  <Link href="/catalog">
                    <Button size="lg" variant="outline" className="border-stone-300 font-semibold text-sm px-6 h-12 rounded-xl hover:bg-white">
                      Explore Store Collection
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

              {/* Right Column: Editorial Visual Showcase */}
              <div className="lg:col-span-6">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#159028]/20 to-amber-100/50 rounded-3xl filter blur-2xl opacity-70"></div>

                  {/* Main Fashion Editorial Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
                    <div className="aspect-[4/5] relative">
                      <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                        alt="Westside Fashion Editorial"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Floating Loyalty Card Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#159028]">
                              LIVE STORE PURCHASE DEMO
                            </span>
                            <div className="text-sm font-bold text-stone-900 mt-0.5">
                              Phoenix Palladium, Mumbai
                            </div>
                          </div>
                          <Badge variant="gold" className="text-[10px]">
                            Gold Member
                          </Badge>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-stone-400 block text-[10px]">Bill Amount</span>
                            <span className="font-bold text-stone-900 font-serif text-sm">₹5,000</span>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-400 block text-[10px]">Points Earned</span>
                            <span className="font-black text-[#159028] text-sm">+20 Points</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                          <span>Identified: Rahul Kumar (+91 98...10)</span>
                          <span className="font-bold text-stone-900">Balance: 3,580 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* HOW LOYALTY WORKS (4-STEP SECTION) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
              EFFORTLESS RETAIL FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif">
              How Westside Loyalty Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              No cards to carry, no apps required at checkout. Just four seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Shop In Store</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Visit any of our 120+ retail fashion stores nationwide. Try on your favorite garments from Men, Women, Kids, or Accessories.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Share Mobile Number</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  At the billing counter, simply speak your 10-digit mobile number to our store staff. No OTP or login password needed.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Earn Points Automatically</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Points calculate instantly at ₹{state.pointsRule.amountPerPoint} = 1 point. A ₹5,000 purchase awards +20 loyalty points right to your account.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  04
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Unlock Exclusive Rewards</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Redeem accumulated points for shopping vouchers (₹100, ₹500), 10% discounts, birthday specials, and elevated membership tiers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FEATURED IN-STORE CLOTHING (STORE CATALOGUE PREVIEW) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
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
              <Button variant="outline" className="border-stone-300 text-xs gap-1.5">
                View Full 20+ Catalogue
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products.slice(0, 4).map(product => {
              const points = calculatePoints(product.price);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase bg-white/95 px-2.5 py-0.5 rounded-full text-stone-900 shadow-sm">
                          {product.tag}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-semibold bg-[#159028] text-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          In Store
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400">
                        {product.category}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="pt-1 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-stone-900 font-serif">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-[10px] font-bold text-[#159028] bg-emerald-50 px-2 py-0.5 rounded-full">
                          Earn +{points} Pts
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-stone-100 mt-2">
                    <Link href="/catalog" className="w-full block">
                      <Button variant="outline" className="w-full text-xs h-8 text-stone-600 hover:text-stone-900">
                        Available In Store Only
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* MEMBERSHIP TIERS SHOWCASE */}
        {/* ============================================================ */}
        <section className="bg-stone-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                EXCLUSIVE PRIVILEGES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
                Four Tiers of Fashion Distinction
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Unlock elevated point multipliers, birthday treats, and VIP access as you shop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIER_CONFIG.map(tier => (
                <div
                  key={tier.name}
                  className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{tier.icon}</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        {tier.rewardMultiplier}x Multiplier
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">{tier.name}</h3>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {tier.maxPoints === Infinity
                          ? `${tier.minPoints.toLocaleString('en-IN')}+ pts`
                          : `${tier.minPoints.toLocaleString('en-IN')} – ${tier.maxPoints.toLocaleString('en-IN')} pts`}
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-700">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link href="/customer/membership" className="w-full block">
                      <Button variant="outline" className="w-full text-xs text-stone-200 border-stone-700 hover:bg-stone-700">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* REWARDS CATALOGUE PREVIEW */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                STORE REWARDS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif mt-1">
                Curated Store Vouchers
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Redeem your points for immediate billing discounts and exclusive experiences.
              </p>
            </div>

            <Link href="/customer/rewards">
              <Button variant="outline" className="border-stone-300 text-xs gap-1.5">
                All 15 Rewards
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.rewards.slice(0, 3).map(reward => (
              <Card key={reward.id} className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl">
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
                      <Button size="sm" className="h-8 text-xs bg-[#159028] hover:bg-emerald-700 text-white">
                        Redeem
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* WHY JOIN SECTION */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Zero Password Friction</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Never forget a password or get stuck waiting for SMS OTPs in store queues. Your unique mobile number is your key.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Instant Points Accrual</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Every ₹{state.pointsRule.amountPerPoint} spent awards 1 loyalty point calculated automatically by our store POS terminal.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">True Fashion Rewards</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  From ₹100 and ₹500 shopping credits to free alterations, styling sessions, and VIP sale access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FREQUENTLY ASKED QUESTIONS */}
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
        {/* BOTTOM CTA STRIP */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0D0D0D] via-stone-900 to-[#0D0D0D] text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-stone-800">
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

      <Footer />
    </div>
  );
}
