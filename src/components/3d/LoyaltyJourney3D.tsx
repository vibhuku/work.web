'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, ArrowRight, Zap, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyJourney3DProps {
  customer?: Customer;
}

export function LoyaltyJourney3D({ customer }: LoyaltyJourney3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Points state for interactive demo
  const initialBasePoints = customer?.availablePoints ?? 3580;
  const [displayPoints, setDisplayPoints] = useState(0);
  const [simulatedPoints, setSimulatedPoints] = useState(initialBasePoints);
  const [floatingBonus, setFloatingBonus] = useState<number | null>(null);

  const targetTierPoints = 5000;
  const currentTierName = customer?.currentTier || 'Silver';
  const nextTierName = 'Gold';
  const remainingPoints = Math.max(0, targetTierPoints - simulatedPoints);
  const progressPercent = Math.min(100, Math.round((simulatedPoints / targetTierPoints) * 100));

  // Circular ring constants
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Viewport entrance observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate counter up when in view
  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = simulatedPoints;
    const duration = 1200;
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayPoints(Math.floor(start + (end - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayPoints(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, simulatedPoints]);

  // Handle Interactive "+20 Points" Purchase Demo
  const handleSimulatePurchase = (addPts: number) => {
    setFloatingBonus(addPts);

    // Burst tiny confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#159028', '#34d399', '#fbbf24'],
    });

    setTimeout(() => {
      setSimulatedPoints(prev => prev + addPts);
      setFloatingBonus(null);
    }, 700);
  };

  const handleReset = () => {
    setSimulatedPoints(initialBasePoints);
    setFloatingBonus(null);
  };

  return (
    <section ref={containerRef} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
        {/* Decorative soft glowing backdrops */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#159028]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Copy & Interactive Triggers */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide">
              <Crown className="w-3.5 h-3.5 text-yellow-600" />
              <span>YOUR LOYALTY JOURNEY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight font-serif">
              Elevate to Gold. <br />
              <span className="text-[#159028]">Every Rupee Counts.</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Loyalty points are calculated and credited automatically upon checkout at any Westside store counter nationwide. Track your journey to higher reward multipliers and VIP salon access.
            </p>

            {/* Current vs Next Tier Milestone Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3 max-w-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🥈</span>
                  <div>
                    <span className="text-xs text-stone-400 font-semibold block">CURRENT TIER</span>
                    <span className="text-sm font-bold text-stone-900">{currentTierName} Member</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-xs text-stone-400 font-semibold block">NEXT MILESTONE</span>
                    <span className="text-sm font-bold text-yellow-700">{nextTierName} Status</span>
                  </div>
                  <span className="text-lg">🥇</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  <strong className="text-stone-900 font-mono">{remainingPoints.toLocaleString('en-IN')}</strong> points left to unlock Gold
                </span>
                <span className="font-semibold text-emerald-700">₹{(remainingPoints * 250).toLocaleString('en-IN')} in-store spend</span>
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Test In-Store Points Credit Demo:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={() => handleSimulatePurchase(20)}
                  className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-md gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Simulate ₹5,000 Bill (+20 Pts)
                </Button>
                <Button
                  onClick={() => handleSimulatePurchase(100)}
                  variant="outline"
                  className="border-stone-300 font-semibold text-xs h-10 px-4 rounded-xl hover:bg-white"
                >
                  +100 Pts Purchase
                </Button>
                {simulatedPoints !== initialBasePoints && (
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="text-stone-500 hover:text-stone-900 text-xs h-10 gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Circular Ring & Floating Coin */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Floating "+20 Points" Celebration Badge */}
            {floatingBonus && (
              <div
                className="absolute z-30 -top-8 px-4 py-2 rounded-full bg-[#159028] text-white font-black text-sm tracking-wider shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-bottom-6 fade-in zoom-in-95 duration-500"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>+{floatingBonus} POINTS EARNED!</span>
              </div>
            )}

            {/* Circular Progress Ring Container */}
            <div className="relative flex items-center justify-center">
              {/* SVG Animated Circular Ring */}
              <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-xl">
                {/* Background Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Animated Progress Gradient Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="url(#points-gradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={isInView ? strokeDashoffset : circumference}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                <defs>
                  <linearGradient id="points-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#159028" />
                    <stop offset="60%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Typography & Live Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#159028] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  BALANCE
                </span>
                <span className="text-4xl sm:text-5xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
                  {displayPoints.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-0.5">
                  POINTS
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-2">
                  {progressPercent}% to Gold
                </span>
              </div>

              {/* Floating 3D Interactive Coin Emblem (Orbiting Badge) */}
              <div
                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[2px] shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  transform: 'perspective(600px) rotateY(18deg) rotateX(10deg)',
                }}
                title="Westside Loyalty Gold Crest"
              >
                <div className="w-full h-full rounded-full bg-[#0D0D0D] flex flex-col items-center justify-center text-white border border-yellow-400/40 shadow-inner">
                  <span className="text-xl">🏆</span>
                  <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider -mt-0.5">
                    WESTSIDE
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="mt-8 text-center text-xs text-stone-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#159028]" />
              <span>Real-time store ledger synchronization</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
