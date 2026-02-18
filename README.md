# 助销云助手 (SalesBoost)

![iOS HIG Style](https://img.shields.io/badge/UI-iOS_HIG-007AFF)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Express_|_MySQL-blue)
![Storage](https://img.shields.io/badge/Storage-Aliyun_OSS-orange)

助销云助手是一个面向销售团队的移动优先（Mobile-first）任务激励与协作系统。它旨在通过积分激励机制提升团队执行力，并采用 Apple Human Interface Guidelines (HIG) 风格设计，提供原生 App 般的丝滑体验。

## ✨ 核心功能

### 👔 老板/管理员端 (Boss Module)
- **任务发布**：支持标题、描述、奖励积分、配图（阿里云 OSS）及截止日期设置。
- **审核机制**：实时接收员工提交，支持一键审批（自动发放积分）或驳回（填写理由）。
- **人员管理**：员工账号增删改查，实时查看全员积分排行。
- **数据概览**：掌握所有任务的执行与完成情况。

### 🏃 员工端 (Staff Module)
- **任务大厅**：浏览所有活动中的激励任务，查看奖励详情。
- **任务提交**：支持填写说明与上传图片，实时跟踪审核进度。
- **积分排行榜**：iOS 风格列表展示，支持 🥇🥈🥉 奖牌区分，激发竞争。
- **个人中心**：管理个人资料，查看积分历史。

## 🛠️ 技术栈

- **前端**：React 18 + Vite + React Router 6 (iOS HIG 界面重构)
- **后端**：Node.js + Express
- **数据库**：MySQL + Sequelize ORM
- **文件存储**：阿里云 OSS (支持流式上传)
- **认证**：JWT (JSON Web Tokens)
- **UI 风格**：Apple Human Interface Guidelines (San Francisco 字体、圆角卡片、毛玻璃效果、胶囊按钮)

## 📂 项目结构

```
salesboost/
├── server/              # 后端服务
│   ├── config/          # 数据库与环境配置
│   ├── controllers/     # 业务逻辑控制器
│   ├── models/          # Sequelize 数据模型
│   ├── routes/          # API 路由
│   └── utils/           # 工具类（OSS、加密等）
├── client/              # 前端应用
│   ├── src/
│   │   ├── api/         # Axios 封装
│   │   ├── components/  # 公共组件（布局、Toast）
│   │   ├── context/     # Auth 认证上下文
│   │   ├── pages/       # 页面组件
│   │   └── utils/       # 通用工具
│   └── index.html
└── DEPLOY.md            # 详细部署文档
```

## 🚀 快速启动

### 1. 克隆项目
```bash
git clone https://github.com/your-username/salesboost.git
cd salesboost
```

### 2. 后端配置
```bash
cd server
npm install
# 根据 .env.example 创建 .env 并配置你的 MySQL 和 阿里云 OSS 密钥
npm start
```

### 3. 前端配置
```bash
cd client
npm install
npm run dev
```
访问 `http://localhost:5173` 即可预览。

## 📑 初始账号
- **工号**：`admin`
- **密码**：`123456`
*(登录后请及时修改密码)*

## ☁️ 部署指南
关于如何将本项目部署到 Ubuntu + Nginx + PM2 并在公网环境下运行，请参阅 [DEPLOY.md](./DEPLOY.md)。

## 📄 开源协议
[MIT License](LICENSE)
