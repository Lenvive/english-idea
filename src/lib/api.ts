import axios from "axios";
import { getApiBaseUrl, APP_CONFIG } from "@/lib/config";

// 创建 axios 实例
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // 自动包含 cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一处理 401 错误
    if (error.response?.status === 401) {
      // 如果是浏览器环境
      if (typeof window !== "undefined") {
        window.location.href = `${APP_CONFIG.basePath}${APP_CONFIG.routes.login}`;
      }
    }
    return Promise.reject(error);
  }
);

// API 方法封装
export const apiService = {
  // 认证相关
  auth: {
    login: (credentials: { username: string; password: string }) =>
      api.post("/auth/login", credentials),
    logout: () => api.post("/auth/logout"),
    me: () => api.get("/auth/me"),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      api.post("/auth/change-password", data),
  },

  // 句子相关
  sentences: {
    getAll: () => api.get("/sentences"),
    create: (content: string) => api.post("/sentences", { content }),
    update: (id: number, content: string) =>
      api.put(`/sentences/${id}`, { content }),
    delete: (id: number) => api.delete(`/sentences/${id}`),
  },
};

export default api;
