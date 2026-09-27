'use client';

import React, { useRef, useState } from 'react';
import { TierConfig, Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

interface TierCard3DProps {
  tier: TierConfig;
  customer?: Customer;
}

export function TierCard3D({ tier, customer }: TierCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = customer?.currentTier === tier.name;
  const currentLifetimePoints = customer?.lifetimePoints ?? 3580;

  // Milestone points remaining to this tier or next
  let tierSubtext = '';
  if (isCurrent) {
    if (tier.name === 'Bronze') tierSubtext = '1,000 pts to Silver';
    else if (tier.name === 'Silver') tierSubtext = '1,420 pts to Gold';
    else if (tier.name === 'Gold') tierSubtext = '15,000 pts to Platinum';
    else tierSubtext = 'Highest VIP Status';
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="perspective-1000 w-full h-full"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 select-none overflow-hidden ${
          isCurrent
            ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-[#0e2a14] text-white border-2 border-emerald-500 shadow-2xl'
            : 'bg-white text-stone-900 border border-stone-200 shadow-sm hover:shadow-xl'
        }`}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? (isCurrent ? 0.25 : 0.4) : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
          }}
        />

        {/* Current Tier Ribbon */}
        {isCurrent && (
          <div className="absolute top-0 right-0 bg-[#159028] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Active Tier</span>
          </div>
        )}

        <div className="space-y-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div
                className="text-4xl mb-2 transition-transform duration-300 inline-block"
                style={{
                  transform: isHovered ? 'rotateZ(12deg) scale(1.1)' : 'rotateZ(0deg) scale(1)',
                }}
              >
                {tier.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                {tier.name}
              </h3>
              <span
                className={`text-xs font-mono font-medium block mt-0.5 ${
                  isCurrent ? 'text-emerald-400' : 'text-stone-500'
                }`}
              >
                {tier.maxPoints === Infinity
                  ? `${tier.minPoints.toLocaleString('en-IN')}+ points`
                  : `${tier.minPoints.toLocaleString('en-IN')} – ${tier.maxPoints.toLocaleString('en-IN')} points`}
              </span>
            </div>

            <Badge
              variant={isCurrent ? 'green' : (tier.name.toLowerCase() as any)}
              className="text-xs font-bold px-2.5 py-0.5"
            >
              {tier.rewardMultiplier}x Points
            </Badge>
          </div>

          {/* Current Tier Live Status Tag */}
          {isCurrent && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/50 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-400">Your Current Points</span>
                <span className="font-bold text-white font-mono">{currentLifetimePoints.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">{tierSubtext}</div>
            </div>
          )}

          {/* Benefits List */}
          <div className="space-y-3 pt-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                isCurrent ? 'text-stone-400' : 'text-stone-400'
              }`}
            >
              PRIVILEGES & PERKS
            </span>
            <ul className="space-y-2 text-xs">
              {tier.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2.5 leading-relaxed ${
                    isCurrent ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  <span className="text-[#159028] font-bold shrink-0 mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-6 border-t mt-6 relative z-10" style={{ transform: 'translateZ(15px)' }}>
          {isCurrent ? (
            <div className="text-center py-2 px-3 rounded-xl bg-emerald-900/40 text-emerald-300 font-bold text-xs border border-emerald-700/40">
              ✓ Active In-Store Privilege
            </div>
          ) : (
            <Link href="/admin/purchases" className="w-full block">
              <Button
                variant="outline"
                className="w-full text-xs h-10 rounded-xl border-stone-300 hover:border-stone-900 hover:bg-stone-50"
              >
                Earn Toward {tier.name}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
