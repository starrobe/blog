# 黑白简约静态博客 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Nuxt 4 + Nuxt Content 3 构建一个黑白极简风格、以「纸质文件」为隐喻、带丝滑动效的静态博客。

**Architecture:** Nuxt 4 静态生成;Nuxt Content 3 用 `content.config.ts` 定义 posts 集合与 Zod schema,`queryCollection` 查询,`<ContentRenderer>` 渲染 Markdown。首页是一个可垂直/水平切换的无限循环封面流(Coverflow),核心算法抽成纯函数以便单元测试。可测试逻辑放在 `utils/`(纯函数,不依赖 Nuxt 运行时),组件放在 `components/`,页面在 `pages/`。

**Tech Stack:** Nuxt 4.5.2、Vue 3、Nuxt Content 3.16.0、pnpm、Vitest、TypeScript。

**Spec:** `docs/superpowers/specs/2026-09-20-static-blog-design.md`

## Global Constraints

- 包管理器:**pnpm**(已装 12.4.2)。
- 框架版本:**Nuxt 4.5.2**(`pnpm add nuxt` 用 latest)。
- 内容模块:**Nuxt Content 3.16.0**(`pnpm add @nuxt/content`)。
- 静态生成命令:`pnpm generate`(=`nuxt generate`)。
- 配色:黑底 `#0a0a0a`,白纸 `#ffffff`,黑字 `#111111`,灰阶仅作次级信息/阴影。
- frontmatter `date` 用**字符串** `'YYYY-MM-DD'`(避免 Zod date 解析歧义),schema 里 `date: z.string()`。
- 文章编号(index)自动生成,按 date 升序,`order` 字段可选覆盖;**不在 frontmatter 手写 index**。
- 隐藏文章:`hidden: true` 不出现在任何列表/搜索,且不生成独立页面。
- 无关于页。顶部导航仅「站点标题 + 搜索入口」,fixed 悬浮。
- 组件文件用 `<script setup lang="ts">`。

---

### Task 1: 项目脚手架与依赖

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `app.vue`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: 可运行的 Nuxt dev 环境、静态生成配置、Vitest 测试环境。后续所有任务依赖此骨架。

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "blog",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: 安装依赖**

Run:
```bash
pnpm add nuxt@latest
pnpm add @nuxt/content@latest
pnpm add -D vitest
```

Expected: `pnpm add nuxt` 装到 4.5.x;`@nuxt/content` 装到 3.16.x。

- [ ] **Step 3: 写 nuxt.config.ts**

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
```

- [ ] **Step 4: 写 app.vue(最小可运行)**

```vue
<template>
  <NuxtPage />
</template>
```

- [ ] **Step 5: 写 tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

- [ ] **Step 6: 写 vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
})
```

- [ ] **Step 7: 验证 dev server 可启动**

