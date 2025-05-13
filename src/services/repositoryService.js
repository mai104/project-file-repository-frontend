import api from './api';

// Integration with Repository Controller API endpoints
const repositoryService = {
  /**
   * Create a new repository
   * @param {Object} repositoryData - Repository data
   * @param {string} repositoryData.name - Repository name
   * @param {string} repositoryData.description - Repository description
   * @param {Date} repositoryData.startDate - Start date
   * @param {Date} repositoryData.endDate - End date
   * @param {number} repositoryData.supervisorId - Supervisor ID
   */
  createRepository: async (repositoryData) => {
    return await api.post('/api/repositories', repositoryData);
  },

  /**
   * Get repository by ID
   * @param {number} repositoryId - Repository ID
   */
  getRepositoryById: async (repositoryId) => {
    return await api.get(`/api/repositories/${repositoryId}`);
  },

  /**
   * Update repository
   * @param {number} repositoryId - Repository ID
   * @param {Object} repositoryData - Updated repository data
   */
  updateRepository: async (repositoryId, repositoryData) => {
    return await api.put(`/api/repositories/${repositoryId}`, repositoryData);
  },

  /**
   * Delete repository
   * @param {number} repositoryId - Repository ID
   */
  deleteRepository: async (repositoryId) => {
    return await api.delete(`/api/repositories/${repositoryId}`);
  },

  /**
   * Get owner's repositories
   * @param {number} ownerId - Owner ID
   */
  getOwnerRepositories: async (ownerId) => {
    return await api.get(`/api/repositories/owner/${ownerId}`);
  },

  /**
   * Get supervisor's repositories
   * @param {number} supervisorId - Supervisor ID
   */
  getSupervisorRepositories: async (supervisorId) => {
    return await api.get(`/api/repositories/supervisor/${supervisorId}`);
  },

  /**
   * Get user's repositories (owner or contributor)
   * @param {number} userId - User ID
   */
  getUserRepositories: async (userId) => {
    return await api.get(`/api/repositories/user/${userId}`);
  },

  /**
   * Search repositories
   * @param {string} keyword - Search keyword
   */
  searchRepositories: async (keyword) => {
    return await api.get(`/api/repositories/search?keyword=${encodeURIComponent(keyword)}`);
  },

  /**
   * Check if a repository exists
   * @param {number} repositoryId - Repository ID
   */
  checkRepositoryExists: async (repositoryId) => {
    return await api.get(`/api/repositories/${repositoryId}/exists`);
  }
};

export default repositoryService;