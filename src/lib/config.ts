// 路径配置
export const APP_CONFIG = {
  // 应用的基础路径前缀
  basePath: "/english-ideas",

  // 路由定义
  routes: {
    home: "/",
    login: "/login",
    admin: "/admin",
  },
} as const;

// 获取完整路径
export const getFullPath = (path: string): string => {
  if (path.startsWith("http")) {
    return path; // 外部链接直接返回
  }

  // 如果路径已经包含 basePath，直接返回
  if (path.startsWith(APP_CONFIG.basePath)) {
    return path;
  }

  // 添加 basePath 前缀
  return `${APP_CONFIG.basePath}${path}`;
};

// 获取 API 基础路径
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // 客户端：使用当前页面的 origin，Nginx 会处理路径前缀
    return `${window.location.origin}${APP_CONFIG.basePath}/api`;
  } else {
    // 服务器端：使用相对路径，因为 Nginx 已经处理了路径前缀
    return "/api";
  }
};
