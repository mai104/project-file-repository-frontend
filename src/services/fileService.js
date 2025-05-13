import api from './api';

// Integration with File Controller API endpoints
const fileService = {
  /**
   * Upload a new file
   * @param {Object} fileData - File data and metadata
   * @param {File} fileData.file - The file to be uploaded
   * @param {string} fileData.description - File description (optional)
   * @param {number} fileData.folderId - Folder ID
   * @param {Function} onUploadProgress - Progress tracking function
   */
  uploadFile: async (fileData, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    
    if (fileData.description) {
      formData.append('description', fileData.description);
    }
    
    formData.append('folderId', fileData.folderId);
    
    return await api.post('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  /**
   * Get file by ID
   * @param {number} fileId - File ID
   */
  getFileById: async (fileId) => {
    return await api.get(`/api/files/${fileId}`);
  },

  /**
   * Get files in a specific folder
   * @param {number} folderId - Folder ID
   */
  getFilesByFolder: async (folderId) => {
    return await api.get(`/api/files/folder/${folderId}`);
  },

  /**
   * Update file data
   * @param {number} fileId - File ID
   * @param {Object} fileData - Updated file data
   */
  updateFile: async (fileId, fileData) => {
    return await api.put(`/api/files/${fileId}`, fileData);
  },

  /**
   * Delete file
   * @param {number} fileId - File ID
   */
  deleteFile: async (fileId) => {
    return await api.delete(`/api/files/${fileId}`);
  },

  /**
   * Download file
   * @param {number} fileId - File ID
   */
  downloadFile: async (fileId) => {
    const response = await api.get(`/api/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from content-disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'download';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  /**
   * Get user files
   * @param {number} userId - User ID
   */
  getUserFiles: async (userId) => {
    return await api.get(`/api/files/user/${userId}`);
  },

  /**
   * Get user files in a specific folder
   * @param {number} folderId - Folder ID
   * @param {number} userId - User ID
   */
  getUserFolderFiles: async (folderId, userId) => {
    return await api.get(`/api/files/folder/${folderId}/user/${userId}`);
  },

  /**
   * Get file history
   * @param {number} fileId - File ID
   */
  getFileHistory: async (fileId) => {
    return await api.get(`/api/files/history/${fileId}`);
  },
};

export default fileService;