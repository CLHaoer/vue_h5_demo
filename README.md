# Vue 3.5 H5 项目模板

这是一个基于 Vue 3.5 + TypeScript + Vite + Vant UI 的移动端 H5 项目模板，已集成了多种实用功能。

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

## 关于 rem 适配

本项目使用 `postcss-pxtorem` 插件自动将 px 转换为 rem。基准值为 37.5px（与 Vant UI 保持一致）。

设计稿以 375px 宽度为基准，开发时可以直接按照设计稿标注的 px 值进行开发，插件会自动转换为 rem。

如果某些样式不需要转换为 rem，可以添加 `.norem` 类名。

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

## 依赖说明

请确保使用 Node.js 18.x，pnpm 7.x 及以上版本。

---
