import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 basePath，让 Nginx 处理路径前缀
  // basePath: "/english-ideas",
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