Run: `pnpm dev`
Expected: 终端输出 Nuxt 启动成功,访问 `http://localhost:3000` 显示 Nuxt 默认欢迎页。验证后停止 dev。

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml nuxt.config.ts app.vue tsconfig.json vitest.config.ts
git commit -m "chore: scaffold Nuxt 4 project with content module and vitest"
```

---

### Task 2: 内容集合 schema + 示例文章 + 排序纯函数

**Files:**
- Create: `content.config.ts`
- Create: `content/posts/hello-world.md`
- Create: `content/posts/nuxt-content.md`
- Create: `content/posts/draft-hidden.md`(hidden 示例)
- Create: `utils/posts.ts`
- Test: `tests/unit/posts.test.ts`

**Interfaces:**
- Consumes: Task 1 的 Nuxt + content 骨架。
- Produces:
  - collection 名 `posts`,source `posts/*.md`,schema 字段:`title: string`、`date: string`、`tags: string[]`、`summary: string`、`hidden: boolean`、`order?: number`。
  - `sortAndIndex<T extends { order?: number; date: string }>(posts: T[]): (T & { index: string })[]` —— 按 `order ?? date` 升序排序,附加 `index` 字符串(`'01'`,`'02'`…)。

- [ ] **Step 1: 写失败测试 tests/unit/posts.test.ts**

```ts
import { describe, it, expect } from 'vitest'
import { sortAndIndex } from '../../utils/posts'

describe('sortAndIndex', () => {
  it('按 date 升序排序并生成两位编号', () => {
    const posts = [
      { title: 'B', date: '2026-09-21', tags: [] },
      { title: 'A', date: '2026-09-20', tags: [] },
      { title: 'C', date: '2026-09-22', tags: [] }
    ]
    const result = sortAndIndex(posts)
    expect(result.map(p => p.title)).toEqual(['A', 'B', 'C'])
    expect(result.map(p => p.index)).toEqual(['01', '02', '03'])
  })

  it('order 字段覆盖 date 排序', () => {
    const posts = [
      { title: 'B', date: '2026-09-20', order: 2 },
      { title: 'A', date: '2026-09-22', order: 1 },
      { title: 'C', date: '2026-09-21' }
    ]
    const result = sortAndIndex(posts)
    // C 无 order,按 date 2026-09-21 排;A(order 1)最前,B(order 2)其次
    expect(result.map(p => p.title)).toEqual(['A', 'B', 'C'])
  })

  it('编号补齐为两位(10 篇以上仍正常)', () => {
    const posts = Array.from({ length: 12 }, (_, i) => ({
      title: `P${i}`,
      date: `2026-01-${String(i + 1).padStart(2, '0')}`
    }))
    const result = sortAndIndex(posts)
    expect(result[0].index).toBe('01')
    expect(result[9].index).toBe('10')
    expect(result[11].index).toBe('12')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '../../utils/posts'`。

- [ ] **Step 3: 写 utils/posts.ts**

```ts
export function sortAndIndex<T extends { order?: number; date: string }>(
  posts: T[]
): (T & { index: string })[] {
  const sorted = [...posts].sort((a, b) => {
    const ka = a.order ?? new Date(a.date).getTime()
    const kb = b.order ?? new Date(b.date).getTime()
    return ka - kb
  })
  return sorted.map((p, i) => ({ ...p, index: String(i + 1).padStart(2, '0') }))
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test`
Expected: PASS — 3 个测试通过。

- [ ] **Step 5: 写 content.config.ts**

```ts
import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      source: 'posts/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tags: z.array(z.string()).default([]),
        summary: z.string().default(''),
        hidden: z.boolean().default(false),
        order: z.number().optional()
      })
    })
  }
})
```

- [ ] **Step 6: 写示例文章 content/posts/hello-world.md**

```markdown
---
title: Hello World
date: '2026-09-20'
tags: [随笔]
summary: 第一篇示例文章,用来验证内容层与首页封面流。
---

# Hello World

这是博客的第一篇文章。写点正文,验证 Markdown 渲染与排版。

## 二级标题

- 列表项一
- 列表项二

`code` 行内代码。
```

- [ ] **Step 7: 写 content/posts/nuxt-content.md**

```markdown
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
```

- [ ] **Step 8: 写 content/posts/draft-hidden.md(hidden 示例)**

```markdown
---
title: 未公开草稿
date: '2026-09-19'
tags: [草稿]
summary: 这篇是隐藏的,不应出现在任何列表与搜索中。
hidden: true
---

# 未公开草稿

这是草稿内容,用于验证 `hidden: true` 的隐藏行为。
```

- [ ] **Step 9: Commit**

```bash
git add content.config.ts content/posts utils/posts.ts tests/unit/posts.test.ts
git commit -m "feat: content collection schema, sample posts, and sort/index logic"
```

---

### Task 3: 全局黑白主题 + 站点骨架 + 导航 + 噪点

**Files:**
- Create: `assets/css/main.css`
- Modify: `app.vue`
- Create: `components/SiteNav.vue`
- Create: `components/GrainOverlay.vue`

**Interfaces:**
- Produces:
  - CSS 变量 `--bg`(#0a0a0a)、`--paper`(#ffffff)、`--ink`(#111111)、`--grey`(#888888),字体栈 `--font-serif`/`--font-sans`。
  - 组件 `<SiteNav />`(fixed 顶部,站点标题 + 搜索按钮)、`<GrainOverlay />`(全屏噪点层)。
  - `app.vue` 组装 `SiteNav` + `GrainOverlay` + `<NuxtPage>`。

- [ ] **Step 1: 写 assets/css/main.css**

```css
:root {
  --bg: #0a0a0a;
  --paper: #ffffff;
  --ink: #111111;
  --grey: #888888;
  --line: #333333;
  --font-serif: Georgia, 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

button {
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}
```

- [ ] **Step 2: 写 components/GrainOverlay.vue**

```vue
<template>
  <div class="grain" aria-hidden="true"></div>
</template>

<style scoped>
.grain {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
```

- [ ] **Step 3: 写 components/SiteNav.vue**

```vue
<script setup lang="ts">
const emit = defineEmits<{ openSearch: [] }>()
</script>

<template>
  <header class="nav">
    <NuxtLink to="/" class="brand">BLOG</NuxtLink>
    <button class="search-btn" @click="emit('openSearch')">搜索</button>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  color: #ffffff;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.7), transparent);
}
.brand {
  font-family: var(--font-serif);
  letter-spacing: 0.2em;
  font-weight: 700;
}
.search-btn {
  color: #ffffff;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.search-btn:hover { opacity: 1; }
</style>
```

- [ ] **Step 4: 改 app.vue 组装骨架**

```vue
<script setup lang="ts">
const showSearch = ref(false)
</script>

<template>
  <div class="site">
    <GrainOverlay />
    <SiteNav @open-search="showSearch = true" />
    <NuxtPage />
  </div>
</template>
```

- [ ] **Step 5: 验证 dev server 渲染**

Run: `pnpm dev`
Expected: 打开 `http://localhost:3000`,黑底、顶部悬浮「BLOG + 搜索」,有极淡噪点颗粒。验证后停止。

- [ ] **Step 6: Commit**

```bash
git add assets/css/main.css app.vue components/SiteNav.vue components/GrainOverlay.vue
git commit -m "feat: global monochrome theme, site nav, and grain overlay"
```

---

### Task 4: PaperCard 文档式纸张卡片

**Files:**
- Create: `components/PaperCard.vue`

**Interfaces:**
- Consumes: `--paper`/`--ink`/`--grey`/`--line` CSS 变量(Task 3)。
- Produces: `<PaperCard :post :index :focused>`。props:`post`(含 `title`、`summary`、`date`、`tags`、`slug`)、`index`(编号字符串)、`focused`(boolean,居中聚焦态)。卡片内容自上而下:页眉编号+细线 → 标题 → 摘要 → 底部分隔线+日期+标签。

- [ ] **Step 1: 写 components/PaperCard.vue**

```vue
<script setup lang="ts">
export interface PaperCardPost {
  title: string
  summary: string
  date: string
  tags: string[]
  slug: string
}

const props = defineProps<{
  post: PaperCardPost
  index: string
  focused?: boolean
}>()

const href = computed(() => `/posts/${props.post.slug}`)
</script>

<template>
  <NuxtLink :to="href" class="paper" :class="{ focused }">
    <div class="paper-head">
      <span class="file-no">No. {{ index }}</span>
      <span class="paper-line"></span>
    </div>
    <h3 class="paper-title">{{ post.title }}</h3>
    <p class="paper-summary">{{ post.summary }}</p>
    <div class="paper-foot">
      <span class="paper-line"></span>
      <div class="paper-meta">
        <time>{{ post.date }}</time>
        <span class="tags">{{ post.tags.join(' · ') }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.paper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid #111;
  border-radius: 2px;
  padding: 18px 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.paper:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.7);
}
.paper-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.file-no {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--grey);
}
.paper-line {
  flex: 1;
  height: 1px;
  background: var(--line);
}
.paper-title {
  font-family: var(--font-serif);
  font-size: 20px;
  line-height: 1.3;
  margin: 0 0 10px;
}
.paper-summary {
  font-size: 12px;
  line-height: 1.6;
  color: var(--grey);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.paper-foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.paper-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--grey);
}
.tags { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
```

- [ ] **Step 2: 验证(在 Task 8 组装前先用临时页面检查)**

创建临时 `pages/__preview.vue` 渲染单张卡片:

```vue
<script setup lang="ts">
const sample = {
  title: 'Hello World',
  summary: '这是摘要文字,用来检查卡片排版与文档式布局。',
  date: '2026-09-20',
  tags: ['随笔', '测试'],
  slug: 'hello-world'
}
</script>

<template>
  <div style="display:flex;justify-content:center;padding:80px 0;background:#0a0a0a">
    <div style="width:240px;height:340px">
      <PaperCard :post="sample" index="01" />
    </div>
  </div>
</template>
```

Run: `pnpm dev`,访问 `http://localhost:3000/__preview`
Expected: 白纸卡片,页眉「No. 01」+ 细线、标题、摘要、底部分隔线 + 日期标签;hover 上浮。验证后删除 `pages/__preview.vue`。

- [ ] **Step 3: Commit**

```bash
git add components/PaperCard.vue
git commit -m "feat: document-style paper card component with hover"
```

---

### Task 5: Coverflow 数学纯函数 + 测试

**Files:**
- Create: `utils/coverflow.ts`
- Test: `tests/unit/coverflow.test.ts`

**Interfaces:**
- Consumes: 无(Nuxt 无关纯函数)。
- Produces:
  - `mod(n: number, m: number): number` —— 数学取模(支持负数/浮点)。
  - `computeCardStates(count: number, scroll: number): CardState[]` —— 给定卡片数与滚动位置(单位:张),返回每张卡片的视觉状态。`CardState = { centered: number; scale: number; opacity: number }`,`centered` 是相对中心的偏移(张,可为浮点,0 = 居中,±1 = 相邻)。

- [ ] **Step 1: 写失败测试 tests/unit/coverflow.test.ts**

```ts
import { describe, it, expect } from 'vitest'
import { mod, computeCardStates } from '../../utils/coverflow'

describe('mod', () => {
  it('处理负数', () => {
    expect(mod(-1, 5)).toBe(4)
  })
  it('处理正数', () => {
    expect(mod(7, 5)).toBe(2)
  })
})

describe('computeCardStates', () => {
  it('scroll=0 时第 0 张居中', () => {
    const states = computeCardStates(5, 0)
    expect(states[0].centered).toBe(0)
    expect(states[0].scale).toBe(1)
    expect(states[0].opacity).toBe(1)
  })

  it('相邻卡片对称分布', () => {
    const states = computeCardStates(5, 0)
    expect(states[1].centered).toBe(1)
    expect(states[4].centered).toBe(-1)
    expect(states[2].centered).toBe(2)
    expect(states[3].centered).toBe(-2)
  })

  it('越远缩放越小、越暗', () => {
    const states = computeCardStates(5, 0)
    expect(states[1].scale).toBeGreaterThan(states[2].scale)
    expect(states[1].opacity).toBeGreaterThan(states[2].opacity)
  })

  it('滚动超出范围后循环回绕', () => {
    // scroll=7 等价于 scroll=2(mod 5)
    const a = computeCardStates(5, 7)
    const b = computeCardStates(5, 2)
    expect(a[0].centered).toBeCloseTo(b[0].centered)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '../../utils/coverflow'`。

- [ ] **Step 3: 写 utils/coverflow.ts**

```ts
export interface CardState {
  centered: number
  scale: number
  opacity: number
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

const SCALE_FALLOFF = 0.16
const OPACITY_FALLOFF = 0.22

export function computeCardStates(count: number, scroll: number): CardState[] {
  const states: CardState[] = []
  for (let i = 0; i < count; i++) {
    const rel = mod(i - scroll, count)
    const centered = rel > count / 2 ? rel - count : rel
    const d = Math.abs(centered)
    states.push({
      centered,
      scale: Math.max(0.35, 1 - d * SCALE_FALLOFF),
      opacity: Math.max(0.15, 1 - d * OPACITY_FALLOFF)
    })
  }
  return states
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test`
Expected: PASS — 6 个测试通过。

- [ ] **Step 5: Commit**

```bash
git add utils/coverflow.ts tests/unit/coverflow.test.ts
git commit -m "feat: coverflow position/scale/opacity math with tests"
```

---

### Task 6: Coverflow 垂直无限循环组件

**Files:**
- Create: `components/Coverflow.vue`

**Interfaces:**
- Consumes: `computeCardStates`(Task 5)、`<PaperCard>`(Task 4)、CSS 变量(Task 3)。
- Produces: `<Coverflow :posts>`。props:`posts: PaperCardPost[]`(已排序、已带 index)。内部维护 `scroll`(浮点滚动位置),滚轮/触摸累积目标值,`requestAnimationFrame` + lerp 平滑,渲染每张卡片的位置/缩放/透明度。仅实现垂直模式(旋转切换在 Task 7)。

- [ ] **Step 1: 写 components/Coverflow.vue**

```vue
<script setup lang="ts">
import { computeCardStates } from '~/utils/coverflow'
import type { PaperCardPost } from './PaperCard.vue'

const props = defineProps<{ posts: PaperCardPost[] }>()

const CARD_H = 360
const SPACING = CARD_H + 40
const LERP = 0.12

const current = ref(0)   // 当前渲染的滚动位置(平滑后)
const target = ref(0)    // 滚动目标(滚轮/触摸累积)
let rafId = 0

function tick() {
  current.value += (target.value - current.value) * LERP
  if (Math.abs(target.value - current.value) > 0.0005) {
    rafId = requestAnimationFrame(tick)
  }
}

function onWheel(e: WheelEvent) {
  target.value += e.deltaY / SPACING
  if (!rafId) rafId = requestAnimationFrame(tick)
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function onTouchMove(e: TouchEvent) {
  const dy = e.touches[0].clientY - touchStartY
  touchStartY = e.touches[0].clientY
  target.value += dy / SPACING
  if (!rafId) rafId = requestAnimationFrame(tick)
}

const states = computed(() => computeCardStates(props.posts.length, current.value))

const cardStyle = (s: { centered: number; scale: number; opacity: number }) => ({
  transform: `translate(-50%, -50%) translateY(${s.centered * SPACING}px) scale(${s.scale})`,
  opacity: s.opacity,
  zIndex: Math.round(100 - Math.abs(s.centered) * 10)
})

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="coverflow" @wheel.prevent="onWheel" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove">
    <div
      v-for="(post, i) in posts"
      :key="post.slug"
      class="slot"
      :style="cardStyle(states[i])"
    >
      <PaperCard :post="post" :index="post.index" :focused="Math.abs(states[i].centered) < 0.5" />
    </div>
  </div>
</template>

<style scoped>
.coverflow {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg);
}
.slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 360px;
  will-change: transform, opacity;
}
</style>
```

- [ ] **Step 2: 临时验证页检查滚动**

创建 `pages/__coverflow.vue`:

```vue
<script setup lang="ts">
const posts = [
  { title: 'Hello World', summary: '摘要一', date: '2026-09-20', tags: ['随笔'], slug: 'hello-world', index: '01' },
  { title: '用 Nuxt Content 写文章', summary: '摘要二', date: '2026-09-21', tags: ['技术'], slug: 'nuxt-content', index: '02' },
  { title: '第三篇', summary: '摘要三', date: '2026-09-22', tags: ['其他'], slug: 'third', index: '03' }
]
</script>

<template>
  <Coverflow :posts="posts" />
</template>
```

Run: `pnpm dev`,访问 `http://localhost:3000/__coverflow`
Expected: 中间一张大卡片,上下卡片缩小变暗;滚轮平滑上下滑,滑到底无缝循环。验证后删除 `pages/__coverflow.vue`。

- [ ] **Step 3: Commit**

```bash
git add components/Coverflow.vue
git commit -m "feat: vertical infinite coverflow with wheel/touch inertia"
```

---

### Task 7: 布局切换(垂直 ↔ 水平旋转)

**Files:**
- Modify: `components/Coverflow.vue`

**Interfaces:**
- Consumes: Task 6 的 Coverflow。
- Produces: `<Coverflow>` 新增 `orientation` 内部状态(`'vertical' | 'horizontal'`)与切换方法;根容器按 orientation 旋转(`vertical` = 0°,`horizontal` = -90° 逆时针),水平模式滚轮 `deltaY` 仍驱动同一 `scroll`,渲染时容器整体旋转 90°,即视觉上变成左右滑动。暴露切换按钮。

- [ ] **Step 1: 给 Coverflow.vue 增加 orientation 状态与旋转**

修改 `<script setup>` 顶部,新增:

```ts
const orientation = ref<'vertical' | 'horizontal'>('vertical')
function toggleOrientation() {
  orientation.value = orientation.value === 'vertical' ? 'horizontal' : 'vertical'
}
```

修改模板根节点,加旋转与切换按钮:

```vue
<template>
  <div class="coverflow-wrap">
    <div
      class="coverflow"
      :class="{ horizontal: orientation === 'horizontal' }"
      @wheel.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
    >
      <div
        v-for="(post, i) in posts"
        :key="post.slug"
        class="slot"
        :style="cardStyle(states[i])"
      >
        <PaperCard :post="post" :index="post.index" :focused="Math.abs(states[i].centered) < 0.5" />
      </div>
    </div>
    <button class="toggle" @click="toggleOrientation">{{ orientation === 'vertical' ? '⟲ 横向' : '⟳ 纵向' }}</button>
  </div>
</template>
```

修改 `<style scoped>`,新增 wrap/toggle/旋转过渡:

```css
.coverflow-wrap {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}
.coverflow {
  position: absolute;
  inset: 0;
  background: var(--bg);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.coverflow.horizontal {
  /* 垂直 → 水平:逆时针 90° */
  transform: rotate(-90deg) scale(1.2);
}
.toggle {
  position: fixed;
  bottom: 24px;
  right: 28px;
  z-index: 45;
  color: #ffffff;
  opacity: 0.6;
  border: 1px solid #444;
  padding: 8px 14px;
  border-radius: 2px;
  transition: opacity 0.2s;
}
.toggle:hover { opacity: 1; }
```

说明:`.slot` 绝对定位在旋转容器内,容器 `rotate(-90deg)`,使「垂直排布」视觉上变成「水平排布」;`scale(1.2)` 补偿旋转后视口适配(具体数值实现时按实际观感微调)。

- [ ] **Step 2: 验证切换动画**

Run: `pnpm dev`,访问首页(若首页未组装,复用 `pages/__coverflow.vue` 临时页)
Expected: 点击右下角按钮,整个卡片流逆时针旋转 90° 变成水平排布,滚轮仍驱动滑动;再点顺时针转回垂直。验证后删除临时页。

- [ ] **Step 3: Commit**

```bash
git add components/Coverflow.vue
git commit -m "feat: vertical/horizontal orientation toggle with 90deg rotation"
```

---

### Task 8: 首页组装 + 开场动画

**Files:**
- Create: `pages/index.vue`
- Modify: `components/Coverflow.vue`(如需入口过渡类名)

**Interfaces:**
- Consumes: `queryCollection`(Task 2 的 collection)、`sortAndIndex`(Task 2)、`<Coverflow>`(Task 7)。
- Produces: 首页 `/`,查询所有非 hidden 文章 → `sortAndIndex` → 传给 `<Coverflow>`;入场动画(opacity 0→1 + scale 0.96→1)。

- [ ] **Step 1: 写 pages/index.vue**

```vue
<script setup lang="ts">
import { sortAndIndex } from '~/utils/posts'
import type { PaperCardPost } from '~/components/PaperCard.vue'

