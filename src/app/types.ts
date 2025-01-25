export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: string;
  photo: string;
  bio?: string;
  interests: string[];
  lookingFor: string[];
  latitude?: number;
  longitude?: number;
  isAdmin?: boolean;
  isPremium: boolean;
  lastActive: Date;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Match {
  id: number;
  userId: number;
  matchedUserId: number;
  createdAt: Date;
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
  remainingSwipes: number;
  resetTime: Date;
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
  gender?: string;
  minAge: number;
  maxAge: number;
  lookingFor: string[];
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

export interface AuthResponse {
  token: string;
  userId: number;
  isAdmin: boolean;
  gender?: string;
  user?: {
    name: string;
    photo?: string;
  };
} 