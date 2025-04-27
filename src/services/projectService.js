import api from './api';
import mockDataService from './mockDataService';

// للتبديل بين الوضع الحقيقي والوهمي
const USE_MOCK = true;

const projectService = USE_MOCK ? mockDataService : {
  // Project API calls
  getProjects: async () => {
    return await api.get('/projects');
  },

  getProjectById: async (projectId) => {
    return await api.get(`/projects/${projectId}`);
  },

  createProject: async (projectData) => {
    return await api.post('/projects', projectData);
  },

  updateProject: async (projectId, projectData) => {
    return await api.put(`/projects/${projectId}`, projectData);
  },

  deleteProject: async (projectId) => {
    return await api.delete(`/projects/${projectId}`);
  },

  searchProjects: async (query) => {
    return await api.get(`/projects/search?q=${query}`);
  },

  getProjectsByStatus: async (status) => {
    return await api.get(`/projects/status/${status}`);
  },

  // Milestone API calls
  getMilestones: async (projectId) => {
    return await api.get(`/projects/${projectId}/milestones`);
  },

  getMilestoneById: async (projectId, milestoneId) => {
    return await api.get(`/projects/${projectId}/milestones/${milestoneId}`);
  },

  createMilestone: async (projectId, milestoneData) => {
    return await api.post(`/projects/${projectId}/milestones`, milestoneData);
  },

  updateMilestone: async (projectId, milestoneId, milestoneData) => {
    return await api.put(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData);
  },

  deleteMilestone: async (projectId, milestoneId) => {
    return await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
  },

  markMilestoneComplete: async (projectId, milestoneId) => {
    return await api.post(`/projects/${projectId}/milestones/${milestoneId}/complete`);
  },

  // Team API calls
  getProjectTeam: async (projectId) => {
    return await api.get(`/projects/${projectId}/team`);
  },

  addTeamMember: async (projectId, userId) => {
    return await api.post(`/projects/${projectId}/team`, { userId });
  },

  removeTeamMember: async (projectId, userId) => {
    return await api.delete(`/projects/${projectId}/team/${userId}`);
  },

  updateTeamMemberRole: async (projectId, userId, role) => {
    return await api.put(`/projects/${projectId}/team/${userId}`, { role });
  },

  // Statistics API calls
  getProjectStats: async (projectId) => {
    return await api.get(`/projects/${projectId}/stats`);
  },

  getOverallStats: async () => {
    return await api.get('/projects/stats');
  },

  // Activity API calls
  getProjectActivity: async (projectId) => {
    return await api.get(`/projects/${projectId}/activity`);
  },

  // Deadline API calls
  getUpcomingDeadlines: async () => {
    return await api.get('/projects/deadlines');
  },

  // Export/Import API calls
  exportProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/export`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `project-${projectId}-export.zip`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  importProject: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/projects/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default projectService;
