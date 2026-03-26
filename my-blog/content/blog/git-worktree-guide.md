---
title: Git Worktree 高效协作指南
description: 用 Git Worktree 在多个分支间无缝切换，提高开发效率
date: 2026-03-01
tags: [git, workflow]
---

# Git Worktree 高效协作指南

Git Worktree 是被低估的强大功能，让你同时在多个分支工作。

## 什么是 Git Worktree

普通 Git 仓库只有一个工作目录。Worktree 允许你在同一仓库创建多个工作目录，每个指向不同分支。

## 基本用法

### 创建 worktree

```bash
# 从 main 分支创建新的 feature 分支
git worktree add -b feature/auth worktrees/auth

# 从已有分支创建
git worktree add worktrees/old-feature feature-old
```

### 列出所有 worktree

```bash
git worktree list
```

输出示例：

```
/path/to/main        8a9dc12 [main]
/path/to/worktrees/auth  3b5c8d1 [feature/auth]
/path/to/worktrees/docs  7f2e1a4 [feature/docs]
```

### 删除 worktree

```bash
git worktree remove worktrees/auth
```

## 实用场景

### 1. Code Review 时继续开发

```bash
# PR Review 需要切换分支
git worktree add ../review review-branch

# 在 review 目录审查代码
cd ../review

# 原来的分支继续开发
# (在 main worktree 中)
```

### 2. 并行开发多个功能

```bash
git worktree add ../feat-api -b feature/api
git worktree add ../feat-ui -b feature/ui
```

### 3. 紧急 Bug 修复

```bash
# 正在开发新功能，线上出现 bug
git worktree add ../hotfix -b hotfix/critical-bug

# 修复 bug...
git worktree remove ../hotfix
```

## 最佳实践

1. **统一 worktree 位置**：放在 `.worktrees/` 目录
2. **及时清理**：用完记得删除
3. **命名规范**：`feat/功能名` 或 `fix/问题描述`

## 注意事项

- 不要在同一 worktree 中切换分支
- 删除分支前先移除所有相关 worktree
- bare仓库不能使用 worktree

---

善用 Git Worktree，让多任务协作更高效！
