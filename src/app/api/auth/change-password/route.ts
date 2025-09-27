import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // 验证输入
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "所有字段都是必填的" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "新密码和确认密码不匹配" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "新密码至少需要6个字符" },
        { status: 400 }
      );
    }

    // 获取当前管理员信息
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: admin.adminId },
    });

    if (!currentAdmin) {
      return NextResponse.json({ error: "管理员不存在" }, { status: 404 });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentAdmin.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.admin.update({
      where: { id: admin.adminId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: "密码修改成功" });
  } catch (error) {
    console.error("修改密码错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
