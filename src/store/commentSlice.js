import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../services/commentService';

// Async thunks
export const createComment = createAsyncThunk(
  'comments/create',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await commentService.createComment(commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const fetchFileComments = createAsyncThunk(
  'comments/fetchFileComments',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await commentService.getFileComments(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchSupervisorComments = createAsyncThunk(
  'comments/fetchSupervisorComments',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await commentService.getSupervisorComments(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch supervisor comments');
    }
  }
);

export const fetchStudentComments = createAsyncThunk(
  'comments/fetchStudentComments',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await commentService.getStudentComments(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student comments');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ commentId, commentData }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(commentId, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    supervisorComments: [],
    studentComments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.supervisorComments = [];
      state.studentComments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
        
        // Add to specific comment type arrays
        if (action.payload.userRole === 'SUPERVISOR') {
          state.supervisorComments.push(action.payload);
        } else if (action.payload.userRole === 'STUDENT') {
          state.studentComments.push(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch file comments
      .addCase(fetchFileComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFileComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchFileComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch supervisor comments
      .addCase(fetchSupervisorComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupervisorComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supervisorComments = action.payload;
      })
      .addCase(fetchSupervisorComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch student comments
      .addCase(fetchStudentComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentComments = action.payload;
      })
      .addCase(fetchStudentComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in main comments
        state.comments = state.comments.map(comment => 
          comment.id === action.payload.id ? action.payload : comment
        );
        
        // Update in specific comment type arrays
        if (action.payload.userRole === 'SUPERVISOR') {
          state.supervisorComments = state.supervisorComments.map(comment => 
            comment.id === action.payload.id ? action.payload : comment
          );
        } else if (action.payload.userRole === 'STUDENT') {
          state.studentComments = state.studentComments.map(comment => 
            comment.id === action.payload.id ? action.payload : comment
          );
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const commentId = action.payload;
        
        // Find the comment to determine its role before removing
        const comment = state.comments.find(c => c.id === commentId);
        
        // Remove from main comments
        state.comments = state.comments.filter(comment => comment.id !== commentId);
        
        // Remove from specific comment type arrays
        if (comment && comment.userRole === 'SUPERVISOR') {
          state.supervisorComments = state.supervisorComments.filter(comment => 
            comment.id !== commentId
          );
        } else if (comment && comment.userRole === 'STUDENT') {
          state.studentComments = state.studentComments.filter(comment => 
            comment.id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;