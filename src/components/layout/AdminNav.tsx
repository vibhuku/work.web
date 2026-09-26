'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Gift,
  Shirt,
  Sliders,
  BarChart3,
  Bell,
  ArrowLeft,
  Store,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminNavProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actionButton }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    {
      label: 'Add Store Purchase (POS)',
      href: '/admin/purchases',
      icon: Receipt,
      highlight: true,
      badge: 'Core Flow',
    },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Rewards Management', href: '/admin/rewards', icon: Gift },
    { label: 'Store Catalogue', href: '/admin/products', icon: Shirt },
    { label: 'Membership Rules', href: '/admin/membership', icon: Sliders },
    { label: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Broadcasts & Alerts', href: '/admin/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full lg:w-64 bg-[#0D0D0D] text-white shrink-0 border-r border-stone-800 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-white font-serif uppercase">
                WESTSIDE
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#159028] font-bold">
                STAFF & ADMIN PORTAL
              </span>
            </Link>
          </div>

          {/* Quick POS Terminal Banner */}
          <div className="p-3">
            <Link
              href="/admin/purchases"
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#159028] to-emerald-700 text-white shadow-md hover:brightness-110 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-emerald-100" />
                <div>
                  <div className="text-xs font-bold leading-tight">Billing & POS Entry</div>
                  <div className="text-[10px] text-emerald-100/90">Issue points to shopper</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </Link>
          </div>

          {/* Nav List */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#159028]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-semibold bg-[#159028]/30 text-emerald-300 px-1.5 py-0.5 rounded border border-[#159028]/50">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Switch back to Customer Portal */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/customer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              Customer Dashboard
            </span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to Store Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Strip */}
        <header className="bg-white border-b border-stone-200/80 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {title}
              </h1>
              <Badge variant="outline" className="border-stone-300 text-stone-600 text-[10px]">
                Store Manager
              </Badge>
            </div>
            {subtitle && (
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
