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

// 更新语句
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { content } = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "语句内容不能为空" }, { status: 400 });
    }

    const sentence = await prisma.sentence.update({
      where: { id },
      data: { content: content.trim() },
    });

    return NextResponse.json(sentence);
  } catch (error) {
    console.error("更新语句错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 删除语句
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.sentence.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除语句错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
