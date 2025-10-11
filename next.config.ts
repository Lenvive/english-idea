import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/english-ideas",
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
