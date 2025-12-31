# Electron + Vue3 + TypeScript + Vite 桌面应用基础框架（快速搭建）

这份文档以本仓库的实践结构为参考，目标是用最少步骤搭出一套可开发、可构建、可打包的 Electron + Vue3 + TS + Vite 桌面应用骨架。

## 目标产物

- 开发：Vite 启动前端，Electron 主进程加载本地 DevServer
- 构建：产出 `dist/`（renderer）与 `dist-electron/`（main + preload）
- 打包：用 electron-builder 生成 Windows 安装包/目录；Mac 通过 GitHub Actions 产出 dmg/zip
- 安全：preload 通过 `contextBridge` 暴露最小 API，避免直接暴露 Node

## 环境要求

- Node.js 20+（推荐）
- npm 9+
- Windows / macOS / Linux 均可开发（打包受平台限制）

## 一键启动命令

在项目根目录执行：

```bash
npm install
npm run dev
```

## 目录结构建议（最小且清晰）

建议保持“三段式”拆分：渲染进程、主进程、预加载。

```text
project-root/
  src/                    # Vue3 渲染进程
  electron-main/           # Electron 主进程源码
  electron-preload/        # Electron 预加载源码（桥接 IPC）
  dist/                    # 渲染进程构建产物（vite build）
  dist-electron/           # 主进程/预加载构建产物（vite build）
  vite.config.ts
  package.json
```

## 依赖选择（与本仓库一致）

- `vite` + `@vitejs/plugin-vue`：渲染进程
- `electron`：桌面运行时
- `vite-plugin-electron`：让 Vite 同时构建 main/preload
- `electron-builder`：打包分发
- `vue-tsc`：类型检查

## 关键配置点

### 1) package.json：入口与脚本

- `main` 指向打包后 Electron 主进程入口（本仓库为 `dist-electron/index.js`）
- `scripts` 至少包含：`dev`、`build`、`typecheck`、`build:win`

参考：[package.json](./../package.json)

### 2) vite.config.ts：同时构建 renderer + main + preload

核心目标：

- renderer 正常走 Vite
- main 与 preload 输出到 `dist-electron/`
- preload 通常需要 CJS 输出，便于 Electron 直接加载（避免 ESM 兼容坑）

参考：[vite.config.ts](./../vite.config.ts)

### 3) Electron 主进程：开发加载 DevServer，生产加载本地文件

主进程做两件事：

- 创建 BrowserWindow
- 按环境决定加载：
  - 开发：`win.loadURL(devServerUrl)`
  - 生产：`win.loadFile(path.join(app.getAppPath(), 'dist/index.html'))`

参考：[electron-main/index.ts](./../electron-main/index.ts)

### 4) preload：用 contextBridge 暴露最小 API

原则：

- 渲染进程不直接用 Node API
- 只暴露你需要的 IPC 方法（例如 `get/set` 或 `invoke`）

参考：[electron-preload/index.ts](./../electron-preload/index.ts)

### 5) 渲染进程：只通过 window.xxx 调用桥接 API

建议为 preload 声明类型（本仓库为 `src/preload.d.ts`），避免 TS 报错。

参考：[preload.d.ts](./../src/preload.d.ts)

## 构建与打包

### 类型检查

```bash
npm run typecheck
```

### 构建（生成 dist 与 dist-electron）

```bash
npm run build
```

### Windows 打包

```bash
npm run build:win
```

产物默认在 `release/`（可通过 electron-builder 配置修改）。

### Mac 打包（推荐：GitHub Actions）

Electron Builder 在 Windows 上无法直接构建 macOS 产物，需要在 macOS 运行。

本仓库已配置 GitHub Actions 工作流，push 后可在 Actions 中手动触发构建并下载产物：

- `.dmg`
- `.zip`

参考：[build-mac.yml](./../.github/workflows/build-mac.yml)

## 常见问题（快速排雷）

### 1) 打包后白屏/不显示 UI

优先检查：

- 生产环境 `loadFile` 指向的路径是否正确（建议用 `app.getAppPath()` 拼 `dist/index.html`）
- preload 打包格式是否兼容（推荐 CJS 输出）

### 2) preload 在开发可用，打包不可用

常见原因：

- preload 输出路径和 `BrowserWindow` 的 `webPreferences.preload` 指向不一致
- preload 被 Vite/Electron Builder 排除（确保 `dist-electron/**` 被打包进 `files`）

## 推荐的最小工作流

1. 初始化依赖与脚本
2. 完成 `vite.config.ts` 的 main/preload 构建
3. 实现主进程的 dev/prod 加载分支
4. 实现 preload 的最小安全桥接
5. `npm run dev` 验证开发流程
6. `npm run build` + `npm run build:win` 验证打包流程

