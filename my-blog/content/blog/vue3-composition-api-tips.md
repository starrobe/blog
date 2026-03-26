---
title: Vue 3 Composition API 实用技巧
description: 分享一些我在项目中使用 Composition API 的经验和技巧
date: 2026-03-20
tags: [vue, javascript, tips]
---

# Vue 3 Composition API 实用技巧

Composition API 是 Vue 3 最重要的特性之一。以下是我在项目中总结的一些实用技巧。

## 1. 使用 `ref` 和 `reactive` 的最佳实践

```typescript
// 简单类型用 ref，复杂对象用 reactive
const count = ref(0)
const user = reactive({
  name: 'Alice',
  age: 25
})
```

## 2. 抽取逻辑到 Composables

将可复用的逻辑抽取到 `composables/` 目录：

```typescript
// composables/useLocalStorage.ts
export function useLocalStorage(key: string, defaultValue: string) {
  const value = useStorage(key, defaultValue)
  return value
}
```

## 3. 异步组件的 Loading 状态

```typescript
const { data, pending, error } = await useLazyFetch('/api/posts')
```

## 4. 依赖注入

使用 `provide` 和 `inject` 在组件树中传递数据：

```typescript
// 父组件
provide('theme', 'dark')

// 子组件
const theme = inject('theme')
```

## 总结

Composition API 提供了更灵活的代码组织方式，让逻辑复用变得简单。

---

有问题？欢迎留言讨论！
