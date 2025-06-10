// 用户类型定义
export interface User {
  id: string;
  username: string;
  role: 'student' | 'teacher';
  name: string;
  avatar?: string;
}

// 学生信息类型定义
export interface Student {
  id: string;
  student_id: string; // 学号
  student_name: string;
  gender: '男' | '女';
  class_name: string;
}

// API响应类型定义
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// 分页查询参数
export interface PageQuery {
  page: number;
  size: number;
  keyword?: string;
  class?: string;
  gender?: 'male' | 'female';
}

// 分页响应数据
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
  role: 'student' | 'teacher';
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
}

// 学生表单数据
export interface StudentForm {
  student_id: string;
  student_name: string;
  gender: '男' | '女';
  class_name: string;
}
