import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import folderService from '../services/folderService';

// Async thunks
export const createFolder = createAsyncThunk(
  'folders/create',
  async (folderData, { rejectWithValue }) => {
    try {
      const response = await folderService.createFolder(folderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create folder');
    }
  }
);

export const fetchFolderById = createAsyncThunk(
  'folders/fetchById',
  async (folderId, { rejectWithValue }) => {
    try {
      const response = await folderService.getFolderById(folderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch folder');
    }
  }
);

export const fetchRepositoryFolders = createAsyncThunk(
  'folders/fetchRepositoryFolders',
  async (repositoryId, { rejectWithValue }) => {
    try {
      const response = await folderService.getRepositoryFolders(repositoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repository folders');
    }
  }
);

export const fetchSubfolders = createAsyncThunk(
  'folders/fetchSubfolders',
  async ({ repositoryId, parentFolderId }, { rejectWithValue }) => {
    try {
      const response = await folderService.getSubfolders(repositoryId, parentFolderId);
      return { 
        parentFolderId,
        subfolders: response.data 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subfolders');
    }
  }
);

export const fetchMilestoneFolders = createAsyncThunk(
  'folders/fetchMilestoneFolders',
  async (repositoryId, { rejectWithValue }) => {
    try {
      const response = await folderService.getMilestoneFolders(repositoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch milestone folders');
    }
  }
);

export const updateFolder = createAsyncThunk(
  'folders/update',
  async ({ folderId, folderData }, { rejectWithValue }) => {
    try {
      const response = await folderService.updateFolder(folderId, folderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update folder');
    }
  }
);

export const deleteFolder = createAsyncThunk(
  'folders/delete',
  async (folderId, { rejectWithValue }) => {
    try {
      await folderService.deleteFolder(folderId);
      return folderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete folder');
    }
  }
);

const folderSlice = createSlice({
  name: 'folders',
  initialState: {
    folders: [],
    currentFolder: null,
    milestoneFolders: [],
    subfoldersByParent: {}, // Structure: { parentId: [subfolders] }
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    clearFolders: (state) => {
      state.folders = [];
      state.subfoldersByParent = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create folder
      .addCase(createFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If it's a root folder, add to folders list
        if (!action.payload.parentFolderId) {
          state.folders.push(action.payload);
        } 
        // If it's a subfolder, add to the appropriate parent folder in subfoldersByParent
        else {
          const parentId = action.payload.parentFolderId;
          if (!state.subfoldersByParent[parentId]) {
            state.subfoldersByParent[parentId] = [];
          }
          state.subfoldersByParent[parentId].push(action.payload);
        }
        
        // If it's a milestone, add to milestoneFolders
        if (action.payload.isMilestone) {
          state.milestoneFolders.push(action.payload);
        }
        
        state.currentFolder = action.payload;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch folder by ID
      .addCase(fetchFolderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFolder = action.payload;
      })
      .addCase(fetchFolderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch repository folders
      .addCase(fetchRepositoryFolders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepositoryFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
      })
      .addCase(fetchRepositoryFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch subfolders
      .addCase(fetchSubfolders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubfolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subfoldersByParent = {
          ...state.subfoldersByParent,
          [action.payload.parentFolderId]: action.payload.subfolders
        };
      })
      .addCase(fetchSubfolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch milestone folders
      .addCase(fetchMilestoneFolders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMilestoneFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestoneFolders = action.payload;
      })
      .addCase(fetchMilestoneFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update folder
      .addCase(updateFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in folders list
        state.folders = state.folders.map(folder => 
          folder.id === action.payload.id ? action.payload : folder
        );
        
        // Update in subfolders list
        for (const parentId in state.subfoldersByParent) {
          state.subfoldersByParent[parentId] = state.subfoldersByParent[parentId].map(folder => 
            folder.id === action.payload.id ? action.payload : folder
          );
        }
        
        // Update in milestone folders
        if (action.payload.isMilestone) {
          state.milestoneFolders = state.milestoneFolders.map(folder => 
            folder.id === action.payload.id ? action.payload : folder
          );
        }
        
        // Update current folder if it's the same
        if (state.currentFolder && state.currentFolder.id === action.payload.id) {
          state.currentFolder = action.payload;
        }
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete folder
      .addCase(deleteFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        const folderId = action.payload;
        
        // Remove from folders list
        state.folders = state.folders.filter(folder => folder.id !== folderId);
        
        // Remove from subfolders list
        for (const parentId in state.subfoldersByParent) {
          state.subfoldersByParent[parentId] = state.subfoldersByParent[parentId].filter(
            folder => folder.id !== folderId
          );
        }
        
        // Remove from milestone folders
        state.milestoneFolders = state.milestoneFolders.filter(folder => folder.id !== folderId);
        
        // Clear current folder if it's the same
        if (state.currentFolder && state.currentFolder.id === folderId) {
          state.currentFolder = null;
        }
        
        // Remove its subfolders entry
        if (state.subfoldersByParent[folderId]) {
          delete state.subfoldersByParent[folderId];
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentFolder, clearFolders } = folderSlice.actions;
export default folderSlice.reducer;