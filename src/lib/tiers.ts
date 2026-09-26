import { TierConfig, MembershipTier } from './types';

// ============================================================
// Tier Configuration
// ============================================================
export const TIER_CONFIG: TierConfig[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 999,
    icon: '🥉',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-amber-800',
    benefits: [
      'Welcome rewards on joining',
      'Basic promotional offers',
      'Birthday greeting',
      'Store newsletter access',
    ],
    rewardMultiplier: 1,
  },
  {
    name: 'Silver',
    minPoints: 1000,
    maxPoints: 4999,
    icon: '🥈',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-slate-600',
    benefits: [
      'Exclusive seasonal discounts',
      'Birthday special offers',
      'Early access to sales',
      'Free gift wrapping',
      'Priority customer support',
    ],
    rewardMultiplier: 1.25,
  },
  {
    name: 'Gold',
    minPoints: 5000,
    maxPoints: 14999,
    icon: '🥇',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-yellow-700',
    benefits: [
      'Higher discount percentages',
      'Invitations to special events',
      'Priority customer support',
      'Free alterations',
      'Exclusive Gold member offers',
      'Seasonal gift hampers',
    ],
    rewardMultiplier: 1.5,
  },
  {
    name: 'Platinum',
    minPoints: 15000,
    maxPoints: Infinity,
    icon: '💎',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-800',
    benefits: [
      'Premium personalized experiences',
      'Personalized style recommendations',
      'VIP access to launches & events',
      'Complimentary personal shopper',
      'Exclusive Platinum-only collections',
      'Free home delivery',
      'Annual loyalty bonus points',
      'Luxury gift on membership anniversary',
    ],
    rewardMultiplier: 2,
  },
];

export function getTierForPoints(points: number): MembershipTier {
  if (points >= 15000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
}

export function getTierConfig(tier: MembershipTier): TierConfig {
  return TIER_CONFIG.find(t => t.name === tier) || TIER_CONFIG[0];
}

export function getNextTier(tier: MembershipTier): TierConfig | null {
  const idx = TIER_CONFIG.findIndex(t => t.name === tier);
  return idx < TIER_CONFIG.length - 1 ? TIER_CONFIG[idx + 1] : null;
}

export function getPointsToNextTier(currentPoints: number, currentTier: MembershipTier): number {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0;
  return nextTier.minPoints - currentPoints;
}
