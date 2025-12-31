# Project Context

## Purpose
一个基于 Electron + Vue3 的桌面应用，旨在帮助用户解决“今天吃什么”的难题。核心功能是随机选择每日菜单，支持动态导入菜单配置，并具有智能去重机制（根据近期历史记录避免重复推荐）。

## Tech Stack
- **Core**: Electron (Desktop container)
- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia (Recommended for Vue3)
- **Storage**: electron-store or local file system (JSON) for menu and history persistence

## Project Conventions

### Code Style
- Use TypeScript for all logic.
- Vue components using `<script setup lang="ts">`.
- Use ESLint + Prettier for formatting.
- Components should be small and focused.

### Architecture Patterns
- **Main Process**: Handles window management, file I/O, native dialogs.
- **Renderer Process**: Handles UI, user interaction, state management.
- **IPC**: Use `contextBridge` for secure communication between Main and Renderer processes.

### Testing Strategy
- Unit tests for algorithm logic (random selection, history filtering).
- Component tests for UI interactions.

### Git Workflow
- Conventional Commits (feat, fix, docs, etc.)

## Domain Context
- **Menu Item**: A dish or meal option (e.g., "Kung Pao Chicken").
- **Menu Config**: A collection of menu items, can be dynamically imported.
- **History**: Records of what was selected/eaten on specific dates.
- **Cooldown Logic**: A configurable period (e.g., 3 days) during which a recently eaten item cannot be randomly selected again.

## Important Constraints
- Offline first: Must work without internet connection.
- Data persistence: Menu configuration and history must survive app restarts.
- Performance: Random selection should be instant even with large menu lists.

## External Dependencies
- None currently (Self-contained).
