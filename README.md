# 黑白简约静态博客

Nuxt 4 + Nuxt Content 3 构建的黑白极简博客，以「纸质文件」为视觉隐喻——首页是一份份可滑动、可切换方向的纸质卡片封面流，左上角是单笔画描边动画的 Logo。

## 特性

- **封面流首页**：文章以纸质卡片排列，垂直/水平切换，滚轮/触摸无限循环滑动，停止时自动吸附居中。
- **单笔画 Logo 动画**：描边 → 停顿 → 擦除循环。
- **文章页**：代码高亮（shiki）、KaTeX 数学公式、块级 reveal 动画、回到顶部按钮。
- **标签聚合**：每篇文章可打多个标签，自动生成标签页。

## 技术栈

- Nuxt 4 + `@nuxt/content` 3（内容来自 `content/posts/*.md`）
- pnpm
- KaTeX（`remark-math` + `rehype-katex`）
- shiki 代码高亮（`github-dark`）
- Vitest

## 开发

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm test       # 单元测试
pnpm generate   # 静态生成到 .output/public
```

## 写文章

在 `content/posts/` 下新建 `.md`，frontmatter：

```yaml
---
title: 标题
date: '2026-09-20'
tags: [标签1, 标签2]
summary: 摘要
hidden: false   # true 则隐藏（不生成页面）
order: 可选      # 覆盖排序（默认按日期升序，编号自动生成）
---
```

## 部署到 Cloudflare Pages（Git 集成）

1. 把仓库推送到 GitHub。
2. 打开 Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，授权并选择本仓库。
3. 配置构建：

   | 字段 | 值 |
   |---|---|
   | Build command | `pnpm generate` |
   | Build output directory | `.output/public` |

   pnpm 会从 `pnpm-lock.yaml` 自动识别；Node 版本由 `.node-version`（22）指定。
4. **Deploy**，之后每次 push 到 `main` 会自动重新部署。

> 注意：首页封面流在静态生成时只渲染可见窗口内的卡片，`nuxt.config.ts` 已显式预渲染全部文章路由，避免个别文章被 `crawlLinks` 漏掉。
