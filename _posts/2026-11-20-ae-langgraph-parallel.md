---
layout: "post"
title: "LangGraph 并行与子图：superstep、Send、Command 和合流"
description: "用地区政策核对解释动态扇出、Reducer、子图状态边界以及失败后的恢复。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/langgraph-parallel/"
engineering_topic: "frameworks"
engineering_series: "langgraph"
engineering_id: "langgraph-parallel"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Send 与普通条件边的用途有什么差别？","answer":"条件路由可以选择节点。Send 还可以按运行时输入生成多个目标调用，每个调用拥有自己的分支输入。"},{"question":"Command 为什么不能自动覆盖静态边？","answer":"在 Python Graph API 中 Command 路由会与该节点的静态出边一起生效。如果希望互斥，要让节点控制方式与所声明的边一致。"},{"question":"为什么并行分支不能立即读取别的分支新结果？","answer":"同一 superstep 的兄弟节点按可见快照执行，更新在步骤边界被归并。需要对方结果的操作应放到后续节点。"},{"question":"父图和子图字段不同怎么办？","answer":"用父图节点作为适配器，将必要输入映射到子图 Schema，再把经过验收的结果映射回父图，避免共享所有内部状态。"},{"question":"失败时为何仍要查真实写入回执？","answer":"图的检查点描述图运行状态。外部服务可能已生效而图尚未确认，恢复时以业务操作标识核对，不能用检查点替代业务回执。"}]
engineering_reading: {"prerequisites":[{"title":"LangGraph 图编排","url":"/agent-engineering/frameworks/langgraph-state/"},{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"}],"next":[{"title":"LangGraph 持久化","url":"/agent-engineering/frameworks/langgraph-recovery/"}],"related":[]}
---

## 一个地区列表如何变成动态扇出

输入给出粤、苏、沪三个地区。每个工作者只需知道自己的地区、资料版本和任务 ID。编排节点可以在条件边返回多个 `Send`，将独立分支输入发到同一个查证节点。分支输出写入共享证据 channel，Reducer 以地区和版本合并，随后汇总节点判断哪些地区齐备。用实际任务集合区分「未派发」和「尚未返回」。

```mermaid
flowchart TB
  A["按地区生成 Send"] --> B["各分支独立查证"]
  B --> C["同一步骤归并更新"]
  C --> D["检查覆盖与冲突"]
  D -->|有预算且缺证| A
  D -->|满足条件| E["交付汇总"]
```

## superstep 与状态写入的时序

分支在同一步骤执行时，可以并行读、各自返回更新。其他分支在同一 superstep 的更新不应被假设立即可见。多个节点同时写同一值时，需要定义 Reducer 或分开字段。只拼接列表无法消除重复文档。按键保留可信版本，冲突则写入可复查记录，最终展示按地区排序。若业务想等若干静态前置节点全部完成，可显式声明合流依赖。若分支有不同长度或包含跳过路径，使用已登记工作项检查实际覆盖。

`Command` 可在节点返回时表达状态更新和下一跳。它与该节点既有静态边并行生效。组合方式应经过最小图测试，确认不会同时触发审批和提交两路。循环以有效证据、最大步数或截止时间停止。Graph API 的递归上限用来限制步骤，业务停止条件仍需明确。

## 子图怎样只暴露必要状态

若地区查证会反复执行检索、过滤与校验，可以封装子图。共享同名状态字段时，可以将编译后的子图作为节点接入。不同 Schema 时，用父节点包装调用并显式映射输入输出。跨子图向父图返回更新与路由时按文档核对目标和 Reducer。相同地区子图有多个并发调用时，核对实际版本的持久化模式和标识隔离，不共写同一会话状态。

配置 Checkpointer 后，某些同一步骤已成功节点的 pending writes 可供故障恢复使用。把模型调用和外部写入的生命周期与框架状态区分，针对乱序、重复和一个分支失败做回归。最终核对持久化页面上的版本与运行记录。

## 小结

Send 分派动态输入，superstep 界定可见状态，Reducer 和汇总条件决定结果，子图封装内部步骤。恢复逻辑仍需实际回执和任务契约。

## 参考资料

- [LangGraph Python：Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [LangGraph Python：Subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs)
- [LangGraph Python：Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
