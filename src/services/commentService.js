import api from './api';

// Integration with Comment Controller API endpoints
const commentService = {
  /**
   * Create a new comment
   * @param {Object} commentData - Comment data
   * @param {string} commentData.content - Comment content
   * @param {number} commentData.fileId - ID of the commented file
   * @param {number} commentData.rating - Rating (for supervisors only)
   */
  createComment: async (commentData) => {
    return await api.post('/api/comments', commentData);
  },

  /**
   * Get comment by ID
   * @param {number} commentId - Comment ID
   */
  getCommentById: async (commentId) => {
    return await api.get(`/api/comments/${commentId}`);
  },

  /**
   * Update comment
   * @param {number} commentId - Comment ID
   * @param {Object} commentData - Updated comment data
   */
  updateComment: async (commentId, commentData) => {
    return await api.put(`/api/comments/${commentId}`, commentData);
  },

  /**
   * Delete comment
   * @param {number} commentId - Comment ID
   */
  deleteComment: async (commentId) => {
    return await api.delete(`/api/comments/${commentId}`);
  },

  /**
   * Get file comments
   * @param {number} fileId - File ID
   */
  getFileComments: async (fileId) => {
    return await api.get(`/api/comments/file/${fileId}`);
  },

  /**
   * Get user comments
   * @param {number} userId - User ID
   */
  getUserComments: async (userId) => {
    return await api.get(`/api/comments/user/${userId}`);
  },

  /**
   * Get supervisor comments on a file
   * @param {number} fileId - File ID
   */
  getSupervisorComments: async (fileId) => {
    return await api.get(`/api/comments/file/${fileId}/supervisor`);
  },

  /**
   * Get student comments on a file
   * @param {number} fileId - File ID
   */
  getStudentComments: async (fileId) => {
    return await api.get(`/api/comments/file/${fileId}/student`);
  }
};

export default commentService;