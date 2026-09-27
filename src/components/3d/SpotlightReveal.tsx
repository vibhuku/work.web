'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, Eye, Compass, Touchpad } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SpotlightReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // 6 Trailing Circles coordinate state
  const circlesCount = 6;
  const positions = useRef(
    Array.from({ length: circlesCount }, () => ({ x: 0, y: 0 }))
  );
  const targetPos = useRef({ x: 0, y: 0 });
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    // Check if device supports fine cursor or touch
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetPos.current = { x: centerX, y: centerY };
    positions.current.forEach(p => {
      p.x = centerX;
      p.y = centerY;
    });

    let animationFrameId: number;
    let autoAngle = 0;

    // Smooth physics loop for trailing circles
    const updateTrail = () => {
      // If idle on mobile or not hovered, gently orbit in an organic figure-8
      if (!isHovered && hasTouch) {
        autoAngle += 0.02;
        targetPos.current.x = centerX + Math.cos(autoAngle) * (rect.width * 0.28);
        targetPos.current.y = centerY + Math.sin(autoAngle * 2) * (rect.height * 0.22);
      }

      // First circle leads, subsequent circles lag smoothly
      positions.current[0].x += (targetPos.current.x - positions.current[0].x) * 0.25;
      positions.current[0].y += (targetPos.current.y - positions.current[0].y) * 0.25;

      for (let i = 1; i < circlesCount; i++) {
        const prev = positions.current[i - 1];
        const curr = positions.current[i];
        // Decreasing spring damping for elegant organic trail
        const ease = 0.28 - i * 0.035;
        curr.x += (prev.x - curr.x) * ease;
        curr.y += (prev.y - curr.y) * ease;
      }

      // Apply to SVG circles
      trailRefs.current.forEach((circle, i) => {
        if (circle && positions.current[i]) {
          circle.setAttribute('cx', `${positions.current[i].x}`);
          circle.setAttribute('cy', `${positions.current[i].y}`);
        }
      });

      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);

    const handleMouseMove = (e: MouseEvent) => {
      const b = container.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - b.left,
        y: e.clientY - b.top,
      };
      if (!isHovered) setIsHovered(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const b = container.getBoundingClientRect();
        targetPos.current = {
          x: e.touches[0].clientX - b.left,
          y: e.touches[0].clientY - b.top,
        };
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // return toward center
      targetPos.current = { x: centerX, y: centerY };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHovered]);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#159028] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Lookbook Reveal
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif">
          Move Cursor to Illuminate Style
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Peer into the texture and motion of current Westside store arrivals through our cursor spotlight.
        </p>
      </div>

      {/* Main Interactive Spotlight Canvas Box */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[500px] md:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 select-none cursor-crosshair bg-stone-950 group"
      >
        {/* Layer 1: Static Editorial High-Fashion Image (Muted / Stylized) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80"
            alt="Westside In-Store Static Collection"
            className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 scale-100 group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-stone-950/40 backdrop-contrast-125" />
        </div>

        {/* Layer 2: Masked Vibrant Moving Layer (Color Runway / Rich Light) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            mask: 'url(#spotlight-trail-mask)',
            WebkitMask: 'url(#spotlight-trail-mask)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=90"
            alt="Westside Vibrant Runway Reveal"
            className="w-full h-full object-cover object-center filter brightness-110 saturate-150 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-black/30" />
        </div>

        {/* SVG Mask Definition with 6 Trailing Circles */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <mask id="spotlight-trail-mask">
              {/* Black background hides */}
              <rect width="100%" height="100%" fill="black" />

              {/* Trailing soft circles reveal */}
              {Array.from({ length: circlesCount }).map((_, i) => {
                // Outer circle has larger radius with gentle falloff
                const radius = 170 - i * 16;
                const opacity = 1 - i * 0.12;
                return (
                  <circle
                    key={i}
                    ref={el => {
                      trailRefs.current[i] = el;
                    }}
                    r={radius}
                    fill="white"
                    opacity={opacity}
                    style={{
                      filter: 'blur(20px)',
                    }}
                  />
                );
              })}
            </mask>
          </defs>
        </svg>

        {/* Ambient Overlay Controls & Brand Accents */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <Badge className="bg-white/95 text-stone-900 border border-stone-200 backdrop-blur-md px-3 py-1 font-bold text-xs uppercase tracking-wider shadow-md">
            Autumn / Winter '26
          </Badge>
          <span className="hidden sm:inline-flex text-[11px] text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            {isTouchDevice ? 'Touch to drag spotlight' : 'Follow cursor trail'}
          </span>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-5 rounded-2xl bg-[#0D0D0D]/80 backdrop-blur-md border border-white/10 text-white">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#159028]">
              PHYSICAL STORE EXCLUSIVE
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif">
              Crafted for Movement. Rewarded In Store.
            </h3>
            <p className="text-xs text-stone-300 max-w-md">
              Every garment previewed here earns loyalty points when purchased at any Westside store counter nationwide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/catalog">
              <Button size="sm" className="bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs px-4 h-10 rounded-xl shadow-md">
                Browse Full Catalogue
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm" variant="outline" className="text-xs border-stone-600 text-white hover:bg-stone-800 h-10 rounded-xl">
                Join Loyalty
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
