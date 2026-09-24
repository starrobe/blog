# 项目说明

黑白极简静态博客（Nuxt 4 + Nuxt Content 3），以「纸质文件」为视觉隐喻：首页是一份份可滑动、可切换方向的纸质卡片，左上角是一个描边动画的 Logo。

## 技术栈

- Nuxt 4.5 + `@nuxt/content` 3.16（内容由 `content/posts/*.md` 提供）
- pnpm
- KaTeX（数学公式，`remark-math` + `rehype-katex`）+ shiki（代码高亮，主题 `github-dark`）
- Vitest（单元测试）

## 常用命令

```bash
pnpm dev        # 开发服务器
pnpm test       # 单元测试
pnpm generate   # 静态生成到 .output/public
```

## 目录结构

| 路径 | 作用 |
|---|---|
| `app.vue` | 全局布局 + 左上角 Logo（单笔画动画）|
| `pages/index.vue` | 首页，渲染 `Coverflow` |
| `pages/posts/[slug].vue` | 文章页（黑底白字、reveal 动画、回到顶部按钮）|
| `pages/tags/[tag].vue` | 标签聚合页 |
| `components/Coverflow.vue` | 封面流（核心：垂直/水平无限循环卡片流）|
| `components/PaperCard.vue` | 纸质卡片 |
| `components/GrainOverlay.vue` | 胶片噪点层 |
| `utils/coverflow.ts` | 封面流克隆计算（`computeCoverflowClones`）|
| `utils/posts.ts` | 文章排序 + 编号（`sortAndIndex`）|
| `utils/plaintext.ts` | 正文转纯文本 + 阅读时长 |
| `content/posts/*.md` | 文章（markdown，frontmatter 见下）|
| `assets/css/main.css` | 全局样式 + Logo 动画 keyframes |
| `tests/unit/*.test.ts` | 单元测试 |

## 文章 frontmatter

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

## 核心特性

1. **封面流首页**：文章以纸质卡片排列，垂直/水平切换（切换时旋转动画），滚轮/触摸无限循环滑动。
2. **Logo 动画**：单笔画细线——中心线做 `stroke-width="25"` 的圆头描边、无 mask，`stroke-dasharray` 循环（描边 → 停顿 → 擦除），用 `pathLength="1"` 归一化。
3. **文章页**：代码高亮、KaTeX 公式、块级 reveal 动画、回到顶部按钮。

## 注意事项（避免踩坑）

- **Logo 是「实心带」不是「线」**：swoosh 是粗细变化的填充形状，「单笔画细线（均匀粗细）」和「可变粗细（填充）」本质冲突、不可兼得。最终选择单笔画细线，放弃了粗头细尾。详情见项目记忆 `logo-filled-band-not-line`。
- **Logo 源文件在用户主目录**：`~/logo.svg`（swoosh 形状）和 `~/v1.svg`（中心线单笔画），不在仓库内。改 Logo 时从这两个文件导出、映射坐标后写入 `app.vue`。
- **旧方案已清理**：早前的「填充方案（mask + 宽描边）」和「轮廓描边（3 条 path）」都已废弃，当前只有一条 `logo-path`。别再把孔做单独描边（会重复描边）。
- 字体在 `main.css` 的 `:root` 里定义（JetBrains Mono / Inter + 中文黑体）。
