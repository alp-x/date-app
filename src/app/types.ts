export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: 'Erkek' | 'Kadın';
  photo: string;
  bio?: string;
  interests: string[];
  lookingFor: string[];
  latitude?: number;
  longitude?: number;
  isAdmin?: boolean;
  isPremium?: boolean;
  lastActive?: Date;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Match {
  id: number;
  user1Id: number;
  user2Id: number;
  timestamp: Date;
  user?: User;
}

export interface PremiumSubscription {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  dailyMatches: number;
  revenue: number;
  newUsers: number;
  activeUsers: number;
  matchRate: number;
  premiumConversionRate: number;
}

export interface SwipeLimit {
  userId: number;
  dailySwipes: number;
  lastReset: Date;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentType: 'premium' | 'boost';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface FilterOptions {
  gender?: 'Erkek' | 'Kadın';
  minAge?: number;
  maxAge?: number;
  lookingFor?: string[];
  distance?: number;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'Erkek' | 'Kadın';
  lookingFor: string[];
  latitude?: number;
  longitude?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 