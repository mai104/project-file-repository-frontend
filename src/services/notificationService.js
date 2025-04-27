import api from './api';
import mockDataService from './mockDataService';

// للتبديل بين الوضع الحقيقي والوهمي
const USE_MOCK = true;

const notificationService = USE_MOCK ? {
  getNotifications: async () => {
    return mockDataService.getNotifications();
  },

  getUnreadCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: 0 };
  },

  markAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { success: true } };
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { success: true } };
  },

  deleteNotification: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { success: true } };
  },

  clearAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { success: true } };
  },
} : {
  getNotifications: async (page = 1, limit = 20) => {
    return await api.get(`/notifications?page=${page}&limit=${limit}`);
  },

  getUnreadCount: async () => {
    return await api.get('/notifications/unread-count');
  },

  markAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async () => {
    return await api.put('/notifications/read-all');
  },

  deleteNotification: async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`);
  },

  clearAll: async () => {
    return await api.delete('/notifications/clear-all');
  },

  // Notification preferences
  getPreferences: async () => {
    return await api.get('/notifications/preferences');
  },

  updatePreferences: async (preferences) => {
    return await api.put('/notifications/preferences', preferences);
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription) => {
    return await api.post('/notifications/subscribe', subscription);
  },

  unsubscribeFromPush: async () => {
    return await api.delete('/notifications/subscribe');
  },

  // Test notification
  sendTestNotification: async () => {
    return await api.post('/notifications/test');
  },
};

export default notificationService;
