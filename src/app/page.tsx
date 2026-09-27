'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/types';
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
  CreditCard,
  User,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const { state, calculatePoints } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active customer for preview
  const activeCustomer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const categories = [
    {
      name: 'Men',
      tagline: 'Everyday essentials, elevated.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      count: '8 Collections',
      categoryKey: 'Men',
    },
    {
      name: 'Women',
      tagline: 'Contemporary styles for every moment.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      count: '12 Collections',
      categoryKey: 'Women',
    },
    {
      name: 'Kids',
      tagline: 'Playful styles for little personalities.',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
      count: '6 Collections',
      categoryKey: 'Kids',
    },
    {
      name: 'Footwear',
      tagline: 'Complete your look with timeless comfort.',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      count: '5 Collections',
      categoryKey: 'Footwear',
    },
    {
      name: 'Accessories',
      tagline: 'Finishing touches with modern distinction.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      count: '6 Collections',
      categoryKey: 'Accessories',
    },
  ];

  // Specific showcase products
  const showcaseProducts = [
    {
      id: 'SHOW-1',
      name: 'Oversized Cotton Shirt',
      category: 'Men',
      price: 1999,
      points: 8,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      tag: 'New Season',
      description: 'Crafted from pure lightweight cotton with a contemporary relaxed fit. Ideal for effortless layering.',
    },
    {
      id: 'SHOW-2',
      name: 'Relaxed Fit Denim',
      category: 'Men',
      price: 2499,
      points: 10,
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      tag: 'Bestseller',
      description: 'Classic straight-leg denim with subtle stretch for all-day comfort and a clean, structured finish.',
    },
    {
      id: 'SHOW-3',
      name: 'Classic Polo T-Shirt',
      category: 'Men',
      price: 1499,
      points: 6,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      tag: 'Essential',
      description: 'Finely spun mercerized cotton polo with ribbed collar and tailored sleeves. An in-store wardrobe anchor.',
    },
    {
      id: 'SHOW-4',
      name: 'Women’s Relaxed Dress',
      category: 'Women',
      price: 2999,
      points: 12,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      tag: 'Trending',
      description: 'Fluid floral printed midi dress designed with breathable fabric and flattering silhouette.',
    },
    {
      id: 'SHOW-5',
      name: 'Lightweight Jacket',
      category: 'Women',
      price: 3499,
      points: 14,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      tag: 'Must Have',
      description: 'Modern cropped utility jacket crafted from sturdy cotton twill with premium horn buttons.',
    },
    {
      id: 'SHOW-6',
      name: 'Straight Fit Trousers',
      category: 'Women',
      price: 2199,
      points: 9,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      tag: 'New Arrival',
      description: 'High-waisted tailored trousers in fluid drape crepe fabric. Features discreet slant pockets and clean hems.',
    },
  ];

  // 4 Simplified Membership Tiers requested
  const membershipTiers = [
    {
      name: 'BRONZE',
      range: '0–199 Points',
      benefit: 'Welcome Rewards',
      multiplier: '1x Points',
      color: 'border-amber-700/30 bg-gradient-to-b from-amber-50/50 to-white text-stone-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-200',
      perks: [
        'Welcome rewards on joining',
        'Basic promotional offers',
        'Birthday greetings & gift points',
        'Physical store event notifications',
      ],
      progress: 'Entry Level',
    },
    {
      name: 'SILVER',
      range: '200–499 Points',
      benefit: 'Exclusive Offers',
      multiplier: '1.25x Points',
      color: 'border-slate-300 bg-gradient-to-b from-slate-50 to-white text-stone-900 shadow-sm',
      badge: 'bg-slate-200 text-slate-800 border-slate-300',
      perks: [
        'Exclusive seasonal discount vouchers',
        'Birthday 15% special savings',
        'Early access to seasonal sales',
        'Complimentary gift packaging in store',
      ],
      progress: 'Active Status (Rahul)',
    },
    {
      name: 'GOLD',
      range: '500–799 Points',
      benefit: 'Higher Rewards',
      multiplier: '1.5x Points',
      color: 'border-amber-400/60 bg-gradient-to-b from-amber-500/5 to-white text-stone-900 shadow-sm',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      perks: [
        'Higher points multiplier on all bills',
        'Free in-store alterations on trousers & shirts',
        'Priority checkout during weekend rushes',
        'Invitations to preview private collections',
      ],
      progress: 'Unlock at 500 Pts',
    },
    {
      name: 'PLATINUM',
      range: '800–1,000+ Points',
      benefit: 'Premium Benefits',
      multiplier: '2.0x Points',
      color: 'border-stone-800 bg-[#0D0D0D] text-white shadow-xl',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      perks: [
        'VIP access to luxury fashion launches',
        'Complimentary 1-on-1 personal styling',
        'Free home delivery of tailored garments',
        'Annual anniversary luxury gift voucher',
      ],
      progress: 'VIP Privileges',
    },
  ];

  // Curated Rewards
  const curatedRewards = [
    {
      title: '₹100 Shopping Reward',
      points: 100,
      value: '₹100 Instant Discount',
      desc: 'Applied directly at the billing counter on bills of ₹1,000 or more.',
      icon: '🛍️',
      category: 'Store Voucher',
    },
    {
      title: '₹250 Shopping Reward',
      points: 250,
      value: '₹250 Instant Discount',
      desc: 'Immediate cash deduction at store checkout on purchases above ₹2,500.',
      icon: '🏷️',
      category: 'Store Voucher',
    },
    {
      title: '10% OFF Entire Bill',
      points: 300,
      value: 'Flat 10% Off',
      desc: 'Exclusive storewide 10% bill waiver. Valid across all apparel racks.',
      icon: '✨',
      category: 'Percentage Off',
    },
    {
      title: 'Birthday Special Reward',
      points: 200,
      value: '15% Birthday Treat',
      desc: 'Celebrate your special month with a 15% discount voucher on your total bill.',
      icon: '🎂',
      category: 'Annual Special',
    },
    {
      title: 'Exclusive Member Offer',
      points: 500,
      value: '20% Premium Offer',
      desc: 'Unlock 20% savings on high-end jackets, silks, and formal tailored suits.',
      icon: '💎',
      category: 'VIP Privilege',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />

      <main className="flex-1 space-y-24 sm:space-y-32 pb-24">
        {/* ============================================================ */}
        {/* 1. HERO SECTION: FASHION CLOTHING EDITORIAL & INTEGRATED CARD */}
        {/* ============================================================ */}
        <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Bold Editorial Headline */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 text-stone-800 text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#159028]"></span>
                  <span className="uppercase tracking-widest text-[11px] text-[#159028]">Physical Retail Loyalty</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-500 font-normal">120+ Stores In India</span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#0D0D0D] tracking-tight font-serif leading-[1.02]">
                    Earn. <br />
                    Elevate. <br />
                    <span className="text-[#159028] italic font-serif font-normal">Enjoy.</span>
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-lg font-normal">
                  Shop in-store. Earn points. Unlock exclusive rewards. Experience fashion privileges tailored for every visit to your neighborhood Westside store.
                </p>

                {/* Conversion Pill Strip */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200/90 text-xs flex items-center justify-between font-medium max-w-md shadow-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Store className="w-4 h-4 text-[#159028]" />
                    <span>Store Billing Conversion:</span>
                  </div>
                  <span className="font-bold text-[#159028] font-mono text-sm bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                    ₹{state.pointsRule.amountPerPoint} Spent = 1 Point
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/catalog">
                    <Button size="lg" className="bg-[#0D0D0D] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-8 h-12 rounded-xl shadow-md gap-2">
                      Explore Collections
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href="/customer/rewards">
                    <Button size="lg" variant="outline" className="border-stone-300 bg-white font-bold text-xs uppercase tracking-wider px-7 h-12 rounded-xl hover:bg-stone-50 text-stone-800">
                      View Rewards
                    </Button>
                  </Link>

                  <Link href="/admin/purchases" className="hidden sm:inline-block">
                    <Button size="lg" variant="ghost" className="text-xs text-stone-500 hover:text-stone-900 gap-1.5 h-12">
                      <Receipt className="w-3.5 h-3.5 text-[#159028]" />
                      Store Staff POS →
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-3 text-xs text-stone-500 border-t border-stone-200/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>No Password Required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>Mobile Number ID</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#159028]" />
                    <span>Physical In-Store Perks</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Fashion Clothing Editorial Composition + Floating Loyalty Card */}
              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  {/* Fashion Multi-Image Editorial Layout */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Primary Editorial Image: Men Linen & Blazer */}
                    <div className="col-span-7 aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100 group relative">
                      <img
                        src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80"
                        alt="Westside Men Apparel Lookbook"
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">AUTUMN / WINTER</span>
                        <div className="text-sm font-bold font-serif">Tailored Shirts & Casual Overshirts</div>
                      </div>
                    </div>

                    {/* Secondary Stack: Women Dress & Trending Garment */}
                    <div className="col-span-5 space-y-3">
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-100 group relative">
                        <img
                          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                          alt="Westside Women Dress Lookbook"
                          className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300">WOMEN</span>
                          <div className="text-xs font-bold font-serif leading-tight">Relaxed Dresses</div>
                        </div>
                      </div>

                      <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-100 group relative">
                        <img
                          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                          alt="Westside Contemporary Trousers"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-2.5 left-3 text-white">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300">IN-STORE RACKS</span>
                          <div className="text-xs font-bold font-serif leading-tight">Wide Leg Trousers</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sleek Floating Loyalty Card Visually Integrated Into Hero */}
                  <div className="absolute -bottom-6 -left-4 sm:left-4 right-4 sm:right-auto sm:w-[360px] p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-stone-200/90 space-y-3 z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#0D0D0D] text-white flex items-center justify-center font-bold text-xs">
                          W
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 leading-tight">Rahul Kumar</div>
                          <div className="text-[10px] text-stone-400 font-mono">+91 98765 43210</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#159028] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        Silver Member
                      </span>
                    </div>

                    <div className="bg-[#F8F7F4] p-3 rounded-xl border border-stone-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                          LOYALTY BALANCE
                        </span>
                        <div className="text-2xl font-black text-stone-900 font-mono tracking-tight">
                          3,580 <span className="text-xs font-medium text-stone-500 font-sans">Points</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Next Tier</span>
                        <span className="text-xs font-bold text-amber-700">Gold (5,000 pts)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                        <span>Tier Progress</span>
                        <span className="text-[#159028] font-bold">1,420 points to Gold</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-[#159028] rounded-full transition-all duration-1000"
                          style={{ width: '71.6%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. COLLECTIONS: "SHOP YOUR STYLE" (LARGE EDITORIAL CATEGORY CARDS) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                  IN-STORE CATEGORIES
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">Available across all metro stores</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight font-serif mt-1">
                Shop Your Style
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Explore our signature fashion departments. Preview the collections, try them on in-store, and earn points on every billing.
              </p>
            </div>

            <Link href="/catalog">
              <Button variant="outline" className="border-stone-300 bg-white text-xs font-bold uppercase tracking-wider px-5 h-11 rounded-xl hover:bg-stone-50 gap-1.5">
                View Full Lookbook
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href="/catalog"
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/90 bg-white flex flex-col justify-between"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 px-2.5 py-1 rounded-full shadow-xs">
                      {cat.count}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="text-xl font-bold font-serif tracking-wide">{cat.name}</h3>
                    <p className="text-[11px] text-stone-200 line-clamp-2 leading-relaxed">
                      "{cat.tagline}"
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between text-xs text-stone-700 font-semibold group-hover:text-[#159028] transition-colors">
                  <span>Browse In Store</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. PRODUCT SHOWCASE: FASHION RETAIL GRID (NO CART / STORE ONLY) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                ON THE STORE RACKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight font-serif mt-1">
                Featured Clothing On Racks
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Browse this week’s arrivals. Touch, feel, and try on at your local Westside store while earning loyalty points.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Rule: ₹250 Spent = 1 Point
              </span>
              <Link href="/catalog">
                <Button variant="outline" className="border-stone-300 bg-white text-xs font-bold uppercase tracking-wider h-11 px-5 rounded-xl hover:bg-stone-50 gap-1.5">
                  View 20+ Outfits
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Garment Image Container */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-500"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 px-2.5 py-1 rounded-full shadow-xs">
                        {product.tag}
                      </span>
                    </div>

                    {/* Available in Store Pin */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#159028] text-white px-2.5 py-1 rounded-full shadow-md">
                        <MapPin className="w-3 h-3" />
                        Available In Store
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                      {product.category}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 font-serif group-hover:text-[#159028] transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between">
                      <span className="text-lg font-black text-stone-900 font-serif">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs font-bold text-[#159028] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        Earn {product.points} Points
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action: Quick View for In-Store Information (No Cart / Checkout) */}
                <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-2">
                  <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2">
                    <span className="w-2 h-2 rounded-full bg-[#159028]"></span>
                    <span>Ready for fitting in all retail branches</span>
                  </div>

                  <Button
                    type="button"
                    onClick={() =>
                      setSelectedProduct({
                        id: product.id,
                        name: product.name,
                        category: product.category as any,
                        price: product.price,
                        tag: product.tag,
                        description: product.description,
                        image: product.image,
                        inStore: true,
                        colors: ['Original', 'Alternative'],
                        sizes: ['S', 'M', 'L', 'XL'],
                      })
                    }
                    variant="outline"
                    className="w-full text-xs font-semibold h-10 border-stone-200 hover:bg-stone-50 rounded-xl"
                  >
                    View In-Store Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. LOYALTY EXPLANATION: 4-STEP FLOW + PURCHASE CALCULATION CARD */}
        {/* ============================================================ */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
              EFFORTLESS RETAIL FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight font-serif">
              How Your Loyalty Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              No plastic cards to carry, no complicated app installations. Just your mobile number at checkout.
            </p>
          </div>

          {/* 4 Connected Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                  Shop In Store
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Visit any of our 120+ retail fashion stores nationwide. Try on your favorite garments from Men, Women, Kids, or Accessories.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Phone className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                  Share Your Mobile Number
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  At the billing counter, simply speak your 10-digit mobile number to our store cashier. No password, no OTP delays.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                  Earn Points
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Points calculate instantly at ₹250 spent = 1 point. A ₹5,000 store bill immediately adds +20 points to your account.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-stone-200 group-hover:text-[#159028] transition-colors font-serif">
                  04
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                  <Gift className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                  Unlock Rewards
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Redeem your accumulated points for shopping vouchers (₹100, ₹250, ₹500), 10% discounts, and higher VIP membership tiers.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Purchase to Points Calculation Card (Demonstrates the Solution) */}
          <div className="bg-[#0D0D0D] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-stone-800">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  REAL-WORLD BILLING SCENARIO
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif">
                  See How Fast Your Store Bill Turns Into Rewards
                </h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  Here is how a routine weekend shopping trip at Westside translates into instant savings.
                </p>
              </div>

              {/* Step By Step Pipeline Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                {/* 1. Purchase */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">STORE PURCHASE</span>
                  <div className="text-2xl font-black text-white font-serif">₹5,000</div>
                  <span className="text-[11px] text-stone-400 block">Weekend Clothes</span>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex justify-center text-emerald-400 font-bold text-xl">
                  →
                </div>

                {/* 2. Calculation */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">LOYALTY FORMULA</span>
                  <div className="text-xl font-bold text-white font-mono">₹250 = 1 PT</div>
                  <span className="text-[11px] text-stone-400 block">Automatic Math</span>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex justify-center text-emerald-400 font-bold text-xl">
                  →
                </div>

                {/* 3. Points Earned */}
                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-700/80 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">POINTS EARNED</span>
                  <div className="text-2xl font-black text-[#159028] font-mono">+20 POINTS</div>
                  <span className="text-[11px] text-emerald-200 block">Credited Instantly</span>
                </div>
              </div>

              {/* Bottom Result Strip */}
              <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#159028] text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 uppercase font-bold tracking-wider">NEW LOYALTY BALANCE</div>
                    <div className="text-lg font-bold text-white">100 Total Points Reached</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="green" className="text-xs px-3 py-1 font-bold">
                    🎉 ₹100 Reward Unlocked!
                  </Badge>
                  <Link href="/customer/rewards">
                    <Button size="sm" className="bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs h-9 rounded-xl">
                      Claim In-Store Voucher
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. MEMBERSHIP SYSTEM (4 FASHION MEMBERSHIP CARDS) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
              PROGRESSIVE PRIVILEGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight font-serif">
              Four Tiers of Fashion Distinction
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              The more you visit our retail stores, the higher your rewards multiplier and VIP store privileges climb.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map(tier => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 ${tier.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest font-mono">
                      {tier.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tier.badge}`}>
                      {tier.multiplier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black font-serif tracking-tight">{tier.range}</h3>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">
                      Key Benefit: {tier.benefit}
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs pt-2 border-t border-stone-200/40">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone-600">
                        <Check className="w-3.5 h-3.5 text-[#159028] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200/40">
                  <div className="text-[11px] font-bold text-stone-400 mb-2">{tier.progress}</div>
                  <Link href="/customer/membership" className="w-full block">
                    <Button variant="outline" className="w-full text-xs font-bold h-9 rounded-xl border-stone-300">
                      Tier Details →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. CUSTOMER DASHBOARD PREVIEW: "HI, RAHUL" */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                  CUSTOMER PORTAL PREVIEW
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif mt-1">
                  Hi, Rahul 👋
                </h3>
                <p className="text-xs text-stone-500">
                  Profile: Rahul Kumar • Mobile: +91 98XXXXXX21 • Status: Silver Member
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/customer">
                  <Button className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs">
                    Open Full Dashboard →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Total Points & Progress */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/90 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    TOTAL ACCUMULATED POINTS
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-stone-900 font-mono tracking-tight">
                    3,600 <span className="text-sm font-sans font-semibold text-stone-500">PTS</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#159028] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Eligible for ₹100, ₹250, and 10% Vouchers</span>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/90 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>SILVER → GOLD</span>
                    <span className="text-[#159028]">3,600 / 5,000 Pts</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-[#159028] rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <div className="text-[11px] text-stone-500 flex justify-between">
                    <span>1,400 points to Gold</span>
                    <span className="font-semibold text-stone-700">Gold unlocks free alterations</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <Link href="/customer/rewards" className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors">
                    <Gift className="w-4 h-4 mx-auto text-[#159028] mb-1" />
                    <span className="text-[10px] font-bold text-stone-800 block">Rewards</span>
                  </Link>
                  <Link href="/customer/transactions" className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors">
                    <Clock className="w-4 h-4 mx-auto text-[#159028] mb-1" />
                    <span className="text-[10px] font-bold text-stone-800 block">History</span>
                  </Link>
                  <Link href="/customer/membership" className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors">
                    <Crown className="w-4 h-4 mx-auto text-[#159028] mb-1" />
                    <span className="text-[10px] font-bold text-stone-800 block">Tiers</span>
                  </Link>
                  <Link href="/customer/profile" className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors">
                    <User className="w-4 h-4 mx-auto text-[#159028] mb-1" />
                    <span className="text-[10px] font-bold text-stone-800 block">Profile</span>
                  </Link>
                </div>
              </div>

              {/* Right: Recent In-Store Transaction Log */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Recent Store Transactions
                  </h4>
                  <Link href="/customer/transactions" className="text-xs text-[#159028] font-bold hover:underline">
                    View Statement →
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900">Westside Store — Phoenix Palladium</div>
                        <div className="text-[11px] text-stone-400">26 Sep 2026 • Bill Amount: ₹5,000</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-[#159028]">+20 Points</div>
                      <span className="text-[10px] text-stone-400">Earned</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#159028] flex items-center justify-center font-bold">
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900">Westside Store — Phoenix Palladium</div>
                        <div className="text-[11px] text-stone-400">20 Sep 2026 • Bill Amount: ₹2,500</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-[#159028]">+10 Points</div>
                      <span className="text-[10px] text-stone-400">Earned</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900">In-Store Reward Redeemed</div>
                        <div className="text-[11px] text-stone-400">15 Sep 2026 • ₹100 Shopping Reward</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-stone-900">-100 Points</div>
                      <span className="text-[10px] text-purple-700 font-semibold">Redeemed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. REWARDS SECTION: "REWARDS WORTH SHOPPING FOR" */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                INSTANT STORE PERKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight font-serif mt-1">
                Rewards Worth Shopping For
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Convert your accumulated points into immediate billing discounts and VIP styling treats.
              </p>
            </div>

            <Link href="/customer/rewards">
              <Button variant="outline" className="border-stone-300 bg-white text-xs font-bold uppercase tracking-wider h-11 px-5 rounded-xl hover:bg-stone-50 gap-1.5">
                Explore All 15 Rewards
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedRewards.map(reward => (
              <Card key={reward.title} className="border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 bg-white rounded-3xl group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center text-2xl group-hover:scale-108 transition-transform">
                      {reward.icon}
                    </div>
                    <Badge variant="green" className="text-[10px] font-bold">
                      {reward.points} Points
                    </Badge>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                      {reward.category}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">{reward.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {reward.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#159028]">{reward.value}</span>
                    <Link href="/customer/rewards">
                      <Button size="sm" className="h-8 text-xs font-bold bg-[#0D0D0D] hover:bg-stone-800 text-white rounded-xl px-4">
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
        {/* 8. STAFF / BILLING POS EXPERIENCE PREVIEW */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-stone-900 via-[#0D0D0D] to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5" />
                  Staff In-Store POS Experience
                </div>

                <h3 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
                  Seamless Checkout for Cashier Teams
                </h3>

                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
                  Cashiers look up customers using only a 10-digit mobile number. Enter the physical billing amount, and points are computed and credited in less than 5 seconds.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Link href="/admin/purchases">
                    <Button size="lg" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-6 h-11 rounded-xl shadow-md gap-2">
                      Launch Staff POS Terminal
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button size="lg" variant="outline" className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-11 px-5 rounded-xl">
                      Admin Portal
                    </Button>
                  </Link>
                </div>
              </div>

              {/* In-Store POS Simulated Card */}
              <div className="lg:col-span-6">
                <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#159028]"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        ADD STORE PURCHASE
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-stone-300">
                      Terminal #04 · Mumbai
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Mobile Number</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">98765 43210</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Customer</span>
                      <span className="font-bold text-stone-900 text-sm">Rahul Kumar</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block font-semibold">Current Points</span>
                      <span className="font-bold text-stone-700 text-sm">80 Pts</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 block font-semibold">Bill Amount</span>
                      <span className="font-bold text-stone-900 text-sm">₹5,000</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 block font-semibold">Points Earned</span>
                      <span className="font-black text-[#159028] text-sm">+20 Pts</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 text-white text-xs flex items-center justify-between">
                    <span>New Balance: <strong>100 Points</strong></span>
                    <span className="text-emerald-400 font-bold text-[11px]">🎉 ₹100 Reward Unlocked!</span>
                  </div>

                  <Link href="/admin/purchases" className="w-full block">
                    <Button className="w-full bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider h-11 rounded-xl shadow-xs">
                      Add Purchase & Award Points
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. FINAL BRAND CTA */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0D0D0D] text-white p-8 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden border border-stone-800">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
                START EARNING TODAY
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight font-serif">
                Every Purchase Takes You Further.
              </h2>
              <p className="text-sm sm:text-base text-stone-400 leading-relaxed font-normal">
                Shop more. Earn more. Unlock more. Create your free loyalty profile in 10 seconds and enjoy privileges across all Westside stores nationwide.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link href="/join">
                <Button size="lg" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-8 h-12 rounded-xl shadow-lg gap-2">
                  <Sparkles className="w-4 h-4" />
                  Join Westside Loyalty
                </Button>
              </Link>
              <Link href="/catalog">
                <Button size="lg" variant="outline" className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-12 px-7 rounded-xl">
                  Explore In-Store Lookbook
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
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/95 text-[10px] font-bold">
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
                    <h3 className="text-2xl font-black text-stone-900 font-serif mt-1">
                      {selectedProduct.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-stone-900 font-serif">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                    <span className="text-xs font-bold text-[#159028] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                      Earns +{calculatePoints(selectedProduct.price)} Points
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
                    <div className="font-bold text-stone-800 flex items-center gap-1.5">
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
                    <span>Store Loyalty Rate:</span>
                    <span className="font-bold text-stone-900">₹{state.pointsRule.amountPerPoint} = 1 Point</span>
                  </div>
                  <Link href="/catalog" className="w-full block">
                    <Button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full bg-[#159028] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider h-11 rounded-xl"
                    >
                      Browse Full In-Store Lookbook
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
