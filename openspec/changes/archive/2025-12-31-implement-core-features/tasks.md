## 1. Implementation
- [x] 1.1 安装依赖 (`pinia`, `electron-store`)
- [x] 1.2 配置 Electron 主进程持久化 (Setup `electron-store` IPC handlers)
- [x] 1.3 更新 Preload 暴露存储 API (`getStore`, `setStore`, `onMenuImport` etc.)
- [x] 1.4 初始化 Pinia 并创建 Stores (`menuStore`, `historyStore`, `settingStore`)
- [x] 1.5 实现 UI 组件拆分 (`MenuList.vue`, `Randomizer.vue`, `HistoryList.vue`)
- [x] 1.6 集成业务逻辑到 `App.vue` (Import/Random/Confirm/Clear flows)
- [x] 1.7 验证数据持久化 (Build verification passed)