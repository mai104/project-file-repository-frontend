import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - معدل لتجنب إظهار رسائل الخطأ في وضع التطوير
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // في وضع التطوير، نتجاهل أخطاء الشبكة
    if (process.env.NODE_ENV === 'development') {
      console.log('API Error (Development Mode):', error.message);
      return Promise.reject(error);
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('You do not have permission to perform this action.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(error.response.data?.message || 'An error occurred.');
      }
    } else if (error.request) {
      console.error('Network error. Please check your connection.');
    } else {
      console.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;
