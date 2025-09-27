import { NextRequest } from "next/server";

export interface CookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge?: number;
  expires?: Date;
}

export function getCookieConfig(
  request: NextRequest,
  maxAge?: number
): CookieConfig {
  // 检查是否为 HTTPS 连接
  const isSecure =
    request.headers.get("x-forwarded-proto") === "https" ||
    request.url.startsWith("https://") ||
    // 对于本地开发，不使用 secure
    (process.env.NODE_ENV === "development" &&
      request.url.includes("localhost"));

  return {
    httpOnly: true,
    secure: isSecure && process.env.NODE_ENV !== "development",
    sameSite: "strict",
    ...(maxAge && { maxAge }),
  };
}
