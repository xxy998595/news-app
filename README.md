# Mobile News App (移动端新闻资讯应用)

这是一个基于 Vue 3 + Node.js + MySQL 开发的移动端新闻资讯 Web 应用。支持用户注册登录、发布文章、浏览资讯、AI 话题推荐等功能。

## 功能特性

- **移动端适配**: 采用 Vant UI，完美适配移动端操作体验。
- **用户系统**: 完整的注册、登录、密码重置流程 (JWT 认证)。
- **内容创作**: 富文本编辑器，支持图片上传、草稿自动保存。
- **AI 赋能**: 集成 AI 模型，根据文章内容自动推荐相关话题。
- **图片管理**: 支持多图上传，详情页大图预览。
- **高性能**: 前后端分离，Vite 极速构建。

## 技术栈

- **前端**: Vue 3, Vite, Pinia, Vant 4, Axios, Vue Router
- **后端**: Node.js, Express, Sequelize, MySQL
- **AI**: Volcengine Ark (Doubao Model)

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/xxy998595/news-app.git
cd news-app
```

### 2. 后端设置

```bash
cd server
npm install

# 配置环境变量
# 复制 .env.example 为 .env 并填入数据库和 AI 配置
cp .env.example .env

# 启动后端
npm run dev
```

### 3. 前端设置

```bash
cd client
npm install

# 启动前端
npm run dev
```

## 目录结构

- `client/`: 前端 Vue 项目源码
- `server/`: 后端 Express 项目源码
- `plan.md`: 开发计划与进度记录

## 部署

本项目支持一键部署到云平台：

- **前端**: 推荐使用 [Vercel](https://vercel.com)
- **后端**: 推荐使用 [Railway](https://railway.app)

详细部署指南请参考 `项目技术文档.md`。

## 许可证

MIT License