const { data } = await useAsyncData('home-posts', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const posts = computed<PaperCardPost[]>(() => {
  const raw = (data.value ?? []).map((p: any) => ({
    title: p.title,
    summary: p.summary,
    date: p.date,
    tags: p.tags,
    slug: String(p.path).replace(/^\/posts\//, '')
  }))
  return sortAndIndex(raw)
})

const entered = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { entered.value = true })
})
</script>

<template>
  <div class="home" :class="{ entered }">
    <Coverflow :posts="posts" />
  </div>
</template>

<style scoped>
.home {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.home.entered {
  opacity: 1;
  transform: scale(1);
}
</style>
```

- [ ] **Step 2: 验证首页**

Run: `pnpm dev`,访问 `http://localhost:3000`
Expected: 入场淡入展开;封面流显示两篇非 hidden 文章(`hello-world`、`nuxt-content`),`draft-hidden` 不出现;滚轮无限循环;切换按钮旋转;点击卡片(中间聚焦)跳转到文章页(文章页尚未实现,此时会 404 —— 下一步实现)。

- [ ] **Step 3: Commit**

```bash
git add pages/index.vue
git commit -m "feat: homepage assembling coverflow with entrance animation"
```

---

### Task 9: 文章详情页 + 滚动 reveal + 阅读时长

**Files:**
- Create: `pages/posts/[slug].vue`
- Create: `utils/plaintext.ts`
- Test: `tests/unit/plaintext.test.ts`

**Interfaces:**
- Consumes: collection `posts`(Task 2)、CSS 变量(Task 3)。
- Produces:
  - `bodyToPlainText(body: unknown): string` —— 递归提取 MDAST 文本。
  - `readingMinutes(text: string, wpm = 400): number` —— 中文阅读时长(去空白字符数 / wpm,向上取整,至少 1)。
  - 文章页 `/posts/[slug]`:黑底 + 居中白纸,标题/日期/标签/阅读时长,`<ContentRenderer>` 渲染正文,上一篇/下一篇,滚动 reveal 指令。

- [ ] **Step 1: 写失败测试 tests/unit/plaintext.test.ts**

```ts
import { describe, it, expect } from 'vitest'
import { bodyToPlainText, readingMinutes } from '../../utils/plaintext'

describe('bodyToPlainText', () => {
  it('递归提取文本节点', () => {
    const body = {
      type: 'root',
      children: [
        { type: 'heading', children: [{ type: 'text', value: '标题' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '正文内容' }] }
      ]
    }
    expect(bodyToPlainText(body)).toBe('标题 正文内容')
  })
  it('空 body 返回空串', () => {
    expect(bodyToPlainText(null)).toBe('')
  })
})

describe('readingMinutes', () => {
  it('按字数估算阅读时长', () => {
    expect(readingMinutes('a'.repeat(800))).toBe(2)
  })
  it('至少 1 分钟', () => {
    expect(readingMinutes('short')).toBe(1)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test`
Expected: FAIL — module 不存在。

- [ ] **Step 3: 写 utils/plaintext.ts**

```ts
export function bodyToPlainText(body: unknown): string {
  if (!body) return ''
  const parts: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (node.type === 'text' && typeof node.value === 'string') parts.push(node.value)
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(body)
  return parts.join(' ')
}

export function readingMinutes(text: string, wpm = 400): number {
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / wpm))
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test`
Expected: PASS — 4 个测试通过。

- [ ] **Step 5: 写 pages/posts/[slug].vue**

```vue
<script setup lang="ts">
import { bodyToPlainText, readingMinutes } from '~/utils/plaintext'
import { sortAndIndex } from '~/utils/posts'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const minutes = computed(() => readingMinutes(bodyToPlainText(post.value?.body)))
const plain = computed(() => bodyToPlainText(post.value?.body))

// 上一篇/下一篇:基于同一排序
const { data: all } = await useAsyncData('post-all', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)
const siblings = computed(() => {
  const list = sortAndIndex((all.value ?? []).map((p: any) => ({
    title: p.title,
    date: p.date,
    slug: String(p.path).replace(/^\/posts\//, '')
  })))
  const i = list.findIndex((p: any) => p.slug === slug)
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null
  }
})

// 滚动 reveal 指令
const vReveal = {
  mounted(el: HTMLElement) {
    el.classList.add('reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-visible')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )
    io.observe(el)
  }
}
</script>

<template>
  <article class="article">
    <div class="paper" v-reveal>
      <header class="paper-head">
        <h1 class="title">{{ post.title }}</h1>
        <div class="meta">
          <time>{{ post.date }}</time>
          <span>{{ minutes }} 分钟</span>
          <span class="tags">{{ (post.tags ?? []).join(' · ') }}</span>
        </div>
      </header>
      <div class="body">
        <ContentRenderer :value="post" />
      </div>
      <footer class="foot">
        <NuxtLink v-if="siblings.prev" :to="`/posts/${siblings.prev.slug}`">← {{ siblings.prev.title }}</NuxtLink>
        <NuxtLink v-else to="/">返回首页</NuxtLink>
        <NuxtLink v-if="siblings.next" :to="`/posts/${siblings.next.slug}`">{{ siblings.next.title }} →</NuxtLink>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 96px 16px 64px;
  background: var(--bg);
}
.paper {
  width: 100%;
  max-width: 680px;
  background: var(--paper);
  color: var(--ink);
  padding: 48px 48px;
  border-radius: 2px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}
.title {
  font-family: var(--font-serif);
  font-size: 32px;
  margin: 0 0 16px;
  line-height: 1.3;
}
.meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--grey);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.body {
  margin-top: 24px;
  line-height: 1.8;
  font-size: 16px;
}
.body :deep(h2) { margin-top: 32px; }
.body :deep(pre) { background: #f5f5f5; padding: 14px; overflow-x: auto; }
.foot {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 13px;
}
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

- [ ] **Step 6: 验证文章页**

Run: `pnpm dev`,访问 `http://localhost:3000/posts/hello-world`
Expected: 黑底居中白纸,标题/日期/阅读时长/标签,正文渲染,底部上一篇/下一篇;白纸入场淡入上浮。访问 `/posts/draft-hidden` 应 404(手动导航时服务器报错,静态生成后无此页)。

- [ ] **Step 7: Commit**

```bash
git add pages/posts/[slug].vue utils/plaintext.ts tests/unit/plaintext.test.ts
git commit -m "feat: article page with reveal animation and reading time"
```

---

### Task 10: 标签页 + 搜索

**Files:**
- Create: `pages/tags/[tag].vue`
- Create: `components/SearchModal.vue`
- Modify: `app.vue`(挂载 SearchModal)

**Interfaces:**
- Consumes: collection `posts`、`sortAndIndex`、`bodyToPlainText`。
- Produces:
  - 标签页 `/tags/[tag]`:列出该标签下非 hidden 文章。
  - `<SearchModal v-model="showSearch">`:客户端搜索,`queryCollection('posts').where('hidden','=','false').all()` 全量加载,用 `bodyToPlainText` 生成正文纯文本,匹配标题/摘要/标签/正文。

- [ ] **Step 1: 写 pages/tags/[tag].vue**

```vue
<script setup lang="ts">
import { sortAndIndex } from '~/utils/posts'

const route = useRoute()
const tag = route.params.tag as string

const { data } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const posts = computed(() => {
  const list = (data.value ?? [])
    .filter((p: any) => (p.tags ?? []).includes(tag))
    .map((p: any) => ({
      title: p.title,
      date: p.date,
      tags: p.tags,
      summary: p.summary,
      slug: String(p.path).replace(/^\/posts\//, '')
    }))
  return sortAndIndex(list)
})
</script>

<template>
  <div class="tag-page">
    <h1 class="tag-title">#{{ tag }}</h1>
    <ul class="list">
      <li v-for="p in posts" :key="p.slug">
        <NuxtLink :to="`/posts/${p.slug}`">
          <span class="idx">{{ p.index }}</span>
          <span class="t">{{ p.title }}</span>
          <time>{{ p.date }}</time>
        </NuxtLink>
      </li>
    </ul>
    <NuxtLink to="/" class="back">← 返回首页</NuxtLink>
  </div>
</template>

<style scoped>
.tag-page {
  min-height: 100dvh;
  background: var(--bg);
  color: #ffffff;
  padding: 120px 32px 64px;
  max-width: 640px;
  margin: 0 auto;
}
.tag-title { font-family: var(--font-serif); font-size: 28px; margin-bottom: 32px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li a {
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
.idx { color: var(--grey); font-size: 12px; }
.t { flex: 1; }
time { color: var(--grey); font-size: 12px; }
.back { display: inline-block; margin-top: 32px; color: var(--grey); }
</style>
```

- [ ] **Step 2: 写 components/SearchModal.vue**

```vue
<script setup lang="ts">
import { bodyToPlainText } from '~/utils/plaintext'

const open = defineModel<boolean>({ default: false })
const q = ref('')

const { data } = await useAsyncData('search-index', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const index = computed(() =>
  (data.value ?? []).map((p: any) => ({
    title: p.title,
    summary: p.summary,
    tags: p.tags ?? [],
    slug: String(p.path).replace(/^\/posts\//, ''),
    text: bodyToPlainText(p.body)
  }))
)

const results = computed(() => {
  const k = q.value.trim().toLowerCase()
  if (!k) return []
  return index.value.filter((p) =>
    [p.title, p.summary, p.tags.join(' '), p.text].join(' ').toLowerCase().includes(k)
  ).slice(0, 10)
})

function onSelect() {
  q.value = ''
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="open = false">
      <div class="modal">
        <input v-model="q" class="input" placeholder="搜索文章…" autofocus />
        <ul class="results">
          <li v-for="p in results" :key="p.slug">
            <NuxtLink :to="`/posts/${p.slug}`" @click="onSelect">
              <span class="rt">{{ p.title }}</span>
              <span class="rs">{{ p.summary }}</span>
            </NuxtLink>
          </li>
          <li v-if="q && results.length === 0" class="empty">无结果</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  padding-top: 12vh;
}
.modal {
  width: 100%;
  max-width: 560px;
  height: fit-content;
  background: var(--paper);
  border-radius: 2px;
  padding: 16px;
}
.input {
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid var(--line);
  border-radius: 2px;
}
.results { list-style: none; margin: 12px 0 0; padding: 0; }
.results li a {
  display: block;
  padding: 10px 4px;
  border-bottom: 1px solid #eee;
}
.rt { font-weight: 600; display: block; }
.rs { font-size: 12px; color: var(--grey); }
.empty { padding: 12px 4px; color: var(--grey); font-size: 13px; }
</style>
```

- [ ] **Step 3: 改 app.vue 挂载 SearchModal**

把 app.vue 模板改为:

```vue
<template>
  <div class="site">
    <GrainOverlay />
    <SiteNav @open-search="showSearch = true" />
    <SearchModal v-model="showSearch" />
    <NuxtPage />
  </div>
</template>
```

(`showSearch` ref 已在 Task 3 的 `<script setup>` 中定义。)

- [ ] **Step 4: 验证标签页与搜索**

Run: `pnpm dev`
Expected:
- 访问 `/tags/技术` 显示 `nuxt-content` 一篇;`/tags/随笔` 显示 `hello-world`。
- 首页点「搜索」打开模态,输入「Nuxt」出现 `nuxt-content`,输入正文关键词(如「Content」)也能命中;点结果跳转文章页并关闭模态。

- [ ] **Step 5: Commit**

```bash
git add pages/tags/[tag].vue components/SearchModal.vue app.vue
git commit -m "feat: tag filter page and client-side full-text search"
```

---

### Task 11: 卡片 → 文章页过渡动画

**Files:**
- Modify: `components/PaperCard.vue`(加 view-transition-name + 点击拦截)
- Modify: `pages/posts/[slug].vue`(纸张容器加同名 view-transition-name)

**Interfaces:**
- Consumes: PaperCard(Task 4)、文章页(Task 9)。
- Produces: 点击卡片时用 View Transitions API 做卡片→纸张的放大 morph 过渡。

- [ ] **Step 1: 修改 PaperCard.vue**

给根 `<NuxtLink>` 加动态 `view-transition-name` 与点击拦截:

```vue
<script setup lang="ts">
// ... 已有 props/href

function onClick(e: MouseEvent) {
  if (!document.startViewTransition) return // 无 API 时走默认导航
  e.preventDefault()
  document.startViewTransition(() => navigateTo(href.value))
}
</script>

<template>
  <NuxtLink
    :to="href"
    class="paper"
    :class="{ focused }"
    :style="{ viewTransitionName: `card-${post.slug}` }"
    @click="onClick"
  >
    <!-- 内容不变 -->
  </NuxtLink>
</template>
```

- [ ] **Step 2: 修改 pages/posts/[slug].vue**

给纸张容器加对应 `view-transition-name`:

```vue
<template>
  <article class="article">
    <div class="paper" v-reveal :style="{ viewTransitionName: `card-${slug}` }">
      <!-- 内容不变 -->
    </div>
  </article>
</template>
```

- [ ] **Step 3: 验证过渡**

Run: `pnpm dev`,访问首页
Expected: 点击中间卡片,卡片与文章页白纸之间出现平滑的 morph 放大过渡(支持 View Transitions 的浏览器);不支持的浏览器回退为默认导航。注意验证 `draft-hidden` 不产生任何卡片。

- [ ] **Step 4: Commit**

```bash
git add components/PaperCard.vue "pages/posts/[slug].vue"
git commit -m "feat: card-to-article view transition morph"
```

---

### Task 12: 静态生成验证 + README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 全部任务。
- Produces: 可部署的静态产物(`.output/public`)。

- [ ] **Step 1: 运行完整测试**

Run: `pnpm test`
Expected: 全部通过(posts、coverflow、plaintext 三组)。

- [ ] **Step 2: 静态生成**

Run: `pnpm generate`
Expected: 生成成功,`.output/public/` 存在 `index.html`、`posts/hello-world/index.html`、`posts/nuxt-content/index.html`、`tags/*/index.html`。

- [ ] **Step 3: 验证 hidden 文章未生成**

Run: `ls .output/public/posts/`
Expected: 只出现 `hello-world` 与 `nuxt-content`,**没有** `draft-hidden`。

- [ ] **Step 4: 本地预览静态产物**

Run: `pnpm preview`
Expected: 打开预览地址,首页封面流、文章页、标签、搜索均正常;直接访问 `/posts/draft-hidden` 返回 404。

- [ ] **Step 5: 写 README.md**

```markdown
# 黑白简约静态博客

Nuxt 4 + Nuxt Content 3 构建的黑白极简博客,以「纸质文件」为视觉隐喻。

## 开发

\`\`\`bash
pnpm install
pnpm dev        # 开发服务器
pnpm test       # 单元测试
pnpm generate   # 静态生成到 .output/public
\`\`\`

## 写文章

在 `content/posts/` 下新建 `.md`,frontmatter:

\`\`\`yaml
---
title: 标题
date: '2026-09-20'
tags: [标签1, 标签2]
summary: 摘要
hidden: false   # true 则隐藏(不生成页面)
---
\`\`\`

文章编号自动按日期生成;可选 `order` 字段覆盖排序。
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: add README with usage instructions"
```

---

## Self-Review Notes(执行前自查)

- 覆盖检查:设计文档第 4~11 节均有对应任务 —— 信息架构(Task 8/9/10)、封面流(Task 6/7/8)、卡片(Task 4)、文章页(Task 9)、标签搜索(Task 10)、动效 1~7 分布在各任务(无限循环 6、旋转 7、view transition 11、hover 4、reveal 9、噪点 3、开场 8)、内容模型(Task 2)、目录结构(各 Task 的 Files)。
- 类型一致性:`PaperCardPost` 的字段 `title/summary/date/tags/slug` 在 Task 4 定义,Task 6/8 引用一致;`sortAndIndex` 返回类型带 `index: string`,首页/标签页消费一致;`computeCardStates` 返回 `CardState { centered, scale, opacity }`,Task 6 的 `cardStyle` 按此字段读取。
- 版本与约束:全部符合 Global Constraints(pnpm、Nuxt 4.5.2、Content 3.16.0、date 字符串、hidden 语义、无关于页)。
