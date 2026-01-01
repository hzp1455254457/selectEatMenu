# Change: 加固 IPC 安全与数据治理，并优化菜单管理体验

## Why
应用准备分发时，需要降低 IPC 滥用与窗口跳转带来的安全风险，同时补齐菜单管理与历史记录长期使用下的体验与性能隐患（导入质量不稳定、编辑不便、历史无限增长）。

## What Changes
- **IPC 与窗口安全加固**：
  - 增加 IPC 调用来源校验与存储 key 白名单，拒绝不可信调用。
  - 禁止新窗口打开，并限制 `will-navigate` 仅允许受信任目标。
- **前端安全基线**：
  - 增加 CSP，收紧资源加载来源。
- **菜单管理体验优化**：
  - 增加菜单搜索（按菜名/标签）。
  - 支持菜单项的内联编辑（名称/标签）。
  - 导入 JSON 时做格式过滤、标签归一化与按名称去重。
- **历史记录治理**：
  - 增加“历史保留天数”设置，并在加载与新增时自动清理过期记录。

## Impact
- **Affected specs**: `app-framework`, `core-features`
- **Affected code**:
  - `electron-main/index.ts`
  - `electron-preload/index.ts`
  - `index.html`
  - `src/preload.d.ts`
  - `src/stores/menuStore.ts`
  - `src/stores/historyStore.ts`
  - `src/stores/settingStore.ts`
  - `src/components/MenuList.vue`
  - `src/components/Settings.vue`

