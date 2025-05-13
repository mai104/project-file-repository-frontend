import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @param {string} userData.name - User name
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @param {string} userData.role - Role (STUDENT/SUPERVISOR)
   * @param {string} userData.studentId - Student ID (for students only, optional)
   */
  register: async (userData) => {
    const response = await api.post('/api/v1/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Password
   */
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      return Promise.reject('No authenticated user');
    }
    
    return { data: JSON.parse(user) };
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Check if user has a specific role
   * @param {string} role - Required role
   */
  hasRole: (role) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === role;
  }
};

export default authService;