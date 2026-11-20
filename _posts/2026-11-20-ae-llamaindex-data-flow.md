---
layout: "post"
title: "LlamaIndex 数据链路：Document、Node、索引与答案合成"
description: "从入库到引用验收追踪数据表示、Retriever、Query Engine 和事件工作流。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/llamaindex-data-flow/"
engineering_topic: "frameworks"
engineering_series: "llamaindex"
engineering_id: "llamaindex-data-flow"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Document 和 Node 有何差别？","answer":"Document 代表读入的数据记录，可带元数据。Node 常表示解析后的检索单元，能保留来源和关系，以便返回原文。"},{"question":"Retriever 与 Query Engine 分别返回什么？","answer":"Retriever 返回候选节点及可能的相关度。Query Engine 接收查询，通常组织检索与响应合成，返回答案和相关节点。"},{"question":"已经检索到正确 Node，为什么仍会遗漏规则？","answer":"排序、预算、后处理和合成都可能丢掉证据。应追踪节点引用是否从召回进入实际上下文，以及结论是否逐条有出处。"},{"question":"Workflow 与 Agent 有何关系？","answer":"Workflow 用事件与步骤组织显式过程，也可以包含由模型决定工具的 Agent。根据任务是否需要自由决策选择入口。"},{"question":"文件更新时怎样保持引用准确？","answer":"通过稳定文档身份和版本关联新旧 Node，记录实际索引代。切换时验证原文地址与授权，防止新结果指向旧段落。"}]
engineering_reading: {"prerequisites":[{"title":"文档解析","url":"/agent-engineering/rag/document-ingestion/"},{"title":"RAG 基础","url":"/agent-engineering/rag/rag-foundations/"}],"next":[{"title":"生态选型","url":"/agent-engineering/frameworks/agent-ecosystem/"}],"related":[]}
---

## 先追踪一条证据，再选择框架入口

财务手册里一条报销限制在标题和表格的交界。Data Connector 或 Reader 将来源读成带元数据的 Document。解析把手册拆成 Node，继承文档 ID、版本与标题层级。索引用于按策略查找这些节点。约定节点的来源标识比从模型文字里猜引用稳健，尤其是表格需要保留行列和单位时。

```mermaid
flowchart TB
  A["Reader 读取 Document"] --> B["解析成带出处的 Node"]
  B --> C["准备检索索引"]
  D["查询与限定范围"] --> E["Retriever 返回候选"]
  C --> E
  E --> F["筛选节点与合成回答"]
  F --> G["以原文坐标核对引用"]
```

## 从两次输出区分检索问题和生成问题

Retriever 负责给出候选，可独立测当前适用条款是否在前 K。Query Engine 常把查找、节点后处理和 Response Synthesizer 组合起来。合成阶段在上下文与模型预算内组织候选，也可能处理多块内容的依赖。输出携带的来源节点使应用能够核对来源，但不能说明每条回答都真正受某节点支持。

假设 `N-17` 写着现行上限，`N-19` 写着远程地区例外。如果 N-19 根本没进入召回，检查元数据过滤、查询或索引。如果召回有 N-19 而输入预算截掉它，检查节点后处理和组装。如果生成输入齐全仍漏它，检查合成策略与引用验收。这三个检查在路径上分开记录。

## 何时需要事件工作流或 Agent

单轮问答可从 Query Engine 起步。显式执行「两路召回、合流、必要时人工确认」时，事件驱动 Workflow 可描述何时触发步骤以及携带哪份数据。在工具选择由新证据决定时，再把查询能力作为 Agent 可调用工具。LlamaIndex 提供这些抽象，底层存储的隔离、事务或恢复能力取决于实际组件。

验证两项变化。若文档变版，检查旧块是否正确失效。若权限改变，检查查询、源文档回读和缓存是否同时缩小范围。固定一组带来源的查询，回归 Node 覆盖、答案支持和尾延迟。

## 小结

LlamaIndex 的优势在于把读取、解析、索引、检索和合成拆成可组合的边界。保存节点版本和原文坐标，才能把数据层错误与生成错误分开。

## 参考资料

- [LlamaIndex：High-Level Concepts](https://developers.llamaindex.ai/python/framework/getting_started/concepts/)
- [LlamaIndex：Querying](https://developers.llamaindex.ai/python/framework/understanding/rag/querying/)
