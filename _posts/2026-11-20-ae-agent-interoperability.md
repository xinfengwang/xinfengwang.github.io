---
layout: "post"
title: "Agent 互操作：工具、任务、身份与证据如何跨边界"
description: "用两套独立服务的协作说明 MCP 与 A2A 的组合，以及协议兼容之外的业务契约。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/agent-interoperability/"
engineering_topic: "frontier"
engineering_series: "interoperability"
engineering_id: "agent-interoperability"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"两边都支持同一协议就能直接互通吗？","answer":"协议语法仅是一层。还要对齐版本、能力、身份、数据范围、业务状态与验收制品。"},{"question":"MCP 和 A2A 怎样组合？","answer":"调用方可用 A2A 委派远程任务，远程 Agent 在自己的权限范围内用 MCP 访问工具，然后返回可检查的任务制品。"},{"question":"远程成功与本地成功怎样区分？","answer":"远端报告其任务终态，本地依据请求、证据、业务语义和有效回执检查能否作为最终结果。"},{"question":"两边的身份如何关联？","answer":"服务认证证明调用来源，用户或业务授权需要明确委派与资源范围。任务 ID 不能代替权限。"},{"question":"版本升级最先测试哪些路径？","answer":"验证正常请求、版本不匹配、未知状态、取消与重复交付，以及跨租户数据是否保持隔离。"}]
engineering_reading: {"prerequisites":[{"title":"MCP 新版","url":"/agent-engineering/frameworks/mcp-stateless/"},{"title":"A2A 任务协议","url":"/agent-engineering/frameworks/a2a-task-protocol/"}],"next":[{"title":"Agent 运行时演进","url":"/agent-engineering/frontier/agent-runtime-evolution/"}]}
---

## 协议对接解决的是哪些层

采购 Agent 需要让异地服务核对一份虚构合同，只共享条款编号和必要范围。它读远端 Agent Card 并委派 A2A 任务。远端服务可通过 MCP 查当地政策。返回时用可访问的引用和明确状态表达结论。双方不共享完整会话或工具凭据。

```mermaid
flowchart TB
  A["本地 Agent 缩小目标与授权范围"] --> B["通过 A2A 委派并保存任务关联"]
  B --> C["远端使用本地工具或 MCP"]
  C --> D["交付状态、制品和出处"]
  D --> E["本地验收权限和语义"]
```

## 把兼容拆成三种检查

先核对传输、协议版本和能力声明。再核对身份、数据用途与接收方。最后确定取消、缺证、失败、回执与可接受制品的业务语义。比如远端的「完成」可能只是找到一个引用，而本地要求两个地区均给出处。验收在本地对照原始目标，保留部分完成和冲突状态。

## 哪些互操作已经可用

MCP 和 A2A 已提供可引用规范，但具体实现支持的版本、鉴权、可选能力和事件查询语义需实测。准备双方版本矩阵，记录补问、取消、断开与重复交付的预期结果。协议适配层负责转换字段与状态，业务层仍有自己的证据、授权和审计。

## 小结

互操作同时依赖消息、身份和任务语义。协议让通信可组合，本地验收确认跨服务结果是否满足目标。

## 参考资料

- [MCP：2026-07-28 Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [A2A：v1.0.0 Specification](https://a2a-protocol.org/v1.0.0/specification/)
