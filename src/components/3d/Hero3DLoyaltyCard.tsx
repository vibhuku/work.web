'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Shield } from 'lucide-react';

interface Hero3DLoyaltyCardProps {
  customer?: Customer;
}

export function Hero3DLoyaltyCard({ customer }: Hero3DLoyaltyCardProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [webglSupported, setWebglSupported] = useState(true);

  const activeName = customer?.fullName || 'Rahul Kumar';
  const activePoints = customer?.availablePoints ?? 3580;
  const activeTier = customer?.currentTier || 'Silver';
  const activeId = customer?.id || 'WS10001';

  // Three.js scene setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let cardGroup: THREE.Group;
    let coinMesh: THREE.Mesh;
    let animationFrameId: number;
    let isDisposed = false;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      // Card Geometry & Materials
      cardGroup = new THREE.Group();

      // Rounded-looking Card base
      const cardGeo = new THREE.BoxGeometry(3.2, 2.0, 0.08);
      
      // Westside luxury materials: deep obsidian with metallic emerald bevel
      const cardMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f1811,
        metalness: 0.85,
        roughness: 0.22,
        reflectivity: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      });

      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardGroup.add(cardMesh);

      // Metallic Gold / Green Trim border
      const borderGeo = new THREE.BoxGeometry(3.25, 2.05, 0.04);
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0x159028,
        metalness: 0.9,
        roughness: 0.3,
        emissive: 0x0a4012,
        emissiveIntensity: 0.35,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.z = -0.02;
      cardGroup.add(borderMesh);

      // Embedded Gold Loyalty Token / Coin
      const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.2,
        emissive: 0x5a450e,
        emissiveIntensity: 0.2,
      });
      coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.rotation.x = Math.PI / 2;
      coinMesh.position.set(1.05, 0.45, 0.06);
      cardGroup.add(coinMesh);

      // Floating particles around the card
      const particleGeo = new THREE.BufferGeometry();
      const particleCount = 45;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 6;
        posArray[i + 1] = (Math.random() - 0.5) * 5;
        posArray[i + 2] = (Math.random() - 0.5) * 3;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0x34d399,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      scene.add(cardGroup);

      // Lighting: Key, fill, and rim light for luxury sheen
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xdcfce7, 2.5);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      const emeraldRimLight = new THREE.PointLight(0x159028, 4, 10);
      emeraldRimLight.position.set(-3, -2, 2);
      scene.add(emeraldRimLight);

      const goldRimLight = new THREE.PointLight(0xfbbf24, 3, 10);
      goldRimLight.position.set(3, -2, 2);
      scene.add(goldRimLight);

      // Interaction tracking
      let targetRotX = 0;
      let targetRotY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = x * 0.45;
        targetRotX = -y * 0.35;
        setMousePos({ x, y });
      };

      const handleMouseLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        setMousePos({ x: 0, y: 0 });
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      // Resize handler
      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      // Clock for smooth idle float
      let clock = new THREE.Clock();

      // Render Loop
      const animate = () => {
        if (isDisposed) return;
        const elapsedTime = clock.getElapsedTime();

        // Idle floating sine wave
        const idleY = Math.sin(elapsedTime * 1.5) * 0.12;
        const idleRotZ = Math.sin(elapsedTime * 0.8) * 0.04;

        // Smooth damping toward mouse target
        cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.08;
        cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.08;
        cardGroup.position.y = idleY;
        cardGroup.rotation.z = idleRotZ;

        // Spin embedded gold coin subtly
        if (coinMesh) {
          coinMesh.rotation.z = elapsedTime * 0.8;
        }

        // Rotate particles slowly
        particles.rotation.y = elapsedTime * 0.06;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Layer */}
      {webglSupported ? (
        <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />
      ) : null}

      {/* Synchronized 2D/3D Overlay Card with Holographic Typography */}
      <div
        className="relative z-20 w-[310px] sm:w-[360px] h-[195px] sm:h-[225px] rounded-2xl p-5 sm:p-6 text-white shadow-2xl pointer-events-none transition-transform duration-200 ease-out border border-emerald-500/30 flex flex-col justify-between overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(24px)`,
          background: 'linear-gradient(135deg, rgba(13,13,13,0.92) 0%, rgba(14,40,20,0.88) 50%, rgba(13,13,13,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(21, 144, 40, 0.25), 0 0 35px rgba(21, 144, 40, 0.15)',
        }}
      >
        {/* Specular glare sheen */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
          }}
        />

        {/* Top Strip */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#159028] font-bold">
              WESTSIDE CLUB
            </span>
            <span className="text-xs font-mono text-stone-400 mt-0.5">{activeId}</span>
          </div>
          <Badge
            variant={activeTier.toLowerCase() as any}
            className="text-[10px] px-2.5 py-0.5 border shadow-sm font-semibold tracking-wider uppercase"
          >
            {activeTier} Member
          </Badge>
        </div>

        {/* Center: Live Loyalty Points */}
        <div className="my-auto py-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Loyalty Balance</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif mt-0.5 flex items-baseline gap-1">
            <span>+{activePoints.toLocaleString('en-IN')}</span>
            <span className="text-xs font-sans text-stone-300 uppercase tracking-wider">Points</span>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="flex items-end justify-between border-t border-emerald-900/40 pt-2.5 text-xs">
          <div>
            <div className="text-[9px] text-stone-400 uppercase tracking-wider">Member Name</div>
            <div className="font-bold text-stone-100 text-sm">{activeName}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-stone-400 uppercase tracking-wider">Accrual Rate</div>
            <div className="font-mono text-emerald-400 font-semibold text-[11px]">₹250 = 1 Pt</div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Micro-Pills */}
      <div
        className="absolute -top-3 right-6 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-stone-200 text-[11px] font-semibold text-stone-800 flex items-center gap-1.5 animate-bounce hidden sm:flex"
        style={{ animationDuration: '3s' }}
      >
        <span className="w-2 h-2 rounded-full bg-[#159028] animate-ping" />
        <span>Interactive 3D • Tilt & Drag</span>
      </div>

      <div className="absolute -bottom-2 left-6 z-30 bg-[#0D0D0D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xl border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2 hidden sm:flex">
        <Crown className="w-3.5 h-3.5 text-yellow-400" />
        <span>1,420 Pts to Gold Status</span>
      </div>
    </div>
  );
}
