'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminNotificationTemplate, MembershipTier } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Bell,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const { state, dispatch } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetTier, setTargetTier] = useState<MembershipTier | 'All'>('All');
  const [notifType, setNotifType] = useState<'Promotional' | 'System' | 'Reward' | 'Tier'>('Promotional');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter a notification title and message');
      return;
    }

    // 1. Add to Admin templates log
    const adminTemplate: AdminNotificationTemplate = {
      id: `ADMN${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      targetTier,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
      type: notifType,
    };
    dispatch({ type: 'ADD_ADMIN_NOTIFICATION', payload: adminTemplate });

    // 2. Deliver to targeted customers in state
    const targetedCustomers = state.customers.filter(
      c => targetTier === 'All' || c.currentTier === targetTier
    );

    targetedCustomers.forEach(cust => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `NOT${Date.now()}_${cust.id}`,
          customerId: cust.id,
          title: title.trim(),
          message: message.trim(),
          type: notifType === 'Reward' ? 'reward_available' : notifType === 'Tier' ? 'tier_upgrade' : 'points_earned',
          read: false,
          date: new Date().toISOString(),
          icon: notifType === 'Reward' ? '🎁' : notifType === 'Tier' ? '🏆' : '📣',
        },
      });
    });

    toast.success(`Broadcast successfully sent to ${targetedCustomers.length} ${targetTier} members!`);
    setTitle('');
    setMessage('');
  };

  return (
    <AdminLayout
      title="Member Broadcasts & Push Alerts"
      subtitle="Publish in-store notifications, sales alerts, and points reminders to shoppers' loyalty feeds."
      actionButton={
        <Badge variant="outline" className="text-xs">
          Active Audience: {state.customers.length} Members
        </Badge>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        {/* Left Column: Create New Broadcast */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-stone-200 shadow-sm bg-white">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base font-bold">Compose Member Broadcast</CardTitle>
              <CardDescription className="text-xs">
                Dispatches immediately to customer loyalty dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Notification Title
                  </label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. 🎉 Double Points Weekend in All Stores!"
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Broadcast Message
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    placeholder="e.g. Visit any Westside store this Saturday and earn 2 loyalty points for every ₹250 spent on apparel!"
                    className="w-full rounded-lg border border-stone-200 bg-white p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159028]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Target Tier</label>
                    <select
                      value={targetTier}
                      onChange={e => setTargetTier(e.target.value as any)}
                      className="w-full h-10 rounded-lg border border-stone-200 bg-white px-2.5 text-xs font-semibold"
                    >
                      <option value="All">All Members (25k+)</option>
                      <option value="Bronze">Bronze Tier Only</option>
                      <option value="Silver">Silver Tier Only</option>
                      <option value="Gold">Gold Tier Only</option>
                      <option value="Platinum">Platinum VIP Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category</label>
                    <select
                      value={notifType}
                      onChange={e => setNotifType(e.target.value as any)}
                      className="w-full h-10 rounded-lg border border-stone-200 bg-white px-2.5 text-xs"
                    >
                      <option value="Promotional">Promotional</option>
                      <option value="Reward">Reward Announcement</option>
                      <option value="Tier">Tier Privilege</option>
                      <option value="System">System Reminder</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#159028] hover:bg-emerald-700 text-white font-bold text-xs h-11 rounded-xl shadow-md gap-2"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Broadcast to {targetTier} Members
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Broadcast History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Broadcasts & Campaigns History</h3>
            <span className="text-xs text-stone-500 font-mono">
              {state.adminNotifications.length} Campaigns
            </span>
          </div>

          <div className="space-y-3">
            {state.adminNotifications.map(item => (
              <Card key={item.id} className="border-stone-200 shadow-sm bg-white">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-xs">{item.title}</span>
                      <Badge variant="outline" className="text-[9px]">
                        {item.type}
                      </Badge>
                    </div>
                    <Badge variant={item.status === 'Sent' ? 'green' : 'secondary'} className="text-[9px]">
                      {item.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{item.message}</p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>
                      Target:{' '}
                      <strong className="text-stone-700">
                        {item.targetTier === 'All' ? 'All Customers' : `${item.targetTier} Tier`}
                      </strong>
                    </span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
