import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import repositoryService from '../services/repositoryService';

// Async thunks
export const createRepository = createAsyncThunk(
  'repositories/create',
  async (repositoryData, { rejectWithValue }) => {
    try {
      const response = await repositoryService.createRepository(repositoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create repository');
    }
  }
);

export const fetchRepositoryById = createAsyncThunk(
  'repositories/fetchById',
  async (repositoryId, { rejectWithValue }) => {
    try {
      const response = await repositoryService.getRepositoryById(repositoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repository');
    }
  }
);

export const fetchUserRepositories = createAsyncThunk(
  'repositories/fetchUserRepositories',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await repositoryService.getUserRepositories(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repositories');
    }
  }
);

export const updateRepository = createAsyncThunk(
  'repositories/update',
  async ({ repositoryId, repositoryData }, { rejectWithValue }) => {
    try {
      const response = await repositoryService.updateRepository(repositoryId, repositoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update repository');
    }
  }
);

export const deleteRepository = createAsyncThunk(
  'repositories/delete',
  async (repositoryId, { rejectWithValue }) => {
    try {
      await repositoryService.deleteRepository(repositoryId);
      return repositoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete repository');
    }
  }
);

export const searchRepositories = createAsyncThunk(
  'repositories/search',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await repositoryService.searchRepositories(keyword);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search repositories');
    }
  }
);

const repositorySlice = createSlice({
  name: 'repositories',
  initialState: {
    repositories: [],
    currentRepository: null,
    searchResults: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRepository: (state, action) => {
      state.currentRepository = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create repository
      .addCase(createRepository.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRepository.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories.push(action.payload);
        state.currentRepository = action.payload;
      })
      .addCase(createRepository.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch repository by ID
      .addCase(fetchRepositoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepositoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRepository = action.payload;
      })
      .addCase(fetchRepositoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user repositories
      .addCase(fetchUserRepositories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRepositories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = action.payload;
      })
      .addCase(fetchUserRepositories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update repository
      .addCase(updateRepository.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRepository.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = state.repositories.map(repo => 
          repo.id === action.payload.id ? action.payload : repo
        );
        state.currentRepository = action.payload;
      })
      .addCase(updateRepository.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete repository
      .addCase(deleteRepository.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRepository.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = state.repositories.filter(repo => repo.id !== action.payload);
        if (state.currentRepository && state.currentRepository.id === action.payload) {
          state.currentRepository = null;
        }
      })
      .addCase(deleteRepository.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search repositories
      .addCase(searchRepositories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRepositories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRepositories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentRepository, clearSearchResults } = repositorySlice.actions;
export default repositorySlice.reducer;