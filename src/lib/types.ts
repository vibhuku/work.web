// ============================================================
// Westside Loyalty — Core TypeScript Types
// ============================================================

export type MembershipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface TierConfig {
  name: MembershipTier;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  benefits: string[];
  rewardMultiplier: number;
}

export interface Customer {
  id: string;
  fullName: string;
  mobile: string;
  registrationDate: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  currentTier: MembershipTier;
  status: 'Active' | 'Inactive';
  lastPurchaseDate?: string;
  totalPurchases: number;
  totalPurchaseAmount: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string;
  store: string;
  billNumber: string;
  purchaseAmount: number;
  points: number;
  type: 'Earned' | 'Redeemed' | 'Expired' | 'Adjusted';
  status: 'Completed' | 'Pending' | 'Cancelled';
  description: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  rewardValue: string;
  category: 'Shopping' | 'Discount' | 'Experience' | 'Special';
  icon: string;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Expired';
  redemptionLimit: number;
  totalRedemptions: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids' | 'Footwear' | 'Accessories';
  price: number;
  tag: string;
  description: string;
  image: string;
  inStore: boolean;
  colors: string[];
  sizes: string[];
}

export interface AppNotification {
  id: string;
  customerId: string;
  title: string;
  message: string;
  type: 'points_earned' | 'tier_upgrade' | 'reward_available' | 'points_expiring' | 'reward_redeemed' | 'welcome';
  read: boolean;
  date: string;
  icon: string;
}

export interface PointsRule {
  amountPerPoint: number;
}

export interface AdminNotificationTemplate {
  id: string;
  title: string;
  message: string;
  targetTier: MembershipTier | 'All';
  targetCustomerId?: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  date: string;
  type: 'Promotional' | 'System' | 'Reward' | 'Tier';
}

export interface MonthlyMetric {
  month: string;
  newMembers: number;
  pointsEarned: number;
  pointsRedeemed: number;
  purchases: number;
  revenue: number;
}
