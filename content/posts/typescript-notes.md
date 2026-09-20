---
title: TypeScript 学习笔记
date: '2026-09-24'
tags: [技术, TypeScript]
summary: 类型系统与泛型的几个关键概念。
---

# TypeScript 学习笔记

最近系统过了一遍 TypeScript,记几个容易忘的点。

## 泛型

泛型让函数在「不丢失类型信息」的前提下复用逻辑。

```ts
function identity<T>(value: T): T {
  return value
}
```

## 联合与收窄

联合类型配合「类型守卫」做收窄,是 TS 里最常用的模式之一。

## 小结

类型是文档,也是约束。写得好的类型,能替你在编译期挡掉一整类 bug。
