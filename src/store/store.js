import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fileReducer from './fileSlice';
import projectReducer from './projectSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    projects: projectReducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
