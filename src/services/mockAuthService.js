// Mock data for development
const mockUsers = [
  {
    email: 'student@test.com',
    password: 'password123',
    name: 'طالب تجريبي',
    role: 'STUDENT',
    studentId: 'ST001',
    token: 'mock-student-token-123',
    id: 1
  },
  {
    email: 'supervisor@test.com',
    password: 'password123',
    name: 'مشرف تجريبي',
    role: 'SUPERVISOR',
    token: 'mock-supervisor-token-456',
    id: 2
  }
];

const mockAuthService = {
  login: async (credentials) => {
    // محاكاة التأخير للشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { data: { user: userWithoutPassword, token: user.token } };
    }
    
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  },

  register: async (userData) => {
    // محاكاة التأخير للشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...userData,
      id: mockUsers.length + 1,
      token: `mock-token-${Date.now()}`,
    };
    
    mockUsers.push(newUser);
    localStorage.setItem('token', newUser.token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { data: { user: newUser, token: newUser.token } };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    // محاكاة التأخير للشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return { data: JSON.parse(userStr) };
    }
    throw new Error('لم يتم العثور على المستخدم');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default mockAuthService;
