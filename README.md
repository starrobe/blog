# 黑白简约静态博客

Nuxt 4 + Nuxt Content 3 构建的黑白极简博客,以「纸质文件」为视觉隐喻。

## 开发

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm test       # 单元测试
pnpm generate   # 静态生成到 .output/public
```

## 写文章

在 `content/posts/` 下新建 `.md`,frontmatter:

```yaml
---
title: 标题
date: '2026-09-20'
tags: [标签1, 标签2]
summary: 摘要
hidden: false   # true 则隐藏(不生成页面)
---
```

文章编号自动按日期生成;可选 `order` 字段覆盖排序。
