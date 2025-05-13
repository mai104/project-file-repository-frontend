import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fileReducer from './fileSlice';
import projectReducer from './projectSlice';
import notificationReducer from './notificationSlice';
import repositoryReducer from './repositorySlice';
import folderReducer from './folderSlice';
import commentReducer from './commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    projects: projectReducer,
    notifications: notificationReducer,
    repositories: repositoryReducer,
    folders: folderReducer,
    comments: commentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
