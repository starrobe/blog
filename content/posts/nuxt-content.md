---
title: 用 Nuxt Content 写文章
date: '2026-09-21'
tags: [技术, Nuxt]
summary: 介绍 Nuxt Content 3 的内容模型与查询方式。
---

# 用 Nuxt Content 写文章

Nuxt Content 3 用 `queryCollection` 查询内容,`<ContentRenderer>` 渲染。

```vue
<script setup lang="ts">
const { data } = await useAsyncData(() => queryCollection('posts').all())
</script>
```
