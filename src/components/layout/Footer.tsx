import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white border-t border-stone-800">
      {/* Brand Ethos Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-widest text-white font-serif uppercase">
                WESTSIDE
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#159028] font-bold">
                L O Y A L T Y
              </span>
            </div>
            <p className="mt-4 text-xs text-stone-400 leading-relaxed">
              Westside Loyalty rewards your personal style every time you shop at our physical retail stores nationwide. Earn points on every purchase and elevate your wardrobe.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>₹250 spent in store = 1 Loyalty Point</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Customer Portal
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/customer" className="hover:text-white transition-colors">
                  Loyalty Dashboard
                </Link>
              </li>
              <li>
                <Link href="/customer/rewards" className="hover:text-white transition-colors">
                  Rewards Catalogue
                </Link>
              </li>
              <li>
                <Link href="/customer/membership" className="hover:text-white transition-colors">
                  Membership Tiers & Perks
                </Link>
              </li>
              <li>
                <Link href="/customer/transactions" className="hover:text-white transition-colors">
                  Transaction History
                </Link>
              </li>
              <li>
                <Link href="/customer/profile" className="hover:text-white transition-colors">
                  Customer Profile
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  + Create Free Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Store & Staff Operations
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/admin/purchases" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Billing & Purchase POS Entry
                </Link>
              </li>
              <li>
                <Link href="/admin/customers" className="hover:text-white transition-colors">
                  Customer Lookup & Records
                </Link>
              </li>
              <li>
                <Link href="/admin/rewards" className="hover:text-white transition-colors">
                  Rewards Management
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-white transition-colors">
                  Store Catalogue Admin
                </Link>
              </li>
              <li>
                <Link href="/admin/membership" className="hover:text-white transition-colors">
                  Tier & Points Rules
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-white transition-colors">
                  Analytics & Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Retail Stores Info
            </h4>
            <div className="mt-4 space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Over 120+ Westside Stores across Mumbai, Delhi NCR, Bangalore, Pune, Kolkata & Chennai.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Store Concierge: 1800-209-WEST</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-400">
                <span className="font-semibold text-stone-200 block mb-1">Physical Store Loyalty:</span>
                This system runs on purchases made at Westside retail counters. Clothing on the website represents current in-store stock for browsing only.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>© 2026 Westside Loyalty Management System. All rights reserved.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>No Password Required Flow</span>
          <span>•</span>
          <span>Zero OTP Requirement</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">In-Store Loyalty Platform</span>
        </div>
      </div>
    </footer>
  );
}
