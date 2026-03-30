---
title: Nuxt 3 部署到 Vercel 完整指南
description: 手把手教你将 Nuxt 3 项目部署到 Vercel，包括常见问题解决方案
date: 2026-03-10
tags: [nuxt, vercel, deployment]
---

# Nuxt 3 部署到 Vercel 完整指南

Vercel 是部署 Nuxt 3 项目的绝佳选择。本文详细介绍部署流程。

## 准备工作

1. Vercel 账号 (免费)
2. GitHub 仓库
3. Nuxt 3 项目

## 创建 vercel.json

在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run generate",
  "outputDirectory": ".output/public",
  "installCommand": "npm install"
}
```

## 设置环境变量

在 Vercel Dashboard 中添加：

```
NUXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

## 常见问题

### 1. 样式不生效

确保 CSS 文件正确引入：

```typescript
// nuxt.config.ts
app: {
  css: ['~/assets/css/main.css']
}
```

### 2. 图片路径问题

使用 `@nuxt/image` 的 `<NuxtImg>` 组件：

```vue
<NuxtImg
  src="/images/logo.png"
  width="200"
  height="100"
  alt="Logo"
/>
```

### 3. SSG vs SSR

Nuxt 3 支持两种渲染模式：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true  // 服务端渲染
  // 或
  ssr: false // 纯客户端渲染
})
```

## 部署步骤

1. 登录 Vercel
2. Import GitHub 仓库
3. Configure Project（会自动检测 Nuxt）
4. Deploy！

## 自动化部署

每次推送到 `main` 分支，Vercel 会自动重新部署。

---

有问题？评论区见！
