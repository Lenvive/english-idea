import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 创建默认管理员
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  // 创建一些示例语句
  const sentences = [
    {
      content:
        "The beauty of simplicity lies in its ability to communicate profound truths.",
    },
    { content: "In the quiet moments, we find our deepest inspirations." },
    { content: "Design is not just what it looks like, but how it works." },
  ];

  for (const sentence of sentences) {
    const existing = await prisma.sentence.findFirst({
      where: { content: sentence.content },
    });
    if (!existing) {
      await prisma.sentence.create({
        data: sentence,
      });
    }
  }

  console.log("数据库种子数据已创建");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
