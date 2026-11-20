---
layout: "post"
title: "Semantic Kernel：把业务服务暴露为可信的 Plugin 和 Function"
description: "从 .NET 核心对象、插件、提示词、过滤器到 Process，说明 Agent 的运行边界和迁移路径。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/semantic-kernel/"
engineering_topic: "frameworks"
engineering_series: "semantic-kernel"
engineering_id: "semantic-kernel"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么 Plugin 是业务适配入口？","answer":"Plugin 组织可调用 Function 及其描述。可用窄接口包装现有服务，统一输入验证、输出和错误语言，而不暴露整套业务服务。"},{"question":"Kernel 能替代现有业务服务吗？","answer":"Kernel 连接模型、服务、插件和调用过程。真实权限、事务和状态仍由现有系统确认。"},{"question":"Prompt Function 与本地代码函数区别在哪里？","answer":"Prompt Function 使用模板和模型生成结果。本地代码函数执行确定代码或调用服务。业务验收和权限检查优先由可信代码执行。"},{"question":"自动执行函数适合哪些任务？","answer":"已授权只读查询或有严格保护的动作较合适。高影响写入需要核对主体、参数和用户批准，可在执行边界拦截。"},{"question":"Semantic Kernel 的 Process 与微软 Agent Framework 应怎样选？","answer":"现有项目按当前 Semantic Kernel 语言 SDK 维护。新项目若需要微软生态下的显式工作流，可同时评估其后续 Agent Framework 和迁移成本。"}]
engineering_reading: {"prerequisites":[{"title":"Function Calling","url":"/agent-engineering/capabilities/tool-calling/"},{"title":"企业级 Agent 架构","url":"/agent-engineering/architecture/enterprise-agent-architecture/"}],"next":[{"title":"MCP 新版协议","url":"/agent-engineering/frameworks/mcp-stateless/"}],"related":[]}
---

## 为什么企业应用先封装一个窄业务接口

一个 .NET 内部应用已有报销服务和认证中间件。它希望让模型查单并解释状态。Semantic Kernel 的 Kernel 将 AI 服务与可用插件组织在一起。Plugin 将一个或多个 Function 描述为可调用能力。本地代码可提供确定的服务调用，Prompt Function 则用提示模板和模型形成输出。角色与权限由应用创建可信上下文，模型只填业务参数。

```mermaid
flowchart TB
  A["业务应用建立可信上下文"] --> B["Kernel 连接模型与 Plugin"]
  B --> C["模型提出 Function 调用"]
  C --> D["过滤、授权和业务验证"]
  D --> E["调用既有服务"]
  E --> F["回填结果与验收"]
```

## 从参数到业务结果的边界

以 `get_expense_status(id)` 为例，Function 的描述写清它查什么、允许何种编号。业务适配器使用当前身份核对资源，并从真实服务返回结构化状态。Kernel 的过滤器可以在支持的调用路径记录元数据或拦截不允许的调用。应用仍需确保所有写接口都有独立验证，避免在单一路径拦截却可以从另一入口执行。

当要编排「导入、核对、生成说明、可选审批」，Process 用步骤、事件和状态表达显式业务过程。单个 Agent 则可使用工具并围绕会话做有限决策。若在同一系统组合两者，把审批、金额规则放在明确流程里，让 Agent 只负责语言解析或建议。微软将这里的 Process Framework 标注为实验性。跨语言 SDK 的功能和稳定性可能不同，先核对自己固定的包和文档。

## 从旧系统迁移的最小验证

先将一个只读 Function 封装为窄 Plugin，测试无权限、无数据、正确结果三类回执。再加入调用记录和可回放的样本。若后续迁移微软 Agent Framework，保持业务服务接口、结果验收和证据 ID 稳定，单独更换编排层。这样可以识别行为差异来自插件适配、工作流还是模型。

## 小结

Semantic Kernel 连接模型和已有业务能力。Kernel 管集成，Plugin 和 Function 表达可调用工作，Process 描述显式流程，真实事实和动作批准由业务服务管。

## 参考资料

- [Microsoft Learn：Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/)
- [Microsoft Learn：Semantic Kernel Plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/)
- [Microsoft Learn：Process Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/process/process-framework)
- [Microsoft Learn：Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/)
