'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Bell, Sparkles, User, ShoppingBag, ShieldCheck, Menu, X, ChevronDown, Check } from 'lucide-react';
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
    { label: 'Store Catalogue', href: '/catalog' },
    { label: 'Loyalty Dashboard', href: '/customer' },
    { label: 'Rewards', href: '/customer/rewards' },
    { label: 'Tiers & Perks', href: '/customer/membership' },
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
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-[#0D0D0D] text-white px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#159028] animate-pulse"></span>
        <span>Physical Store Loyalty System — Earn 1 point per ₹{state.pointsRule.amountPerPoint} spent in-store</span>
        <span className="hidden md:inline text-stone-400">|</span>
        <Link href="/admin/purchases" className="hidden md:inline underline text-emerald-400 hover:text-emerald-300">
          Store Staff Billing Terminal →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col group">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-[#0D0D0D] font-serif uppercase group-hover:text-[#159028] transition-colors">
                WESTSIDE
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#159028] font-bold -mt-1">
                L O Y A L T Y
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#159028] bg-emerald-50/80 font-semibold'
                        : 'text-stone-600 hover:text-[#0D0D0D] hover:bg-stone-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Customer Switcher (Demo Feature) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSwitcherOpen(!switcherOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                title="Switch active demo customer"
              >
                <div className="w-5 h-5 rounded-full bg-[#159028]/10 text-[#159028] flex items-center justify-center font-bold text-[10px]">
                  {activeCustomer?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-semibold text-stone-900 truncate max-w-[90px]">
                    {activeCustomer?.fullName || 'Select'}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {activeCustomer?.currentTier || 'Bronze'} · {activeCustomer?.availablePoints || 0} pts
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Switcher Dropdown */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">Simulate Customer</span>
                    <Link
                      href="/join"
                      onClick={() => setSwitcherOpen(false)}
                      className="text-[11px] text-[#159028] font-medium hover:underline"
                    >
                      + New
                    </Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                    {state.customers.slice(0, 8).map(customer => {
                      const isSelected = activeCustomer?.id === customer.id;
                      return (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                            isSelected ? 'bg-emerald-50 text-[#159028] font-semibold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-stone-900">{customer.fullName}</div>
                            <div className="text-[10px] text-stone-400">{customer.currentTier} · {customer.availablePoints} pts</div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#159028]" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <Link
                      href="/customer/profile"
                      onClick={() => setSwitcherOpen(false)}
                      className="block text-center text-xs text-stone-600 hover:text-stone-900 py-1 font-medium"
                    >
                      View Customer Profile →
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
                className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#159028] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-stone-900">Loyalty Updates</span>
                      {unreadNotifications.length > 0 && (
                        <span className="text-[11px] bg-emerald-100 text-[#159028] font-medium px-2 py-0.5 rounded-full">
                          {unreadNotifications.length} new
                        </span>
                      )}
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        Mark all read
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
                            className={`py-2.5 px-2 rounded-lg text-left transition-colors ${
                              !notif.read ? 'bg-emerald-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-base">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-900">{notif.title}</p>
                                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-stone-400 mt-1">
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

            {/* Quick Links */}
            <Link href="/join" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="text-xs font-medium border-stone-300">
                Join Loyalty
              </Button>
            </Link>

            <Link href="/admin/purchases" className="hidden md:inline-flex">
              <Button size="sm" className="text-xs bg-[#0D0D0D] hover:bg-stone-800 text-white gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Staff / Admin POS
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200/80 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'text-[#159028] bg-emerald-50 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center text-xs">
                  Create Loyalty Profile (No Password)
                </Button>
              </Link>
              <Link href="/admin/purchases" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center text-xs bg-[#0D0D0D] text-white">
                  Store Staff Billing & Purchase POS →
                </Button>
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-center text-xs text-stone-600">
                  Admin Management Center
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
