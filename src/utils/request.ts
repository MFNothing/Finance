import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器（可选）
instance.interceptors.request.use(
  (config) => {
    // 可在此处添加token等
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（可选）
instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// 通用请求方法
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.request<T>(config);
  return response.data;
};

// GET 方法
export const get = async <T, P>(url: string, params?: P, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, url, method: 'get', params });
};

// POST 方法
export const post = async <T, P>(url: string, data?: P, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, url, method: 'post', data });
};

export default instance; 