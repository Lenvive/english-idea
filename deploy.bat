@echo off
:: Windows 部署脚本

echo 🚀 开始部署 English Ideas 应用...

:: 检查 Node.js 版本
echo 📦 检查 Node.js 版本...
node --version
npm --version

:: 安装依赖
echo 📦 安装依赖...
npm ci

:: 设置数据库
echo 🗄️ 设置数据库...
npx prisma generate
npx prisma migrate deploy

:: 运行种子数据（可选，如果需要初始数据）
echo 🌱 运行种子数据...
npm run db:seed

:: 构建应用
echo 🔨 构建应用...
npm run build

:: 启动应用
echo 🚀 启动应用...
npm start