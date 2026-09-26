'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Reward } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
  Search,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRewardsPage() {
  const { state, dispatch } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPoints, setFormPoints] = useState<number | ''>(100);
  const [formValue, setFormValue] = useState('₹100');
  const [formCategory, setFormCategory] = useState<'Shopping' | 'Discount' | 'Experience' | 'Special'>('Shopping');
  const [formIcon, setFormIcon] = useState('🛍️');
  const [formLimit, setFormLimit] = useState<number | ''>(500);

  const filteredRewards = state.rewards.filter(reward => {
    if (selectedCategory !== 'All' && reward.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = reward.name.toLowerCase().includes(q);
      const matchDesc = reward.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingReward(null);
    setFormName('');
    setFormDesc('');
    setFormPoints(100);
    setFormValue('₹100');
    setFormCategory('Shopping');
    setFormIcon('🛍️');
    setFormLimit(500);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reward: Reward) => {
    setEditingReward(reward);
    setFormName(reward.name);
    setFormDesc(reward.description);
    setFormPoints(reward.pointsRequired);
    setFormValue(reward.rewardValue);
    setFormCategory(reward.category);
    setFormIcon(reward.icon);
    setFormLimit(reward.redemptionLimit);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (reward: Reward) => {
    const updated: Reward = {
      ...reward,
      status: reward.status === 'Active' ? 'Inactive' : 'Active',
    };
    dispatch({ type: 'UPDATE_REWARD', payload: updated });
    toast.success(`Reward "${reward.name}" marked as ${updated.status}.`);
  };

  const handleDeleteReward = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove reward "${name}"?`)) {
      dispatch({ type: 'DELETE_REWARD', payload: id });
      toast.success(`Reward "${name}" removed.`);
    }
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim() || typeof formPoints !== 'number' || formPoints <= 0) {
      toast.error('Please fill in all required fields with valid points.');
      return;
    }

    if (editingReward) {
      const updated: Reward = {
        ...editingReward,
        name: formName.trim(),
        description: formDesc.trim(),
        pointsRequired: formPoints,
        rewardValue: formValue.trim(),
        category: formCategory,
        icon: formIcon,
        redemptionLimit: typeof formLimit === 'number' ? formLimit : 1000,
      };
      dispatch({ type: 'UPDATE_REWARD', payload: updated });
      toast.success(`Reward "${updated.name}" updated successfully.`);
    } else {
      const newReward: Reward = {
        id: `RWD${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        pointsRequired: formPoints,
        rewardValue: formValue.trim(),
        category: formCategory,
        icon: formIcon,
        startDate: '2026-01-01',
        expiryDate: '2027-12-31',
        status: 'Active',
        redemptionLimit: typeof formLimit === 'number' ? formLimit : 1000,
        totalRedemptions: 0,
      };
      dispatch({ type: 'ADD_REWARD', payload: newReward });
      toast.success(`New reward "${newReward.name}" created!`);
    }

    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="Rewards & Voucher Management"
      subtitle="Configure store reward thresholds, configure discount amounts, and adjust redemption limits."
      actionButton={
        <Button
          onClick={handleOpenCreateModal}
          size="sm"
          className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Reward
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search rewards..."
                className="pl-9 h-11 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Shopping', 'Discount', 'Experience', 'Special'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0D0D0D] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Reward Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Points Required</th>
                  <th className="py-3 px-4 text-center">Reward Value</th>
                  <th className="py-3 px-4 text-center">Redemptions</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredRewards.map(reward => (
                  <tr key={reward.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{reward.icon}</span>
                        <div>
                          <div className="font-bold text-stone-900">{reward.name}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                            {reward.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="outline" className="text-[10px]">
                        {reward.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#159028] whitespace-nowrap">
                      {reward.pointsRequired.toLocaleString('en-IN')} pts
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-stone-800 whitespace-nowrap">
                      {reward.rewardValue}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-semibold text-stone-800">
                        {reward.totalRedemptions}
                      </span>
                      <span className="text-stone-400 text-[10px]"> / {reward.redemptionLimit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(reward)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge
                          variant={reward.status === 'Active' ? 'green' : 'secondary'}
                          className="text-[10px]"
                        >
                          {reward.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(reward)}
                          className="h-7 w-7 p-0 text-stone-600 hover:text-stone-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReward(reward.id, reward.name)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Create / Edit Reward */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900">
                  {editingReward ? 'Edit Reward' : 'Create New Store Reward'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReward} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Reward Name</label>
                  <Input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. ₹200 Shopping Reward"
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <Input
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="e.g. Valid on purchase of ₹2,000 or more in store."
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Points Required</label>
                    <Input
                      type="number"
                      min="1"
                      value={formPoints}
                      onChange={e =>
                        setFormPoints(e.target.value ? Number(e.target.value) : '')
                      }
                      className="h-10 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Reward Value</label>
                    <Input
                      value={formValue}
                      onChange={e => setFormValue(e.target.value)}
                      placeholder="e.g. ₹200 or 15% Off"
                      className="h-10 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as any)}
                      className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2 text-xs"
                    >
                      <option value="Shopping">Shopping</option>
                      <option value="Discount">Discount</option>
                      <option value="Experience">Experience</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Icon</label>
                    <Input
                      value={formIcon}
                      onChange={e => setFormIcon(e.target.value)}
                      placeholder="🎁"
                      className="h-10 text-xs text-center text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Redemption Cap</label>
                    <Input
                      type="number"
                      value={formLimit}
                      onChange={e =>
                        setFormLimit(e.target.value ? Number(e.target.value) : '')
                      }
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#159028] hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    {editingReward ? 'Save Changes' : 'Create Reward'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
