import api from './api';
import mockDataService from './mockDataService';

// للتبديل بين الوضع الحقيقي والوهمي
const USE_MOCK = true;

const fileService = USE_MOCK ? {
  uploadFile: async (file, description, milestoneId, onUploadProgress) => {
    return mockDataService.uploadFile(file, description, milestoneId);
  },

  getFiles: async (params) => {
    return mockDataService.getFiles(params);
  },

  getFileById: async (fileId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const files = await mockDataService.getFiles();
    const file = files.data.find(f => f.id === parseInt(fileId));
    if (!file) throw new Error('File not found');
    return { data: file };
  },

  deleteFile: async (fileId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  },

  downloadFile: async (fileId) => {
    // في الوضع التجريبي، فقط نعرض رسالة
    alert('File download functionality will be available when connected to backend');
    return { data: { success: true } };
  },

  getFilesByMilestone: async (milestoneId) => {
    const files = await mockDataService.getFiles();
    const milestoneFiles = files.data.filter(f => f.milestoneId === parseInt(milestoneId));
    return { data: milestoneFiles };
  },

  getRecentFiles: async (limit = 5) => {
    const files = await mockDataService.getFiles();
    return { data: files.data.slice(0, limit) };
  },
} : {
  uploadFile: async (file, description, milestoneId, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('milestoneId', milestoneId);

    return await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  getFiles: async (projectId, milestoneId) => {
    let url = '/files';
    const params = new URLSearchParams();
    
    if (projectId) params.append('projectId', projectId);
    if (milestoneId) params.append('milestoneId', milestoneId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await api.get(url);
  },

  getFileById: async (fileId) => {
    return await api.get(`/files/${fileId}`);
  },

  deleteFile: async (fileId) => {
    return await api.delete(`/files/${fileId}`);
  },

  downloadFile: async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from content-disposition header or use a default
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

  // ... باقي الوظائف كما هي
};

export default fileService;
