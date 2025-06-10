import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { message } from 'antd';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.31.6:8081', // 直接访问后端服务器
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url, config);
    // 添加token到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('收到响应:', response.status, response.data);
    // 直接返回后端数据，无论是数组还是对象
    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', error);
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      console.error('HTTP错误:', status, data);      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // 避免在登录页面时重复跳转导致页面刷新
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(data?.message || '网络错误');
      }
    } else if (error.request) {
      message.error('网络连接失败');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default api;
