import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../services/fileService';

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ file, description, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await fileService.uploadFile(file, description, milestoneId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'File upload failed');
    }
  }
);

export const fetchFiles = createAsyncThunk(
  'files/fetchAll',
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await fileService.getFiles(projectId, milestoneId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
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

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    currentFile: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
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
      // Fetch files
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
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setUploadProgress, resetUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
