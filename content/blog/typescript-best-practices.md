---
title: TypeScript 最佳实践
description: 提升 TypeScript 代码质量的 10 个建议
date: 2026-03-15
tags: [typescript, best-practices]
---

# TypeScript 最佳实践

TypeScript 为 JavaScript 项目提供了类型安全。以下是提升代码质量的 10 个建议。

## 1. 启用严格模式

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 2. 使用 `unknown` 而不是 `any`

```typescript
// 避免
function process(data: any) { }

// 推荐
function process(data: unknown) {
  if (typeof data === 'string') {
    console.log(data.toUpperCase())
  }
}
```

## 3. 定义统一的 API Response 类型

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
```

## 4. 使用 Type Guard 增加类型安全性

```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 'name' in obj
}
```

## 5. 善用 Utility Types

```typescript
type PartialUser = Partial<User>
type ReadonlyUser = Readonly<User>
type UserPreview = Pick<User, 'id' | 'name'>
```

## 6. 使用枚举管理常量

```typescript
enum Status {
  Pending = 'pending',
  Active = 'active',
  Deleted = 'deleted'
}
```

## 7. 类型别名 vs 接口

- 用 `interface` 定义对象结构（可扩展）
- 用 `type` 定义联合类型、工具类型

## 8. 泛型约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

## 9. 避免类型断言过多

过多 `as` 类型断言说明类型设计可能有问题。

## 10. 编写有意义的类型

```typescript
// 避免
type ID = string

// 推荐
type UserID = string
type PostID = string
```

---

掌握这些技巧，让你的 TypeScript 代码更健壮！
