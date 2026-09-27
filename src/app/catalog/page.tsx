'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Store,
  Search,
  Filter,
  Eye,
  X,
  Info,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { ProductCard3D } from '@/components/3d/ProductCard3D';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Accessories'] as const;

export default function CatalogPage() {
  const { state, calculatePoints } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = state.products.filter(product => {
    if (activeCategory !== 'All' && product.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchTag = product.tag.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Notice: In-Store Browsing Only */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900 font-medium">
            <Store className="w-4 h-4 text-[#159028] shrink-0" />
            <span>
              <strong>Physical Store Catalogue:</strong> These garments are available for trial & purchase at Westside retail stores. No online carts or checkout.
            </span>
          </div>
          <Link href="/admin/purchases" className="shrink-0">
            <Button size="sm" variant="outline" className="text-xs bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100">
              Staff POS Terminal →
            </Button>
          </Link>
        </div>

        {/* Editorial Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#159028]">
              CURRENT STORE SELECTION
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif mt-1">
              The Season's Lookbook
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Browse current in-store styles. Try them on in-store, provide your mobile number at checkout, and earn 1 point per ₹{state.pointsRule.amountPerPoint}.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search garments, styles..."
              className="pl-9 h-11 text-xs"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          {CATEGORIES.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-[#0D0D0D] text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {category === 'All' ? 'All Collections' : category}
            </button>
          ))}
          <span className="ml-auto text-xs text-stone-400 hidden sm:inline">
            Showing {filteredProducts.length} in-store items
          </span>
        </div>

        {/* Product Cards Grid with 3D Tilt & Quick View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const pointsWillEarn = calculatePoints(product.price);
            return (
              <ProductCard3D
                key={product.id}
                product={product}
                pointsEarned={pointsWillEarn}
                onQuickView={prod => setSelectedProduct(prod)}
              />
            );
          })}
        </div>

        {/* Quick View / In-Store Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2 aspect-square md:aspect-auto relative bg-stone-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-stone-700 hover:bg-white md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="text-[10px]">
                        {selectedProduct.category}
                      </Badge>
                      <h2 className="text-xl font-bold text-stone-900 mt-1 font-serif">
                        {selectedProduct.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hidden md:block"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-2xl font-black text-stone-900">
                    {formatCurrency(selectedProduct.price)}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Available Colors */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-stone-700">Available Shades:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.colors.map(color => (
                          <span
                            key={color}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Sizes */}
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-stone-700">Store Rack Sizes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.sizes.map(size => (
                          <span
                            key={size}
                            className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-xs font-semibold text-stone-800 bg-stone-50"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loyalty Points Earning Highlight */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#159028]">
                      <Sparkles className="w-4 h-4" />
                      <span>Earn +{calculatePoints(selectedProduct.price)} Loyalty Points</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      When purchasing this garment at any Westside store counter, simply share your registered mobile number.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 mt-4 space-y-2">
                  <div className="p-3 bg-stone-50 rounded-xl text-center text-xs text-stone-600 font-medium">
                    📍 Try & Buy In Store — Not Sold Online
                  </div>

                  <Link href="/admin/purchases" className="w-full block">
                    <Button className="w-full bg-[#0D0D0D] text-white hover:bg-stone-800 text-xs gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      Simulate Billing in POS Terminal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
