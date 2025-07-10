import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在客户端环境中，使用本地 API 代理
    if (typeof window !== 'undefined') {
      // 客户端环境，使用相对路径
      const queryString = config.params ? `?${new URLSearchParams(config.params).toString()}` : '';
      config.url = `/api/finance${queryString}`;
      config.params = undefined; // 清除 params，因为已经拼接到 URL 中
      
      // 调试信息
      console.log('Request Interceptor - Modified URL:', config.url);
      console.log('Request Interceptor - Original params:', config.params);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 通用请求方法
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.request<T>(config);
  return response.data;
};

// GET 请求
export const get = async <T, P = Record<string, unknown>>(
  url: string,
  params?: P,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await instance.get<T>(url, { params, ...config });
  return response.data;
};

// POST 请求
export const post = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await instance.post<T>(url, data, config);
  return response.data;
}; 