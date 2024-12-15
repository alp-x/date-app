const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  avatarService: 'https://api.dicebear.com/7.x',
  theme: {
    colors: {
      primary: {
        light: '#FF79C6',
        DEFAULT: '#BD93F9',
        dark: '#6272A4'
      },
      secondary: {
        light: '#8BE9FD',
        DEFAULT: '#50FA7B',
        dark: '#FFB86C'
      },
      background: {
        light: '#282A36',
        DEFAULT: '#1A1B26',
        dark: '#0D0D15'
      }
    }
  },
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      verify: '/api/auth/verify'
    },
    users: {
      potentialMatches: '/api/users/potential-matches',
      profile: '/api/users/profile',
      photos: '/api/users/profile/photos',
      setProfilePhoto: '/api/users/profile/set-profile-photo'
    },
    matches: {
      create: '/api/matches/like',
      pass: '/api/matches/pass',
      list: '/api/matches'
    },
    messages: {
      list: '/api/messages',
      send: '/api/messages/send'
    }
  },
  defaultHeaders: () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  })
};

export default config; 