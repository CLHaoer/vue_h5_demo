# Vue 3.5 H5 项目模板

这是一个基于 Vue 3.5 + TypeScript + Vite + Vant UI 的移动端 H5 项目模板，已集成了多种实用功能和最佳实践。本模板旨在提供一个高效、现代化的移动端开发环境，帮助开发者快速启动新项目。

## 在线预览
[在线演示](https://your-demo-url.com) (开发中)

## 主要功能
- 📱 移动端优先，完美适配各种屏幕尺寸
- 🚀 基于 Vite 的极速开发体验
- 📦 组件自动按需引入
- 🎨 可配置的主题定制
- 🔒 TypeScript 类型安全
- 📊 状态管理解决方案
- 🌐 灵活的网络请求封装

## 技术栈
- Vue 3.5
- TypeScript 5.7+
- Vite 6.3+
- Vant UI 4.8+
- Pinia 3.0+ (状态管理)
- Vue Router 4+ (路由管理)
- TailwindCSS 4.1+ (原子化CSS)
- Axios (网络请求)
- SCSS
- PostCSS (pxtorem)
- VConsole (移动端调试)
- unplugin-auto-import / unplugin-vue-components (自动导入)
- @vant/auto-import-resolver (Vant 组件自动导入)
- Pinia 持久化插件

## 特性
- 移动端 rem 适配
- Vant UI 组件库集成与自动导入
- Pinia 状态管理 (支持持久化)
- 模块化路由配置
- 高级 Axios 封装 (拦截器、重试、取消请求等)
- TailwindCSS 原子化 CSS 支持
- 环境变量配置
- TypeScript 类型支持
- 路径别名 `@` -> `src`
- VConsole 移动端调试支持
- typings 自动生成（`src/typings/auto-import.d.ts`、`src/typings/components.d.ts`）

## 目录结构
```
src/
├── api/                # API 接口
├── assets/             # 静态资源
│   └── styles/         # 全局样式
├── components/         # 公共组件
├── layout/             # 布局组件
├── router/             # 路由配置
│   └── modules/        # 路由模块
├── stores/             # Pinia 状态
│   └── modules/        # 状态模块
├── typings/            # 自动生成的类型声明
├── utils/              # 工具函数
│   ├── http.ts         # Axios 封装
│   └── rem.ts          # rem 适配
└── views/              # 页面视图
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建后的项目
pnpm preview
```

## 移动端适配指南

### Rem 适配方案
本项目使用 `postcss-pxtorem` 插件自动将 px 转换为 rem。基准值为 37.5px（与 Vant UI 保持一致）。

- 设计稿基准：375px 宽度
- 开发要点：
  - 直接使用设计稿标注的 px 值进行开发
  - 插件会自动按照 1:37.5 的比例转换为 rem
  - 添加 `.norem` 类名可以禁用 px 转 rem
  - 支持 media query 中的 px 转换
  
### 适配建议
- 使用 vw、vh 处理边界场景
- 使用 Vant 内置的响应式布局工具类
- 避免使用固定宽度，推荐使用 flex 布局
- 字体大小建议使用 rem 或 vw 单位

## TailwindCSS

已集成 TailwindCSS 4.x，支持原子化 CSS。tailwind.config.js 已适配 Vant 设计规范，单位均为 rem。默认关闭 preflight，避免与 Vant 样式冲突。

## 自动导入

已集成 `unplugin-auto-import` 和 `unplugin-vue-components`，支持 Vue、Vue Router、Pinia 相关 API 及 Vant 组件的自动导入，无需手动 import。类型声明自动生成于 `src/typings/` 目录。

## VConsole

内置 VConsole，方便移动端调试。

## 环境变量

项目使用环境变量来区分开发和生产环境：
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 代码规范与最佳实践

### 编码规范
- 使用 TypeScript 的严格模式
- 组件使用 `<script setup lang="ts">` 语法
- 使用 ESLint + Prettier 保持代码风格统一
- 遵循 Vue3 组合式 API 风格指南

### 组件开发规范
- 组件文件使用 PascalCase 命名
- Props 必须指定类型和默认值
- 使用 `defineEmits` 声明事件
- 组合式函数（Composables）放置在 `hooks` 目录

### Git 提交规范
提交信息格式：`<type>(<scope>): <subject>`
- type: feat, fix, docs, style, refactor, test, chore
- scope: 影响范围
- subject: 简短描述

示例：
```bash
git commit -m "feat(login): 添加微信登录功能"
git commit -m "fix(ui): 修复按钮样式问题"
```

### 项目发布流程
1. 更新版本号
2. 生成更新日志
3. 执行构建
4. 执行测试
5. 发布生产环境

## 常见问题

### 开发相关
1. 如何添加新页面？
   - 在 `views` 目录创建页面组件
   - 在 `router/modules` 添加路由配置
   - 更新 `router/index.ts`

2. 如何处理环境变量？
   - 开发环境：`.env.development`
   - 生产环境：`.env.production`
   - 命名规则：必须以 `VITE_` 开头

3. 网络请求最佳实践
   - 统一使用 `api` 目录下的请求函数
   - 处理错误响应
   - 添加请求缓存
   - 使用取消令牌

### 性能优化
- 路由懒加载
- 组件按需引入
- 图片资源优化
- 开启 Gzip 压缩
- 合理使用 keep-alive
- 虚拟列表处理长列表

## 更新日志

### [1.0.0] - 2025-05-22
- 🎉 初始版本发布
- 📦 集成基础开发环境
- 🎨 添加移动端适配方案
- 🚀 配置自动化构建流程

## 开源协议
MIT License - 详见 LICENSE 文件
