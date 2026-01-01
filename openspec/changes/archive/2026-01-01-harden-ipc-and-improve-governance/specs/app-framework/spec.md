## MODIFIED Requirements

### Requirement: Electron 主进程与渲染进程分层
系统 SHALL 将 Electron 主进程、preload 与渲染进程代码分离，并通过 preload 暴露受控接口以满足安全通信需求。

#### Scenario: IPC 调用来源受信任
- **GIVEN** 渲染进程来自 devServer 或生产构建产物页面
- **WHEN** 渲染进程通过 preload 调用持久化相关 IPC
- **THEN** 主进程校验 sender 来源通过并返回结果

#### Scenario: IPC 调用来源不受信任
- **GIVEN** sender 来源不属于受信任 origin 或页面路径
- **WHEN** 发起持久化相关 IPC 调用
- **THEN** 主进程拒绝该调用并返回错误

### Requirement: 渲染进程无法直接访问 Node 能力
系统 SHALL 禁止渲染进程直接访问 Node 或 Electron 特权 API，并仅允许通过 preload 暴露的最小能力集完成业务需求。

#### Scenario: 仅允许白名单数据写入
- **WHEN** 渲染进程尝试读写未在白名单中的 store key
- **THEN** 调用被拒绝

## ADDED Requirements

### Requirement: 窗口导航与新窗口打开限制
系统 SHALL 阻止渲染进程打开新窗口，并限制页面导航目标为受信任来源。

#### Scenario: 新窗口打开被阻止
- **WHEN** 渲染进程触发 `window.open`
- **THEN** 主进程拒绝创建新窗口

#### Scenario: 非受信任导航被阻止
- **WHEN** 页面尝试导航到非受信任目标
- **THEN** 主进程阻止导航

