import api from './api';
import repositoryService from './repositoryService';
import folderService from './folderService';

// Project service mapping to repository and folder services in the new API structure
const projectService = {
  // Map project functions to repository service
  getProjects: async () => {
    // Get the current user's repositories
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return repositoryService.getUserRepositories(user.id);
  },

  getProjectById: async (projectId) => {
    return repositoryService.getRepositoryById(projectId);
  },

  createProject: async (projectData) => {
    return repositoryService.createRepository(projectData);
  },

  updateProject: async (projectId, projectData) => {
    return repositoryService.updateRepository(projectId, projectData);
  },

  deleteProject: async (projectId) => {
    return repositoryService.deleteRepository(projectId);
  },

  searchProjects: async (query) => {
    return repositoryService.searchRepositories(query);
  },

  // Map milestone functions to folder service (treating milestones as special folders)
  getMilestones: async (projectId) => {
    return folderService.getMilestoneFolders(projectId);
  },

  getMilestoneById: async (projectId, milestoneId) => {
    return folderService.getFolderById(milestoneId);
  },

  createMilestone: async (projectId, milestoneData) => {
    const folderData = {
      name: milestoneData.milestoneName,
      description: milestoneData.description,
      repositoryId: projectId,
      isMilestone: true,
      dueDate: milestoneData.dueDate
    };
    return folderService.createFolder(folderData);
  },

  updateMilestone: async (projectId, milestoneId, milestoneData) => {
    const folderData = {
      name: milestoneData.milestoneName,
      description: milestoneData.description,
      dueDate: milestoneData.dueDate,
      repositoryId: projectId
    };
    return folderService.updateFolder(milestoneId, folderData);
  },

  deleteMilestone: async (projectId, milestoneId) => {
    return folderService.deleteFolder(milestoneId);
  },

  markMilestoneComplete: async (projectId, milestoneId) => {
    const folderData = {
      status: 'COMPLETED'
    };
    return folderService.updateFolder(milestoneId, folderData);
  }
};

export default projectService;