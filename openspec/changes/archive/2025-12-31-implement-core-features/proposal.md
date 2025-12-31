# Change: 实现菜单选择核心功能

## Why
目前应用仅搭建了基础框架，尚未实现“随机选择菜单”的核心业务价值。需要根据 PRD 实现菜单管理、随机推荐算法、历史记录与冷却机制，并完成数据的本地持久化，以满足 MVP 阶段的用户需求。

## What Changes
- **状态管理**：引入 Pinia，建立 MenuStore（管理菜单列表）、HistoryStore（管理历史记录）、SettingStore（管理冷却配置）。
- **持久化层**：在主进程引入 `electron-store`，通过 IPC 暴露安全的读写接口，实现数据的落盘与加载。
- **业务逻辑**：
  - 实现基于权重的随机选择算法（当前阶段权重默认为1）。
  - 实现基于历史记录的冷却过滤逻辑（最近 N 天不推荐）。
- **UI 实现**：
  - 完善 `App.vue` 或拆分组件（MenuList, Randomizer, HistoryList, Settings）。
  - 实现菜单导入（JSON解析）、随机展示、确认吃过、清空历史等交互。

## Impact
- **Affected specs**: `core-features`
- **New dependencies**: `pinia`, `electron-store`
- **Affected code**: 
  - `src/stores/` (New)
  - `src/components/` (New/Update)
  - `electron-main/` (Update: persistence)
  - `electron-preload/` (Update: IPC API)
