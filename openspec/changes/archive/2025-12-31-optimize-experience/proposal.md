# Change: 优化核心体验

## Why
在 MVP 版本发布后，识别到以下核心体验痛点：
1. **管理不便**：目前仅支持整文件导入，无法针对单个菜单项进行增删，缺乏灵活性。
2. **缺乏仪式感**：随机推荐过程瞬间完成，缺少期待感和视觉反馈。
3. **筛选能力弱**：无法根据口味或场景（如“只想吃面”）进行快速过滤。

## What Changes
- **菜单管理增强**：
  - 实现菜单项的单条添加（Modal/Form）。
  - 实现菜单项的单条删除。
- **视觉体验升级**：
  - 添加“滚动抽奖”动画效果，持续 1-2 秒后展示结果。
- **筛选功能**：
  - 基于 `tags` 字段实现标签筛选功能。
  - 在随机推荐前，允许用户选择“限定标签”。

## Impact
- **Affected specs**: `optimization`
- **Affected code**: 
  - `src/stores/menuStore.ts` (Actions update)
  - `src/components/MenuList.vue` (UI update)
  - `src/components/Randomizer.vue` (UI & Logic update)
