import api from './api';

// Integration with Folder Controller API endpoints
const folderService = {
  /**
   * Create a new folder
   * @param {Object} folderData - Folder data
   * @param {string} folderData.name - Folder name
   * @param {number} folderData.repositoryId - Repository ID
   * @param {number} folderData.parentFolderId - Parent folder ID (optional)
   * @param {boolean} folderData.isMilestone - Whether the folder is a milestone (optional)
   * @param {string} folderData.description - Folder description (optional)
   * @param {Date} folderData.dueDate - Due date (for milestones only, optional)
   */
  createFolder: async (folderData) => {
    return await api.post('/api/repositories/folders', folderData);
  },

  /**
   * Get folder by ID
   * @param {number} folderId - Folder ID
   */
  getFolderById: async (folderId) => {
    return await api.get(`/api/repositories/folders/${folderId}`);
  },

  /**
   * Update folder
   * @param {number} folderId - Folder ID
   * @param {Object} folderData - Updated folder data
   */
  updateFolder: async (folderId, folderData) => {
    return await api.put(`/api/repositories/folders/${folderId}`, folderData);
  },

  /**
   * Delete folder
   * @param {number} folderId - Folder ID
   */
  deleteFolder: async (folderId) => {
    return await api.delete(`/api/repositories/folders/${folderId}`);
  },

  /**
   * Get repository's root folders
   * @param {number} repositoryId - Repository ID
   */
  getRepositoryFolders: async (repositoryId) => {
    return await api.get(`/api/repositories/folders/repository/${repositoryId}`);
  },

  /**
   * Get subfolders of a folder
   * @param {number} repositoryId - Repository ID
   * @param {number} parentFolderId - Parent folder ID
   */
  getSubfolders: async (repositoryId, parentFolderId) => {
    return await api.get(`/api/repositories/folders/repository/${repositoryId}/subfolders/${parentFolderId}`);
  },

  /**
   * Get all milestone folders in a repository
   * @param {number} repositoryId - Repository ID
   */
  getMilestoneFolders: async (repositoryId) => {
    return await api.get(`/api/repositories/folders/repository/${repositoryId}/milestones`);
  },
  
  /**
   * Check if a folder exists
   * @param {number} folderId - Folder ID
   */
  checkFolderExists: async (folderId) => {
    return await api.get(`/api/repositories/folders/${folderId}/exists`);
  }
};

export default folderService;