---
layout: "post"
title: "MCP 2026-07-28：无状态请求、能力协商与旧版兼容"
description: "比较新旧 MCP，追踪工具请求、MRTR、缓存提示、Tasks 扩展与应用层状态。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/mcp-stateless/"
engineering_topic: "frameworks"
engineering_series: "mcp"
engineering_id: "mcp-stateless"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么现代服务器可以在不同实例处理相邻请求？","answer":"协议请求携带版本及客户端能力等必要元数据，不依赖 initialize 建立的协议会话。业务操作所需的数据仍由应用通过显式标识和持久状态管理。"},{"question":"server/discover 对客户端和服务器是同一要求吗？","answer":"现代规范要求服务实现发现方法，客户端可以预先调用，也可以用已知版本直接发请求并处理不支持版本错误。"},{"question":"MRTR 是什么？","answer":"工具可以返回 input_required，客户端依据权限收集所需信息，再按规范携带 inputResponses 继续原调用。它把补问放进客户端发起的往返。"},{"question":"工具清单缓存命中后是否还需要鉴权？","answer":"需要。清单缓存按服务、范围和响应缓存提示隔离，实际调用时仍按当下身份、资源和动作授权。"},{"question":"怎样同时支持两个时代的 MCP？","answer":"选择相互支持的协议，按该协议走完整的请求和传输规则。测试握手、有无会话字段、版本错误、扩展支持与授权边界。"}]
engineering_reading: {"prerequisites":[{"title":"工具运行时","url":"/agent-engineering/capabilities/tool-runtime/"}],"next":[{"title":"MCP 旧版握手","url":"/agent-engineering/frameworks/mcp-lifecycle/"},{"title":"MCP 能力模型","url":"/agent-engineering/frameworks/mcp-capabilities/"}],"related":[{"title":"A2A 任务协议","url":"/agent-engineering/frameworks/a2a-task-protocol/"}]}
---

## 同一套工具，两种协议生命周期

假设一个助手通过 MCP 查合同条款，后面又调用生成比对草稿的工具。两个版本都用 JSON-RPC 2.0，也都区分 Host、Client、Server。2025-11-25 通过 `initialize` 及初始化通知建立连接生命周期。2026-07-28 把版本和请求所需能力放进每次请求，服务分别接受或拒绝各次请求。应用仍然可以保存草稿和任务，例如把草稿 ID 作为后续工具的显式参数。

| 工程问题 | 2025-11-25 | 2026-07-28 |
| --- | --- | --- |
| 约定版本与能力 | 初始化阶段协商 | 每次请求声明版本与能力，可预先发现 |
| HTTP 调用 | 参照对应 Streamable HTTP 规则，服务可分配会话 ID | POST 请求独立，响应可为 JSON 或本次请求的 SSE |
| 服务向客户端索取输入 | 旧生命周期允许相应服务端请求 | 工具返回待补输入，客户端发起后续往返 |
| 长操作 | 旧版实验 Tasks 语义 | 通常先核对是否共同声明 Tasks 扩展，再按扩展追踪任务 |

## 沿一次现代工具调用阅读线协议

客户端可先请求 `server/discover`，然后按已知能力使用 `tools/list` 或 `tools/call`。请求的 `_meta` 含协议版本和客户端能力等协议元数据。现代 Streamable HTTP 把协议版本和用于路由的方法、工具名称信息放在对应的 HTTP 头，按规范保持头与消息体一致。Header 可帮助路由，访问控制应在服务端根据可信身份核对。服务报告不支持版本时，客户端可从支持列表选择双方均支持的版本并应用对应流程。

```mermaid
sequenceDiagram
  participant H as Host 与 Client
  participant S as MCP Server
  H->>S: 可选发现支持版本与能力
  H->>S: tools/call 携带版本和客户端能力
  S-->>H: 返回待补输入及关联信息
  H->>H: 检查补问范围并取得所需输入
  H->>S: 按 MRTR 继续原调用
  S-->>H: 工具结果或明确错误
```

用只读合同查询举例。查询缺少合同年份时，工具可以通过 Multi Round-Trip Requests（MRTR）请求一个年份。宿主检查只询问该项，再将结果按规定带回。用户不愿提供时，宿主保留拒绝路径。涉及写操作时，要将批准绑定到实际参数，避免上一轮确认被另一个请求复用。Tasks 扩展的任务标识独立于协议传输，不同协议时代的 Tasks 不应直接互换。

## 无状态不等于任意复用

工具目录响应可提供 `ttlMs` 与 `cacheScope`。实现需遵守缓存提示，隔离不同身份、权限与版本。缓存失效是目录一致性问题，业务动作仍现场授权。Roots、Sampling、Logging 及旧式 HTTP+SSE 处于已弃用状态，旧连接的兼容行为应单独验收。已有项目先记录支持的版本和扩展，用只读调用、版本不匹配、用户拒绝和授权变化做迁移对照。

## 小结

2026-07-28 将 MCP 核心改为逐请求协商。应用仍需核对业务状态、动作授权、缓存范围和真实结果。兼容旧客户端时保留两套明确的协议路径。

## 参考资料

- [MCP 规范 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)
- [MCP 版本与兼容性](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
- [MCP 官方发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
