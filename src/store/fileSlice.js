import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../services/fileService';

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ file, description, folderId }, { rejectWithValue, dispatch }) => {
    try {
      // Track upload progress
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch(setUploadProgress(percentCompleted));
      };

      const fileData = {
        file,
        description,
        folderId
      };

      const response = await fileService.uploadFile(fileData, onUploadProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'File upload failed');
    }
  }
);

// Compatibility function for existing components that use fetchFiles
export const fetchFiles = createAsyncThunk(
  'files/fetchAll',
  async ({ projectId, milestoneId, folderId, limit }, { rejectWithValue }) => {
    try {
      let response;
      
      // If folderId is provided directly, use it
      if (folderId) {
        response = await fileService.getFilesByFolder(folderId);
      }
      // If milestoneId is provided, treat it as a folder ID (milestone is a special folder)
      else if (milestoneId) {
        response = await fileService.getFilesByFolder(milestoneId);
      }
      // If only projectId is provided, get files at the repository root
      else if (projectId) {
        // For now, just return an empty array if we only have a projectId
        // In a complete implementation, you might want to fetch files specifically for this repository
        return [];
      }
      // If no params, get recent files or all files the user has access to
      else {
        // Get current user from local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          response = await fileService.getUserFiles(user.id);
        } else {
          return [];
        }
      }

      // Apply limit if provided
      if (limit && response?.data && Array.isArray(response.data)) {
        return response.data.slice(0, limit);
      }

      return response?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
    }
  }
);

export const fetchFilesByFolder = createAsyncThunk(
  'files/fetchByFolder',
  async (folderId, { rejectWithValue }) => {
    try {
      const response = await fileService.getFilesByFolder(folderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
    }
  }
);

export const fetchFileById = createAsyncThunk(
  'files/fetchById',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await fileService.getFileById(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch file');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId, { rejectWithValue }) => {
    try {
      await fileService.deleteFile(fileId);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/download',
  async (fileId, { rejectWithValue }) => {
    try {
      await fileService.downloadFile(fileId);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download file');
    }
  }
);

export const fetchFileHistory = createAsyncThunk(
  'files/fetchHistory',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await fileService.getFileHistory(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch file history');
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    currentFile: null,
    fileHistory: [],
    isLoading: false,
    error: null,
    uploadProgress: 0,
    downloadInProgress: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files.push(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Fetch files (compatibility function)
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch files by folder
      .addCase(fetchFilesByFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilesByFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchFilesByFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch file by ID
      .addCase(fetchFileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFileById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchFileById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file.id !== action.payload);
        if (state.currentFile && state.currentFile.id === action.payload) {
          state.currentFile = null;
        }
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Download file
      .addCase(downloadFile.pending, (state) => {
        state.downloadInProgress = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.downloadInProgress = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.downloadInProgress = false;
        state.error = action.payload;
      })
      // Fetch file history
      .addCase(fetchFileHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFileHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fileHistory = action.payload;
      })
      .addCase(fetchFileHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setUploadProgress, resetUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;