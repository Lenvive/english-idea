# 部署指南

## 准备工作

### 1. 环境要求

- Node.js 18+
- npm 或 yarn
- Git

### 2. 环境变量设置

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

重要环境变量：

- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: JWT 签名密钥（生产环境必须修改）
- `NODE_ENV`: 设置为 "production"

## 部署方法

### 方法 1: 直接部署

#### 克隆项目

```bash
git clone <your-repo-url>
cd english-idea
```

#### 安装依赖

```bash
npm ci
```

#### 数据库设置

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 可选：运行种子数据
npm run db:seed
```

#### 构建和启动

```bash
# 构建项目
npm run build

# 启动应用
npm start
```

#### 使用部署脚本

Linux/Mac:

```bash
chmod +x deploy.sh
./deploy.sh
```

Windows:

```bash
deploy.bat
```

### 方法 2: Docker 部署

#### 构建镜像

```bash
docker build -t english-idea .
```

#### 运行容器

```bash
docker run -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e DATABASE_URL=file:/app/data/prod.db \
  -v $(pwd)/data:/app/data \
  english-idea
```

#### 使用 Docker Compose

```bash
# 设置环境变量
export JWT_SECRET=your-super-secret-key

# 启动服务
docker-compose up -d
```

### 方法 3: 云服务器部署

#### Vercel 部署

1. 连接 GitHub 仓库
2. 设置环境变量：
   - `JWT_SECRET`
   - `DATABASE_URL`（推荐使用云数据库）
3. 自动部署

#### 其他云平台

- Railway
- Render
- DigitalOcean App Platform
- AWS/Azure/GCP

## 数据库选择

### SQLite (默认)

- 适合小型应用
- 文件数据库，易于备份
- `DATABASE_URL="file:./prod.db"`

### PostgreSQL (推荐生产环境)

```bash
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"
```

### MySQL

```bash
DATABASE_URL="mysql://username:password@hostname:3306/database_name"
```

## 生产环境配置

### 1. 安全配置

- 修改 `JWT_SECRET` 为强密钥
- 启用 HTTPS
- 配置防火墙

### 2. 性能优化

- 使用 PM2 或类似进程管理器
- 配置反向代理 (Nginx)
- 启用缓存

### 3. 监控和日志

- 设置应用监控
- 配置错误追踪
- 定期备份数据库

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产启动
npm start

# 数据库操作
npm run db:generate     # 生成 Prisma Client
npm run db:migrate      # 运行生产迁移
npm run db:migrate:dev  # 运行开发迁移
npm run db:seed         # 运行种子数据
npm run db:studio       # 打开 Prisma Studio

# Docker
docker build -t english-idea .
docker-compose up -d
```

## 故障排除

### 数据库连接问题

1. 检查 `DATABASE_URL` 配置
2. 确认数据库服务状态
3. 运行 `npx prisma db push` 同步数据库

### 构建问题

1. 删除 `.next` 文件夹
2. 运行 `npm run build`
3. 检查依赖版本兼容性

### 权限问题

1. 确认文件权限
2. 检查数据库读写权限
3. 确认端口可用性

## 默认账户

- 用户名: `admin`
- 密码: `admin123`

**⚠️ 生产环境请立即修改默认密码！**
