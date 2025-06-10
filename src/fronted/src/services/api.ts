import type { 
  LoginRequest, 
  LoginResponse, 
  StudentForm,
  ApiResponse 
} from '../types';
import api from '../utils/request';

// 用户认证API
export const authAPI = {  // 登录
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      // 根据角色选择不同的登录端点
      let endpoint: string;
      let requestData: Record<string, string>;
      
      if (data.role === 'teacher') {
        endpoint = '/admin/login';
        requestData = {
          admin_id: data.username,
          password: data.password
        };
      } else {
        endpoint = '/user/login';
        requestData = {
          student_id: data.username,
          password: data.password
        };
      }

      console.log('登录请求:', { endpoint, requestData });
      
      const response = await api.post(endpoint, requestData);
      console.log('登录响应:', response.data);
      
      // 检查后端响应格式
      if (response.data.success) {
        // 构造前端需要的响应格式
        const apiResponse: ApiResponse<LoginResponse> = {
          code: 200,
          message: response.data.message || '登录成功',
          data: {
            token: `jwt-token-${Date.now()}`, // 如果后端没有返回token，生成一个
            user: {
              id: data.role === 'teacher' ? response.data.adminId : response.data.studentId,
              username: data.username,
              role: data.role,
              name: data.role === 'teacher' ? '教师' : '学生',
              avatar: undefined
            }
          },
          timestamp: new Date().toISOString()};
        return apiResponse;
      }
      
      throw new Error(response.data.message || '登录失败');
    } catch (error: unknown) {
      console.error('登录错误:', error);
      
      // 处理HTTP错误
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data?: { message?: string } } };
        const message = axiosError.response.data?.message || '登录失败';
        throw new Error(message);
      } 
      if (error && typeof error === 'object' && 'request' in error) {
        throw new Error('网络连接失败，请检查后端服务是否运行');
      } 
      
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      throw new Error(errorMessage);
    }
  },

  // 登出
  logout: async (): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      code: 200,
      message: '登出成功',
      data: null,
      timestamp: new Date().toISOString()
    };
  },
  // 获取当前用户信息
  getCurrentUser: async (): Promise<ApiResponse> => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return {
        code: 200,
        message: '获取成功',
        data: JSON.parse(userStr),
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('用户未登录');
  }
};

// 学生管理API
export const studentAPI = {
  // 获取学生列表
  getStudents: async () => {
    try {
      const response = await api.get('/admin/students/all');
      console.log('API 响应:', response);

      return response.data;
    } catch (error) {
      console.error('API 调用失败:', error);
      throw error;
    }
  },

  // 获取学生详情
  getStudent: async (id: string) => {
    return api.get(`/admin/students/${id}`);
  },
  // 创建学生
  createStudent: async (data: StudentForm) => {
    // 将前端字段映射为后端期望的字段
    const backendData = {
      student_id: data.student_id,
      student_name: data.student_name,
      gender: data.gender,
      class_name: data.class_name
    };
    return api.post('/admin/students', backendData);
  },

  // 更新学生
  updateStudent: async (id: string, data: Partial<StudentForm>) => {
    // 将前端字段映射为后端期望的字段
    const backendData: Partial<{
      student_id: string;
      student_name: string;
      gender: '男' | '女';
      class_name: string;
    }> = {};
    
    if (data.student_id) backendData.student_id = data.student_id;
    if (data.student_name) backendData.student_name = data.student_name;
    if (data.gender) backendData.gender = data.gender;
    if (data.class_name) backendData.class_name = data.class_name;

    return api.put(`/admin/students/${id}`, backendData);
  },

  // 删除学生
  deleteStudent: async (id: string) => {
    return api.delete(`/admin/students/${id}`);
  },

  // 批量删除学生（假设后端支持批量删除接口，否则可循环调用 deleteStudent）
  batchDeleteStudents: async (ids: string[]) => {
    // 这里假设后端没有批量删除接口，前端循环删除
    return Promise.all(ids.map(id => api.delete(`/admin/students/${id}`)));
  },  // 获取班级列表（从学生数据中提取或返回默认值）
  getClasses: async () => {
      return ['计算机科学1班', '计算机科学2班', '软件工程1班', '软件工程2班'];
  },
};
