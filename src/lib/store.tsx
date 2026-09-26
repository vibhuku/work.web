'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Customer, Transaction, Reward, Product, AppNotification, PointsRule, AdminNotificationTemplate } from './types';
import { MOCK_CUSTOMERS, MOCK_TRANSACTIONS, MOCK_REWARDS, MOCK_PRODUCTS, MOCK_NOTIFICATIONS, MOCK_ADMIN_NOTIFICATIONS } from './mock-data';
import { getTierForPoints } from './tiers';

// ============================================================
// State Shape
// ============================================================
export interface AppState {
  customers: Customer[];
  transactions: Transaction[];
  rewards: Reward[];
  products: Product[];
  notifications: AppNotification[];
  adminNotifications: AdminNotificationTemplate[];
  pointsRule: PointsRule;
  currentCustomerId: string | null;
  isLoaded: boolean;
}

const initialState: AppState = {
  customers: [],
  transactions: [],
  rewards: [],
  products: [],
  notifications: [],
  adminNotifications: [],
  pointsRule: { amountPerPoint: 250 },
  currentCustomerId: null,
  isLoaded: false,
};

// ============================================================
// Actions
// ============================================================
type Action =
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ'; payload: string }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'UPDATE_REWARD'; payload: Reward }
  | { type: 'DELETE_REWARD'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CURRENT_CUSTOMER'; payload: string | null }
  | { type: 'UPDATE_POINTS_RULE'; payload: PointsRule }
  | { type: 'ADD_ADMIN_NOTIFICATION'; payload: AdminNotificationTemplate }
  | { type: 'UPDATE_ADMIN_NOTIFICATION'; payload: AdminNotificationTemplate }
  | { type: 'REDEEM_REWARD'; payload: { customerId: string; reward: Reward } }
  | { type: 'ADD_PURCHASE'; payload: { customerId: string; transaction: Transaction; pointsEarned: number } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoaded: true };

    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.customerId === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.payload] };

    case 'UPDATE_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };

    case 'DELETE_REWARD':
      return {
        ...state,
        rewards: state.rewards.filter(r => r.id !== action.payload),
      };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'SET_CURRENT_CUSTOMER':
      return { ...state, currentCustomerId: action.payload };

    case 'UPDATE_POINTS_RULE':
      return { ...state, pointsRule: action.payload };

    case 'ADD_ADMIN_NOTIFICATION':
      return { ...state, adminNotifications: [...state.adminNotifications, action.payload] };

    case 'UPDATE_ADMIN_NOTIFICATION':
      return {
        ...state,
        adminNotifications: state.adminNotifications.map(n =>
          n.id === action.payload.id ? action.payload : n
        ),
      };

    case 'REDEEM_REWARD': {
      const { customerId, reward } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      if (!customer || customer.availablePoints < reward.pointsRequired) return state;

      const updatedCustomer: Customer = {
        ...customer,
        availablePoints: customer.availablePoints - reward.pointsRequired,
        totalPoints: customer.totalPoints - reward.pointsRequired,
      };

      const transaction: Transaction = {
        id: `TXN${Date.now()}`,
        customerId,
        date: new Date().toISOString().split('T')[0],
        store: 'Reward Redemption',
        billNumber: '-',
        purchaseAmount: 0,
        points: -reward.pointsRequired,
        type: 'Redeemed',
        status: 'Completed',
        description: `${reward.name} Redeemed`,
      };

      const notification: AppNotification = {
        id: `NOT${Date.now()}`,
        customerId,
        title: 'Reward Redeemed!',
        message: `🎁 You successfully redeemed ${reward.name}. ${reward.pointsRequired} points were deducted.`,
        type: 'reward_redeemed',
        read: false,
        date: new Date().toISOString(),
        icon: '🎁',
      };

      const updatedReward = { ...reward, totalRedemptions: reward.totalRedemptions + 1 };

      return {
        ...state,
        customers: state.customers.map(c => c.id === customerId ? updatedCustomer : c),
        transactions: [transaction, ...state.transactions],
        notifications: [notification, ...state.notifications],
        rewards: state.rewards.map(r => r.id === reward.id ? updatedReward : r),
      };
    }

    case 'ADD_PURCHASE': {
      const { customerId, transaction, pointsEarned } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      if (!customer) return state;

      const newAvailable = customer.availablePoints + pointsEarned;
      const newLifetime = customer.lifetimePoints + pointsEarned;
      const newTier = getTierForPoints(newLifetime);
      const tierChanged = newTier !== customer.currentTier;

      const updatedCustomer: Customer = {
        ...customer,
        totalPoints: customer.totalPoints + pointsEarned,
        availablePoints: newAvailable,
        lifetimePoints: newLifetime,
        currentTier: newTier,
        lastPurchaseDate: transaction.date,
        totalPurchases: customer.totalPurchases + 1,
        totalPurchaseAmount: customer.totalPurchaseAmount + transaction.purchaseAmount,
      };

      const notifications: AppNotification[] = [
        {
          id: `NOT${Date.now()}`,
          customerId,
          title: 'Points Earned!',
          message: `🎉 You earned ${pointsEarned} points from your latest purchase of ₹${transaction.purchaseAmount.toLocaleString('en-IN')}.`,
          type: 'points_earned',
          read: false,
          date: new Date().toISOString(),
          icon: '🎉',
        },
      ];

      if (tierChanged) {
        notifications.push({
          id: `NOT${Date.now() + 1}`,
          customerId,
          title: 'Tier Upgrade!',
          message: `🏆 Congratulations! You have been upgraded to ${newTier} membership!`,
          type: 'tier_upgrade',
          read: false,
          date: new Date().toISOString(),
          icon: '🏆',
        });
      }

      return {
        ...state,
        customers: state.customers.map(c => c.id === customerId ? updatedCustomer : c),
        transactions: [transaction, ...state.transactions],
        notifications: [...notifications, ...state.notifications],
      };
    }

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
const STORAGE_KEY = 'westside-loyalty-state';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerByMobile: (mobile: string) => Customer | undefined;
  getCustomerTransactions: (customerId: string) => Transaction[];
  getCustomerNotifications: (customerId: string) => AppNotification[];
  calculatePoints: (amount: number) => number;
  generateCustomerId: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } else {
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            customers: MOCK_CUSTOMERS,
            transactions: MOCK_TRANSACTIONS,
            rewards: MOCK_REWARDS,
            products: MOCK_PRODUCTS,
            notifications: MOCK_NOTIFICATIONS,
            adminNotifications: MOCK_ADMIN_NOTIFICATIONS,
            pointsRule: { amountPerPoint: 250 },
            currentCustomerId: null,
          },
        });
      }
    } catch {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          customers: MOCK_CUSTOMERS,
          transactions: MOCK_TRANSACTIONS,
          rewards: MOCK_REWARDS,
          products: MOCK_PRODUCTS,
          notifications: MOCK_NOTIFICATIONS,
          adminNotifications: MOCK_ADMIN_NOTIFICATIONS,
          pointsRule: { amountPerPoint: 250 },
          currentCustomerId: null,
        },
      });
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (state.isLoaded) {
      try {
        const { isLoaded, ...toSave } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch {
        // localStorage might be full or unavailable
      }
    }
  }, [state]);

  const getCustomerById = (id: string) => state.customers.find(c => c.id === id);
  const getCustomerByMobile = (mobile: string) => state.customers.find(c => c.mobile === mobile);
  const getCustomerTransactions = (customerId: string) =>
    state.transactions.filter(t => t.customerId === customerId);
  const getCustomerNotifications = (customerId: string) =>
    state.notifications.filter(n => n.customerId === customerId);
  const calculatePoints = (amount: number) =>
    Math.floor(amount / state.pointsRule.amountPerPoint);
  const generateCustomerId = () => {
    const maxId = state.customers.reduce((max, c) => {
      const num = parseInt(c.id.replace('WS', ''), 10);
      return num > max ? num : max;
    }, 10000);
    return `WS${maxId + 1}`;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getCustomerById,
        getCustomerByMobile,
        getCustomerTransactions,
        getCustomerNotifications,
        calculatePoints,
        generateCustomerId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
