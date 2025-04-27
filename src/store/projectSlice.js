import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../services/projectService';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectById(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(projectId, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

// Milestone thunks
export const createMilestone = createAsyncThunk(
  'projects/createMilestone',
  async ({ projectId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await projectService.createMilestone(projectId, milestoneData);
      return { projectId, milestone: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create milestone');
    }
  }
);

export const updateMilestone = createAsyncThunk(
  'projects/updateMilestone',
  async ({ projectId, milestoneId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneId, milestoneData);
      return { projectId, milestone: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update milestone');
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  'projects/deleteMilestone',
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      await projectService.deleteMilestone(projectId, milestoneId);
      return { projectId, milestoneId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete milestone');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
    filter: 'all', // all, active, completed
    searchQuery: '',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create milestone
      .addCase(createMilestone.fulfilled, (state, action) => {
        const { projectId, milestone } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.milestones.push(milestone);
        }
        if (state.currentProject?.id === projectId) {
          state.currentProject.milestones.push(milestone);
        }
      })
      // Update milestone
      .addCase(updateMilestone.fulfilled, (state, action) => {
        const { projectId, milestone } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          const index = project.milestones.findIndex(m => m.id === milestone.id);
          if (index !== -1) {
            project.milestones[index] = milestone;
          }
        }
        if (state.currentProject?.id === projectId) {
          const index = state.currentProject.milestones.findIndex(m => m.id === milestone.id);
          if (index !== -1) {
            state.currentProject.milestones[index] = milestone;
          }
        }
      })
      // Delete milestone
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        const { projectId, milestoneId } = action.payload;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.milestones = project.milestones.filter(m => m.id !== milestoneId);
        }
        if (state.currentProject?.id === projectId) {
          state.currentProject.milestones = state.currentProject.milestones.filter(
            m => m.id !== milestoneId
          );
        }
      });
  },
});

export const { clearError, setFilter, setSearchQuery, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
