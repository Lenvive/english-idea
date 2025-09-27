import { NextRequest, NextResponse } from "next/server";
import { getCookieConfig } from "@/lib/cookie-config";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  const cookieConfig = getCookieConfig(request, 0); // 立即过期

  // 清除认证cookie
  response.cookies.set("auth-token", "", cookieConfig);

  return response;
}
