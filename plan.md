# 移动端资讯产品功能开发设计文档

## 1. 项目概述
本项目旨在开发一个简易的移动端资讯产品，包含前后端。
- **前端**: Vue 3 + Vite + Vant (移动端UI库)
- **后端**: Node.js (Express) + MySQL (关系型数据库)
- **部署**: 线上环境

## 2. 文件目录结构

采用前后端分离结构。

```text
project-root/
├── client/                 # 前端项目 (Vue 3)
│   ├── public/
│   ├── src/
│   │   ├── api/            # 接口请求
│   │   │   ├── index.js    # Axios 封装
│   │   │   ├── auth.js     # 登录注册接口
│   │   │   └── post.js     # 内容相关接口
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 公共组件
│   │   │   ├── TabBar.vue  # 底部导航
│   │   │   ├── PostItem.vue # 信息流单条内容
│   │   │   └── ImageUploader.vue # 图片上传组件
│   │   ├── router/         # 路由配置
│   │   │   └── index.js
│   │   ├── stores/         # 状态管理 (Pinia)
│   │   │   └── user.js     # 用户登录状态
│   │   ├── views/          # 页面视图
│   │   │   ├── Auth/
│   │   │   │   ├── Login.vue    # 登录页
│   │   │   │   └── Register.vue # 注册页
│   │   │   ├── Home.vue         # 首页 (Feed流)
│   │   │   ├── PostDetail.vue   # 内容详情页
│   │   │   └── Editor.vue       # 发布/编辑页
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # 后端项目 (Node.js + Express)
│   ├── config/
│   │   └── db.js           # 数据库连接配置
│   ├── controllers/        # 业务逻辑控制器
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── aiController.js # (挑战) AI相关逻辑
│   ├── middleware/         # 中间件
│   │   ├── auth.js         # JWT 认证
│   │   └── upload.js       # 图片上传处理 (Multer)
│   ├── models/             # 数据库模型 (Sequelize)
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/             # 路由定义
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── uploads/            # 静态资源存储 (图片)
│   ├── app.js              # 入口文件
│   └── package.json
└── README.md
```

## 3. 开发计划

开发将分为三个阶段：基础架构搭建、核心功能实现、挑战功能扩展。

### 第一阶段：基础架构与用户认证 (Day 1-2)
**目标**：完成项目初始化，实现登录注册功能。

| 文件/模块 | 任务描述 |
| :--- | :--- |
| **Server** | |
| `server/app.js` | 初始化 Express 应用，配置 CORS，静态资源目录。 |
| `server/config/db.js` | 连接 MySQL 数据库 (Sequelize)。 |
| `server/models/User.js` | 定义用户 Model (username, password_hash)。 |
| `server/controllers/authController.js` | 实现 `register` (注册) 和 `login` (登录，签发 JWT) 逻辑。 |
| `server/routes/authRoutes.js` | 定义 `/api/auth/register` 和 `/api/auth/login` 路由。 |
| **Client** | |
| `client/src/api/index.js` | 封装 Axios，配置拦截器 (请求头携带 Token)。 |
| `client/src/router/index.js` | 配置路由，设置路由守卫 (未登录跳转登录页)。 |
| `client/src/stores/user.js` | 定义 User Store，处理登录状态存储 (LocalStorage) 和登出。 |
| `client/src/views/Auth/Login.vue` | 登录页面 UI，调用登录接口。 |
| `client/src/views/Auth/Register.vue` | 注册页面 UI，调用注册接口。 |

### 第二阶段：内容发布与管理 (Day 3-5)
**目标**：实现短图文的发布、图片上传、编辑功能。

| 文件/模块 | 任务描述 |
| :--- | :--- |
| **Server** | |
| `server/models/Post.js` | 定义内容 Model (author, content, images(JSON), createdAt, updatedAt)。 |
| `server/middleware/upload.js` | 配置 Multer，支持图片上传至 `uploads/` 目录。 |
| `server/middleware/auth.js` | JWT 验证中间件，保护发布/修改接口。 |
| `server/controllers/postController.js` | 实现 `createPost` (发布), `updatePost` (修改), `uploadImage` (上传图片)。 |
| `server/routes/postRoutes.js` | 定义 `/api/posts` (POST), `/api/posts/:id` (PUT), `/api/upload` 路由。 |
| **Client** | |
| `client/src/components/ImageUploader.vue` | 封装图片选择与上传组件，回显图片 URL。 |
| `client/src/views/Editor.vue` | 编辑器页面。支持输入文字，插入图片。根据路由参数判断是“新建”还是“编辑”。 |
| `client/src/api/post.js` | 封装发布、修改、上传图片的 API 调用。 |

### 第三阶段：信息流与详情页 (Day 6-8)
**目标**：实现首页 Feed 流展示、滚动加载、内容详情查看。

