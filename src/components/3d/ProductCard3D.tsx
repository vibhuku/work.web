'use client';

import React, { useRef, useState } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sparkles, Eye } from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
  pointsEarned: number;
  onQuickView: (product: Product) => void;
}

export function ProductCard3D({ product, pointsEarned, onQuickView }: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (max 6 degrees to keep it elegant and minimal)
    const rotX = -((y - centerY) / centerY) * 6;
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none relative"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
      }}
    >
      <div>
        {/* Product Image Stage */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full shadow-sm">
              {product.tag}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#159028] text-white px-2.5 py-1 rounded-full shadow-md">
              <MapPin className="w-3 h-3" />
              In Store
            </span>
          </div>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 z-20">
            <Button
              type="button"
              onClick={() => onQuickView(product)}
              className="bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold shadow-2xl gap-1.5 rounded-xl h-10 px-5 transform group-hover:scale-100 scale-95 transition-transform"
            >
              <Eye className="w-4 h-4 text-[#159028]" />
              Quick View Garment
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
            {product.category}
          </div>

          <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#159028] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-base font-black text-stone-900 font-serif">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[11px] font-bold text-[#159028] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Earn +{pointsEarned} Pts
            </span>
          </div>
        </div>
      </div>

      {/* Footer Availability & Action */}
      <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-2">
        <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2">
          <span className="w-2 h-2 rounded-full bg-[#159028] animate-pulse" />
          <span>Available at 120+ Westside Stores</span>
        </div>

        <Button
          type="button"
          onClick={() => onQuickView(product)}
          variant="outline"
          className="w-full text-xs h-9 rounded-xl border-stone-200 hover:bg-stone-50 font-semibold"
        >
          Check In-Store Rack
        </Button>
      </div>
    </div>
  );
}
