---
title: 现代 CSS Grid 布局实战
description: 通过实际案例学习 CSS Grid 布局，掌握二维排版的精髓
date: 2026-03-05
tags: [css, grid, layout]
---

# 现代 CSS Grid 布局实战

CSS Grid 是目前最强大的布局工具。本文通过实际案例带你掌握它。

## 基础网格

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

## 响应式网格

自动适应列数：

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

## 经典 12 栏系统

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-12 { grid-column: span 12; }
```

## 圣杯布局

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-column: 1 / -1; }
.sidebar-left { grid-column: 1; }
.main { grid-column: 2; }
.sidebar-right { grid-column: 3; }
.footer { grid-column: 1 / -1; }
```

## 网格区域命名

更直观的布局写法：

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## 实战：图片画廊

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.gallery img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

## 浏览器支持

目前所有现代浏览器都支持 CSS Grid，无需额外 polyfill。

---

掌握 Grid，让你的布局代码更简洁！