| 文件/模块 | 任务描述 |
| :--- | :--- |
| **Server** | |
| `server/controllers/postController.js` | 实现 `getPosts` (分页查询，按时间倒序), `getPostById` (详情)。 |
| `server/routes/postRoutes.js` | 定义 `/api/posts` (GET), `/api/posts/:id` (GET) 路由。 |
| **Client** | |
| `client/src/components/PostItem.vue` | 单条内容的展示组件 (头像、昵称、时间、摘要、图片九宫格)。 |
| `client/src/views/Home.vue` | 首页。使用 Vant 的 `List` 组件实现滚动加载 (Infinite Scroll)。调用 `getPosts`。 |
| `client/src/views/PostDetail.vue` | 详情页。展示完整内容。调用 `getPostById`。 |
| `client/src/components/TabBar.vue` | 底部导航栏，切换首页/发布页/个人中心(可选)。 |

### 第四阶段：挑战功能扩展 (Day 9-12)
**目标**：完成 AI 能力接入、草稿箱、性能优化等加分项。

| 文件/模块 | 任务描述 |
| :--- | :--- |
| **AI 能力** | |
| `server/controllers/aiController.js` | 集成 OpenAI SDK 调用火山引擎。实现 `analyzeTags` (生成标签) 和 `recommendTopic` (推荐话题)。 |
| `server/models/Post.js` | 增加 `tags` 字段存储 AI 识别的标签。 |
| `client/src/views/PostDetail.vue` | 详情页展示 AI 推荐话题，点击跳转发布页。 |
| **草稿与体验** | |
| `client/src/views/Editor.vue` | 增加 `setInterval` 自动保存草稿到 LocalStorage (断网支持) 和 服务端 (联网支持)。 |
| `client/src/views/Home.vue` | 增加下拉刷新 (`PullRefresh` 组件)。 |
| **性能优化** | |
| `client/vite.config.js` | 配置打包分包策略，Gzip 压缩。 |
| `client/src/components/PostItem.vue` | 图片使用懒加载 (`v-lazy`)。 |
| **富文本编辑** | |
| `client/src/views/Editor.vue` | 集成富文本编辑器 (VueQuill)，支持文本格式化。 |
| `client/src/views/PostDetail.vue` | 支持 HTML 内容渲染。 |
| `client/src/components/PostItem.vue` | 列表页展示时去除 HTML 标签，仅展示纯文本摘要。 |

## 4. 优先级说明

1.  **P0 (必须完成)**:
    -   用户登录、注册、退出。
    -   短图文发布（文字+图片）。
    -   首页 Feed 流（按时间排序、滚动加载）。
    -   内容详情页展示。
    -   部署上线。

2.  **P1 (推荐完成)**:
    -   内容的二次编辑修改。
    -   下拉刷新。

3.  **P2 (挑战功能)**:
    -   AI 标签识别与话题推荐。
    -   自动草稿保存（断网/联网）。
    -   性能优化指标达标。
    -   富文本编辑支持。

## 5. 已实现的功能更新 (Implemented Updates)

在开发过程中，根据需求变更和优化，新增了以下功能和改进：

### 5.1 UI/UX 重构
- **风格定制**:
  - 全局采用“今日头条”风格，主色调调整为红色 (`#d43d3d`)。
  - 首页头部导航栏自定义，移除默认 Vant 样式，增加品牌感。
  - 登录/注册页面参考“大众点评”风格，采用极简白底 + 橙色渐变按钮，优化输入框交互。
- **汉化**:
  - 全站所有提示语、按钮、占位符均已汉化，符合中文用户习惯。

### 5.2 新增功能模块
- **密码重置**:
  - 后端新增 `resetPassword` 接口。
  - 前端新增 `ResetPassword.vue` 页面，支持通过账号重置密码。
- **标题字段**:
  - 数据库 `Post` 模型新增 `title` 字段。
  - 编辑器新增标题输入框，发布时强制要求填写标题。
  - 首页列表仅展示标题和元数据，不再展示正文摘要。
- **编辑入口优化**:
  - 详情页顶部导航栏增加“编辑”图标。
  - 仅当当前登录用户为文章作者时显示该图标，点击直接进入编辑模式。

### 5.3 组件与交互优化
- **智能列表布局 (`PostItem.vue`)**:
  - 实现三种展示模式：
    1. **单图模式**: 标题在左，图片在右（经典新闻布局）。
    2. **多图模式**: 标题在上，下方展示三张图片网格。
    3. **无图模式**: 仅展示标题和元数据。
- **编辑器升级 (`Editor.vue`)**:
  - 界面重构：移除顶部 NavBar，改为全屏沉浸式编辑体验。
  - 底部工具栏：富文本工具栏固定在底部，键盘弹出时自动适配。
  - 交互优化：取消按钮直接返回首页，避免路由回退死循环。
- **AI 深度集成**:
  - 详情页 AI 推荐话题展示优化，点击直接跳转编辑器并自动填充话题。
