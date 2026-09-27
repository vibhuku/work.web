'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Sparkles, ArrowDown, CheckCircle2, Play, RotateCcw, Store, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function PurchasePointsAnimation() {
  const [billAmount, setBillAmount] = useState(5000);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const pointTokenRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const pointsEarned = Math.floor(billAmount / 250);
  const prevPoints = 3580;
  const newBalance = prevPoints + pointsEarned;

  // Run GSAP Timeline Animation
  const runAnimation = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    setIsPlaying(true);
    setActiveStep(1);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPlaying(false);
        setActiveStep(4);
        // Small celebratory confetti burst
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#159028', '#34d399', '#fef08a'],
        });
      },
    });

    timelineRef.current = tl;

    // Reset initial transforms
    gsap.set([billRef.current, calcRef.current, pointTokenRef.current, balanceRef.current], {
      clearProps: 'all',
    });

    // Step 1: Bill Card entrance
    tl.fromTo(
      billRef.current,
      { y: 25, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
    );

    // Step 2: Calculation Card pulse
    tl.call(() => setActiveStep(2), [], '+=0.2');
    tl.fromTo(
      calcRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    // Step 3: Green Points Token flies out with trail
    tl.call(() => setActiveStep(3), [], '+=0.2');
    tl.fromTo(
      pointTokenRef.current,
      { scale: 0, opacity: 0, y: -10 },
      { scale: 1.15, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }
    );
    tl.to(pointTokenRef.current, { scale: 1, duration: 0.2 });

    // Step 4: New Balance Card blooms with green glow
    tl.call(() => setActiveStep(4), [], '+=0.2');
    tl.fromTo(
      balanceRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    tl.to(balanceRef.current, {
      boxShadow: '0 20px 40px -10px rgba(21, 144, 40, 0.35)',
      duration: 0.4,
    });
  };

  // Run on mount once
  useEffect(() => {
    runAnimation();
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [billAmount]);

  const presetAmounts = [2500, 5000, 7500, 10000];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#0D0D0D] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl border border-stone-800 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 relative z-10 border-b border-stone-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
              Store Bill → Instant Points Transfer
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Experience the instant point calculation pipeline that executes at our store registers when a cashier scans your purchase.
            </p>
          </div>

          {/* Preset Buttons & Replay */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 mr-1">Bill Amount:</span>
            {presetAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setBillAmount(amt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  billAmount === amt
                    ? 'bg-[#159028] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
            <Button
              onClick={runAnimation}
              disabled={isPlaying}
              size="sm"
              variant="outline"
              className="border-stone-700 text-xs text-stone-200 hover:bg-stone-800 ml-2 gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              Replay
            </Button>
          </div>
        </div>

        {/* 4 Interactive Flow Steps Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* STEP 1: STORE BILL */}
          <div
            ref={billRef}
            className={`p-6 rounded-2xl bg-stone-900/90 border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 1 ? 'border-emerald-500/60 shadow-lg' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#159028] uppercase">
                  STEP 01
                </span>
                <Receipt className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Physical Store Bill</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Customer purchases garments at Westside Phoenix Mall checkout counter.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 space-y-1.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Gross Total</span>
              <div className="text-2xl font-black text-white font-serif tracking-tight">
                {formatCurrency(billAmount)}
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Bill: WS-2026-0927-01</span>
            </div>
          </div>

          {/* STEP 2: POINTS CALCULATION */}
          <div
            ref={calcRef}
            className={`p-6 rounded-2xl bg-stone-900/90 border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 2 ? 'border-emerald-500/60 shadow-lg' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#159028] uppercase">
                  STEP 02
                </span>
                <span className="text-sm font-mono text-emerald-400 font-bold">÷ ₹250</span>
              </div>
              <h3 className="text-base font-bold text-white">Loyalty Engine</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                POS matches mobile number & applies active rate: ₹250 spent = 1 Loyalty Point.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 space-y-1.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Formula Applied</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {formatCurrency(billAmount)} / ₹250
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Customer: Rahul Kumar</span>
            </div>
          </div>

          {/* STEP 3: ACCRUED POINTS BADGE */}
          <div
            ref={pointTokenRef}
            className={`p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-stone-900 border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 3 ? 'border-[#159028] shadow-2xl scale-[1.02]' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
                  STEP 03
                </span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">Points Dispatched</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Bonus points generated and transmitted to central customer loyalty profile.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-900/60 space-y-1.5">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Credit Amount</span>
              <div className="text-3xl font-black text-[#34d399] tracking-tight">
                +{pointsEarned} Points
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">Instant Notification Sent</span>
            </div>
          </div>

          {/* STEP 4: UPDATED BALANCE & PROGRESS */}
          <div
            ref={balanceRef}
            className={`p-6 rounded-2xl bg-stone-900/90 border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 4 ? 'border-yellow-500/60 shadow-xl' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-yellow-400 uppercase">
                  STEP 04
                </span>
                <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-base font-bold text-white">New Balance</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Customer balance and tier milestone advance immediately across all 120+ stores.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">Previous</span>
                <span className="text-xs text-stone-400 font-mono">{prevPoints} pts</span>
              </div>
              <div className="text-3xl font-black text-white font-serif tracking-tight">
                {newBalance.toLocaleString('en-IN')} <span className="text-xs font-sans text-emerald-400">pts</span>
              </div>
              <span className="text-[11px] text-yellow-400 font-semibold block">
                {Math.max(0, 5000 - newBalance)} pts to Gold status
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
