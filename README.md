# 博客

第n个版本的博客了。从hexo->hugo->valaxy，再到~~自己开发~~的Ami，用来一段时间不满意，又重新开发了。

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
