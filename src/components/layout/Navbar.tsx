'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Bell, Sparkles, User, ShoppingBag, ShieldCheck, Menu, X, ChevronDown, Check, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Active customer default to Rahul Kumar (WS10001) if not selected
  const activeCustomer =
    state.customers.find(c => c.id === state.currentCustomerId) ||
    state.customers[0];

  const unreadNotifications = activeCustomer
    ? state.notifications.filter(n => n.customerId === activeCustomer.id && !n.read)
    : [];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/catalog' },
    { label: 'Rewards', href: '/customer/rewards' },
    { label: 'Membership', href: '/customer/membership' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  const handleSelectCustomer = (customerId: string) => {
    dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: customerId });
    setSwitcherOpen(false);
  };

  const handleMarkAllRead = () => {
    if (activeCustomer) {
      dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: activeCustomer.id });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-[#F8F7F4]/90 backdrop-blur-md transition-all">
      {/* Top Editorial Notice Strip */}
      <div className="bg-[#0D0D0D] text-white px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#159028]"></span>
        <span>Physical Store Loyalty Platform — Earn 1 point per ₹{state.pointsRule.amountPerPoint} spent in any Westside store</span>
        <span className="hidden md:inline text-stone-500">|</span>
        <Link href="/admin/purchases" className="hidden md:inline text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">
          Store Staff POS Terminal →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col group shrink-0">
              <span className="text-xl sm:text-2xl font-black tracking-[0.2em] text-[#0D0D0D] font-serif uppercase group-hover:text-[#159028] transition-colors">
                WESTSIDE
              </span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#159028] font-bold -mt-1">
                L O Y A L T Y
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'text-[#159028] bg-white shadow-xs font-bold'
                        : 'text-stone-600 hover:text-[#0D0D0D] hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Points Indicator Pill */}
            <Link
              href="/customer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 text-xs font-bold text-stone-900 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#159028] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-3 h-3 text-[#159028]" />
              </span>
              <span className="font-mono text-[#159028] font-extrabold tracking-tight">
                {activeCustomer ? activeCustomer.availablePoints.toLocaleString('en-IN') : '0'}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Pts</span>
            </Link>

            {/* Customer Switcher / Profile Preview */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSwitcherOpen(!switcherOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200/90 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-all shadow-xs"
                title="Active Profile"
              >
                <div className="w-6 h-6 rounded-full bg-[#0D0D0D] text-white flex items-center justify-center font-bold text-[10px]">
                  {activeCustomer?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-bold text-stone-900 truncate max-w-[95px]">
                    {activeCustomer?.fullName || 'Select'}
                  </span>
                  <span className="text-[10px] text-[#159028] font-semibold">
                    {activeCustomer?.currentTier || 'Bronze'} Member
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Profile Dropdown */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">Active Profile</span>
                      <p className="text-[10px] text-stone-400">Switch profile for store demo</p>
                    </div>
                    <Link
                      href="/join"
                      onClick={() => setSwitcherOpen(false)}
                      className="text-[11px] text-[#159028] font-bold hover:underline"
                    >
                      + New Join
                    </Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                    {state.customers.slice(0, 6).map(customer => {
                      const isSelected = activeCustomer?.id === customer.id;
                      return (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                            isSelected ? 'bg-emerald-50 text-[#159028] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-stone-900">{customer.fullName}</div>
                            <div className="text-[10px] text-stone-400">
                              +91 {customer.mobile} · {customer.currentTier} ({customer.availablePoints} pts)
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#159028]" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2">
                    <Link
                      href="/customer/profile"
                      onClick={() => setSwitcherOpen(false)}
                      className="block text-center text-xs text-stone-700 hover:text-stone-900 py-1.5 rounded-lg bg-stone-50 font-semibold"
                    >
                      Full Profile
                    </Link>
                    <Link
                      href="/customer"
                      onClick={() => setSwitcherOpen(false)}
                      className="block text-center text-xs text-white py-1.5 rounded-lg bg-[#159028] font-semibold hover:bg-emerald-700"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setSwitcherOpen(false);
                }}
                className="relative p-2 rounded-xl bg-white border border-stone-200/90 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#159028] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">Store Activity Alerts</span>
                      {unreadNotifications.length > 0 && (
                        <span className="text-[10px] bg-emerald-100 text-[#159028] font-bold px-2 py-0.5 rounded-full">
                          {unreadNotifications.length} new
                        </span>
                      )}
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-stone-500 hover:text-stone-900 font-semibold"
                      >
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 mt-2">
                    {activeCustomer ? (
                      state.notifications
                        .filter(n => n.customerId === activeCustomer.id)
                        .slice(0, 5)
                        .map(notif => (
                          <div
                            key={notif.id}
                            className={`py-3 px-2 rounded-xl text-left transition-colors ${
                              !notif.read ? 'bg-emerald-50/60' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-base">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-stone-900">{notif.title}</p>
                                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-stone-400 mt-1 font-mono">
                                  {new Date(notif.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-stone-500 text-center py-4">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Staff POS Shortcut */}
            <Link href="/admin/purchases" className="hidden sm:inline-flex">
              <Button size="sm" className="text-xs bg-[#0D0D0D] hover:bg-stone-800 text-white font-bold h-9 px-3.5 rounded-xl shadow-xs gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                Staff POS
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 py-4 space-y-2 bg-[#F8F7F4] animate-in slide-in-from-top-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xl ${
                    isActive ? 'text-[#159028] bg-white' : 'text-stone-700 hover:bg-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2 px-4">
              <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#159028] text-white text-xs font-bold rounded-xl h-10">
                  Join Loyalty Free
                </Button>
              </Link>
              <Link href="/admin/purchases" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs font-bold rounded-xl h-10 border-stone-300">
                  Store Staff Billing POS Terminal →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
