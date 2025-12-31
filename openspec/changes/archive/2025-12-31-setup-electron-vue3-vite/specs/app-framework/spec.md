## ADDED Requirements

### Requirement: 开发与构建脚手架
系统 SHALL 提供可在 Windows 环境运行的本地开发与构建脚手架，使渲染进程与 Electron 主进程可以协同启动与构建。

#### Scenario: 本地开发启动成功
- **WHEN** 执行开发脚本
- **THEN** 渲染进程 dev server 启动并被 Electron 窗口加载

#### Scenario: 构建产物可启动
- **WHEN** 执行构建脚本
- **THEN** 生成的构建产物可被 Electron 主进程加载并启动应用

### Requirement: Electron 主进程与渲染进程分层
系统 SHALL 将 Electron 主进程、preload 与渲染进程代码分离，并通过 preload 暴露受控接口以满足安全通信需求。

#### Scenario: 渲染进程无法直接访问 Node 能力
- **WHEN** 渲染进程尝试直接访问 Node 或 Electron 特权 API
- **THEN** 访问被禁止或不可用

#### Scenario: 渲染进程通过受控 API 调用能力
- **WHEN** 渲染进程调用 preload 暴露的受控 API
- **THEN** 主进程或 preload 按约定返回结果

