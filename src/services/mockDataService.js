// Mock data service for development
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock projects
const mockProjects = [
  {
    id: 1,
    projectName: 'نظام إدارة المستشفيات',
    shortDescription: 'نظام متكامل لإدارة المستشفيات والعيادات',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    team: { members: [1, 2, 3] },
    milestones: [
      {
        id: 1,
        milestoneName: 'تحليل المتطلبات',
        description: 'جمع وتحليل متطلبات النظام',
        dueDate: '2024-02-01',
        status: 'completed',
        files: [],
        progress: 100
      },
      {
        id: 2,
        milestoneName: 'تصميم النظام',
        description: 'تصميم واجهات المستخدم وقاعدة البيانات',
        dueDate: '2024-03-01',
        status: 'in_progress',
        files: [],
        progress: 60
      }
    ]
  },
  {
    id: 2,
    projectName: 'تطبيق التجارة الإلكترونية',
    shortDescription: 'منصة للتسوق عبر الإنترنت',
    status: 'ACTIVE',
    startDate: '2024-02-01',
    endDate: '2024-07-31',
    team: { members: [1, 2] },
    milestones: []
  }
];

// Mock files
const mockFiles = [
  {
    id: 1,
    fileName: 'requirements.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    description: 'وثيقة متطلبات النظام',
    uploadDate: '2024-01-15',
    uploadedBy: { name: 'أحمد محمد', id: 1 },
    milestoneId: 1,
    projectId: 1
  },
  {
    id: 2,
    fileName: 'database-design.docx',
    fileSize: 2048000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'تصميم قاعدة البيانات',
    uploadDate: '2024-02-20',
    uploadedBy: { name: 'سارة أحمد', id: 2 },
    milestoneId: 2,
    projectId: 1
  }
];

const mockDataService = {
  // Projects
  getProjects: async () => {
    await delay(500);
    return { data: mockProjects };
  },

  getProjectById: async (id) => {
    await delay(500);
    const project = mockProjects.find(p => p.id === parseInt(id));
    if (!project) throw new Error('Project not found');
    return { data: project };
  },

  createProject: async (projectData) => {
    await delay(500);
    const newProject = {
      id: mockProjects.length + 1,
      ...projectData,
      status: 'ACTIVE',
      milestones: []
    };
    mockProjects.push(newProject);
    return { data: newProject };
  },

  // Files
  getFiles: async (params) => {
    await delay(500);
    let files = [...mockFiles];
    if (params?.projectId) {
      files = files.filter(f => f.projectId === parseInt(params.projectId));
    }
    return { data: files };
  },

  uploadFile: async (file, description, milestoneId) => {
    await delay(1000);
    const newFile = {
      id: mockFiles.length + 1,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      description: description,
      uploadDate: new Date().toISOString(),
      uploadedBy: { name: 'Current User', id: 1 },
      milestoneId: parseInt(milestoneId),
      projectId: 1
    };
    mockFiles.push(newFile);
    return { data: newFile };
  },

  // Notifications
  getNotifications: async () => {
    await delay(300);
    return { data: [] };
  }
};

export default mockDataService;
