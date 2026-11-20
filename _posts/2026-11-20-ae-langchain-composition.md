---
layout: "post"
title: "LangChain 组件组合：Runnable、LCEL 与可观测的检索链"
description: "沿一次政策问答追踪输入、模型消息、解析和回调，分清固定链与 Agent。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/langchain-composition/"
engineering_topic: "frameworks"
engineering_series: "langchain"
engineering_id: "langchain-composition"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Runnable 在系统中提供什么？","answer":"它用统一接口描述可调用组件，方便把输入转换、Prompt、模型或解析器组合。具体组件是否具备真实异步或增量流式行为，要看实现。"},{"question":"为什么先用固定链验证政策问答？","answer":"检索和回答的顺序已知，固定链能记录每步证据，便于分辨召回与生成错误。需要模型选择工具时再引入 Agent 循环。"},{"question":"Parser 通过就说明答案正确吗？","answer":"解析只确认可消费的输出形状。来源是否可访问、符合生效时间、确实支持结论，仍需业务校验。"},{"question":"调用 stream 为什么有时仍一次性返回？","answer":"链路中的组件可能等到完整输入才产生结果。检索、合并或解析阶段都可能形成屏障，接入流式 API 并不代表每步都会增量输出。"},{"question":"回调适合记录什么？","answer":"记录组件名、版本、耗时、错误类型及证据 ID。默认少记录原文、凭据和敏感用户字段，避免把可观测链路变成数据副本。"}]
engineering_reading: {"prerequisites":[{"title":"Prompt Engineering","url":"/agent-engineering/capabilities/prompt-design/"}],"next":[{"title":"LangChain Agent 与中间件","url":"/agent-engineering/frameworks/langchain-agent-runtime/"}],"related":[{"title":"结构化输出","url":"/agent-engineering/capabilities/output-contracts/"}]}
---

## 固定问答链的每一站交换什么

同事问「苏州出差住宿上限是多少」。已知的路径是检索文档、生成答案、验收引用。LangChain 的 Python 核心组件可以把这条路径组合成可调用对象。先把可信主体和生效日期交给检索适配器，检索返回文档及来源信息。Prompt 模板用这些资料填充一组消息，Chat Model 返回模型消息，解析器或结构化输出适配负责提取字段，最后以本轮证据验证引用。

```mermaid
flowchart TB
  A["问题和可信范围"] --> B["检索证据"]
  B --> C["构造提示消息"]
  C --> D["模型与结构解析"]
  D --> E["检查来源并交付"]
```

## Runnable 和 LCEL 如何组织调用

Runnable 是组件接口。用 LCEL 的 `|` 可以把前一组件的输出交给后一组件，字典组合可以在共享输入上并行构造字段。比如把问题同时交给检索和保留原始文本的分支，再组装 `question` 与 `evidence`。链路仍要把可信身份保存在服务端，避免从模型生成的字典读取授权信息。

| 边界 | 输入 → 输出 | 可独立验证的问题 |
| --- | --- | --- |
| Retriever | 查询 → 文档列表 | 授权过滤、版本与候选覆盖 |
| Prompt | 问题和证据 → 提示消息 | 指令和资料边界、缺证规则 |
| Chat Model | 消息 → 模型消息 | 拒绝、工具请求与服务错误 |
| 解析和校验 | 模型消息 → 可消费记录 | Schema、引用来源及事实 |

`invoke` 表示单项调用，`batch` 表示多项输入，`stream` 则依赖参与组件是否支持分块传递。不要把 SDK 的批量接口等同于提供方的离线批推理服务。一个阶段必须收齐文档才能判断缺证时，可先返回可信查证状态，再开始流式生成。回调和事件可用于定位哪个组件付出了时间和成本。

## 组合到哪里应该停

如果查某地区政策只需一次检索，固定链更容易验证。若模型需要根据第一轮证据在文档、台账和澄清之间重新选择，Agent 循环更有意义。LangChain v1 将部分早期 Chain 实现移入 `langchain-classic`。旧博客里的 `LLMChain` 示例有版本背景，新项目可从 Runnable 或 v1 Agent 入口读起。迁移时先锁定输入输出契约，再比较分步回归结果。

## 小结

模型、提示、检索和解析通过组件契约连接。用 LCEL 表达已知路径，照实际组件能力设计并行、批处理和流式响应，最后用业务证据验收。

## 参考资料

- [LangChain v1 发布说明](https://docs.langchain.com/oss/python/releases/langchain-v1)
- [LangChain Python：Runnable](https://reference.langchain.com/python/langchain-core/runnables/base/Runnable)
