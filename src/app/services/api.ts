import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth servisleri
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Kullanıcı servisleri
export const users = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  getMatches: async () => {
    const response = await api.get('/users/matches');
    return response.data;
  }
};

// Eşleşme servisleri
export const matching = {
  getUsers: async (filters: any) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },
  like: async (userId: number) => {
    const response = await api.post('/matches', { targetUserId: userId, action: 'like' });
    return response.data;
  },
  dislike: async (userId: number) => {
    const response = await api.post('/matches', { targetUserId: userId, action: 'dislike' });
    return response.data;
  }
};

// Mesajlaşma servisleri
export const messaging = {
  getMessages: async (userId: number) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },
  sendMessage: async (userId: number, content: string) => {
    const response = await api.post('/messages', { receiverId: userId, content });
    return response.data;
  }
};

// Premium servisleri
export const premium = {
  subscribe: async (months: number) => {
    const response = await api.post('/premium', { months });
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/premium/status');
    return response.data;
  }
};

// Admin servisleri
export const admin = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  banUser: async (userId: number) => {
    const response = await api.post(`/admin/users/${userId}/ban`);
    return response.data;
  },
  unbanUser: async (userId: number) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  }
}; 