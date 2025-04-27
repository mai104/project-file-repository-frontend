import api from './api';
import mockAuthService from './mockAuthService';

// للتبديل بين الوضع الحقيقي والوهمي
const USE_MOCK = true;

const authService = USE_MOCK ? mockAuthService : {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  changePassword: async (passwordData) => {
    return await api.post('/auth/change-password', passwordData);
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, newPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword });
  },

  verifyEmail: async (token) => {
    return await api.get(`/auth/verify-email/${token}`);
  },

  resendVerificationEmail: async () => {
    return await api.post('/auth/resend-verification');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserRole: () => {
    const user = authService.getUser();
    return user ? user.role : null;
  },

  isStudent: () => {
    return authService.getUserRole() === 'STUDENT';
  },

  isSupervisor: () => {
    return authService.getUserRole() === 'SUPERVISOR';
  },
};

export default authService;
