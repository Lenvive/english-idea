import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// 验证管理员权限的中间件函数
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// 获取所有语句
export async function GET() {
  try {
    const sentences = await prisma.sentence.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sentences);
  } catch (error) {
    console.error("获取语句错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 创建新语句
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "语句内容不能为空" }, { status: 400 });
    }

    const sentence = await prisma.sentence.create({
      data: { content: content.trim() },
    });

    return NextResponse.json(sentence);
  } catch (error) {
    console.error("创建语句错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
