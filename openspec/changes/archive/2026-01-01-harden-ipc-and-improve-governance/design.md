## Context
本次变更在不引入新依赖的前提下，提升 Electron 应用的 IPC 与窗口安全基线，并补齐菜单管理与历史记录的长期使用治理能力。

## Goals / Non-Goals
- Goals:
  - 收敛 IPC 能力暴露与可写入的持久化数据范围。
  - 阻断非预期导航与窗口打开行为。
  - 提升菜单导入质量与日常管理效率。
  - 控制历史记录增长，避免长期使用导致性能下降。
- Non-Goals:
  - 不引入复杂权限系统或多窗口架构。
  - 不改变现有随机推荐/冷却算法的业务语义。

## Decisions
- Decision: IPC 侧采用“来源校验 + key 白名单”双重约束
  - 主进程对 `ipcMain.handle` 请求校验 `senderFrame.url`（不可用时回退 `sender.getURL()`），仅接受 devServer origin 或 `file://.../dist/` 产物来源。
  - 持久化读写仅允许 `menuItems`/`historyEntries`/`settings` 三类 key。
- Decision: 窗口安全策略默认 deny
  - `setWindowOpenHandler` 一律 deny。
  - `will-navigate` 仅允许受信任目标，其他跳转直接阻止。
- Decision: 菜单导入在 UI 层做“防御性解析”
  - 过滤非对象/缺失 name 的条目。
  - 标签做 trim、去空、去重归一化。
  - 按 name（case-insensitive）去重。
- Decision: 历史治理策略在 store 层统一执行
  - 在 `loadHistory` 与 `addEntry` 后应用保留策略，确保新增/加载都不会积累过期数据。
  - 通过设置项 `historyRetentionDays` 控制保留窗口；`0` 表示永久保留。

## Risks / Trade-offs
- CSP 为兼容开发调试与现有构建链路，允许开发期必要的策略；生产收紧可作为后续迭代。
- `file://` 路径判断基于 `dist/` 目录约定，若构建目录变更需同步调整 allowlist。

