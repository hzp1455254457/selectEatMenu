# Change: 搭建 Electron + Vue3 + TS + Vite 项目框架

## Why
当前仓库缺少可运行的 Electron + Vue3 + TypeScript + Vite 桌面应用基础框架，导致无法开始实现“每日菜单选择”业务功能。需要先建立可开发、可构建、可打包的最小可用工程骨架。

## What Changes
- 初始化一个基于 Vite 的 Vue3 + TypeScript 渲染进程工程
- 增加 Electron 主进程与 preload 入口，并以安全默认值连接渲染进程（使用 preload 暴露受控 API）
- 配置 Vite 与 Electron 的联动开发体验（本地 dev 启动、热更新、窗口加载 dev server）
- 增加常用脚本（dev/build/package）与基础构建配置，保证 Windows 环境可用

## Impact
- Affected specs: `app-framework`
- Affected code:
  - 新增：`electron-main/`, `electron-preload/`, `src/`
  - 更新：`vite.config.ts`, `tsconfig.json`, `package.json`（及可能的锁文件）

