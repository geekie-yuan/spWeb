# 学生信息管理系统

一个基于 React + TypeScript + Vite 构建的现代化学生信息管理系统前端项目。

## 🚀 项目特性

- **现代化技术栈**: React 18 + TypeScript + Vite
- **UI 组件库**: Ant Design 5.x
- **路由管理**: React Router v7
- **状态管理**: React Context + useReducer
- **HTTP 客户端**: Axios
- **代码规范**: Biome (ESLint + Prettier 的替代方案)

## 🎯 功能模块

### 用户认证
- 教师/学生双角色登录
- JWT Token 认证
- 路由权限控制
- 自动登录状态保持

### 学生管理 (教师权限)
- 学生列表查看与搜索
- 添加新学生
- 编辑学生信息
- 删除学生记录
- 批量操作支持

### 个人信息 (学生权限)
- 查看个人信息
- 个人资料展示

### 系统功能
- 响应式侧边栏导航
- 面包屑导航
- 404 错误页面
- 未授权访问处理
- 加载状态指示

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | 核心框架 |
| TypeScript | 5.6.2 | 类型安全 |
| Vite | 6.0.5 | 构建工具 |
| Ant Design | 5.25.3 | UI组件库 |
| React Router | 7.6.1 | 路由管理 |
| Axios | 1.9.0 | HTTP客户端 |
| Day.js | 1.11.13 | 日期处理 |

## 📦 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 开发环境
```bash
npm run dev
# 或
pnpm dev
```

访问 http://localhost:5173

### 生产构建
```bash
npm run build
# 或
pnpm build
```

### 预览构建结果
```bash
npm run preview
# 或
pnpm preview
```

## 🏗️ 项目结构

```text
src/
├── components/          # 公共组件
│   └── ProtectedRoute.tsx
├── contexts/           # React Context
│   └── AuthContext.tsx
├── layouts/            # 布局组件
│   └── MainLayout.tsx
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表盘
│   ├── Login.tsx       # 登录页
│   ├── StudentList.tsx # 学生列表
│   ├── AddStudent.tsx  # 添加学生
│   ├── MyInfo.tsx      # 个人信息
│   ├── Unauthorized.tsx # 无权限页面
│   └── NotFound.tsx    # 404页面
├── services/           # API服务
│   └── api.ts
├── types/              # TypeScript类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── request.ts      # Axios配置
├── App.tsx             # 应用根组件
└── main.tsx            # 应用入口
```

## 🔐 用户角色与权限

### 教师 (Teacher)
- 访问学生管理相关功能
- 查看所有学生列表
- 添加、编辑、删除学生信息
- 访问系统仪表盘

### 学生 (Student)
- 查看个人信息
- 访问系统仪表盘
- 无法访问学生管理功能

## 🌐 API 集成

项目设计为与 Spring Boot 后端集成，支持以下 API 端点：

### 认证接口
- `POST /admin/login` - 教师登录
- `POST /user/login` - 学生登录

### 学生管理接口
- `GET /admin/students/all` - 获取学生列表
- `POST /admin/students` - 添加学生
- `PUT /admin/students/{id}` - 更新学生信息
- `DELETE /admin/students/{id}` - 删除学生

## 📱 部署

### 部署到 Spring Boot
1. 构建项目: `npm run build`
2. 将 `dist` 目录下的文件复制到 Spring Boot 的 `src/main/resources/static` 目录
3. 详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 独立部署
构建后的文件可以部署到任何静态文件服务器，如 Nginx、Apache 等。


## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

