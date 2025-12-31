# Change: UI 重构与代码自检

## Why
响应用户需求，对现有代码进行自检与优化：
1. **UI 适配问题**：当前布局使用固定宽度与高度限制，窗口缩放时体验不佳，且未能充分利用屏幕空间。
2. **代码维护性**：需要确保代码结构清晰，易于后续迭代。
3. **数据持久化验证**：确认所有增删改操作均已正确对接持久化层。

## What Changes
- **UI 响应式重构**：
  - `App.vue`: 移除固定宽度，改用 Flex 布局适配视口（`100vh`）。
  - `MenuList`/`HistoryList`: 移除硬编码高度，改用 `flex: 1` 自动填充剩余空间，并支持内部滚动。
  - `Randomizer`: 优化居中显示与自适应。
- **代码优化**：
  - 统一颜色变量（可选）。
  - 增加必要的注释。
- **持久化确认**：
  - 再次验证 `MenuStore` 和 `HistoryStore` 的各类操作是否正确调用了 `electron-store`。

## Impact
- **Affected specs**: `refactor`
- **Affected code**: 
  - `src/App.vue`
  - `src/components/*.vue`
