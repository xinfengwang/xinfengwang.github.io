---
layout: "post"
title: "LangChain v1 Agent：工具循环、中间件与 LangGraph 的边界"
description: "通过 create_agent 的模型和工具回执解释消息、钩子、运行上下文及下沉到自定义图的时机。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/langchain-agent-runtime/"
engineering_topic: "frameworks"
engineering_series: "langchain"
engineering_id: "langchain-agent-runtime"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"create_agent 在什么时候结束一轮任务？","answer":"通常在模型不再提出工具调用时结束该调用循环，也可能被限制、打断或错误路径提前停止。业务完成要另外核对证据和动作回执。"},{"question":"运行上下文与状态有什么区别？","answer":"状态随图节点更新，可保存消息等轨迹。运行上下文用来注入可信身份或依赖。调用方从认证和应用配置提供这些值。"},{"question":"为什么要区分工具过滤与工具授权？","answer":"过滤缩小模型看到的候选。实际执行时还要核对当前对象、权限与业务前置条件，防止状态或身份变化。"},{"question":"工具失败应怎样反馈给模型？","answer":"保留调用关联 ID，返回可安全说明的类型与下一步条件。权限拒绝、无数据、暂时失败和写入结果未知需要不同处置。"},{"question":"什么时候改用 LangGraph 的显式图？","answer":"需要显式并行合流、异步审批、指定恢复点或自定义路由时，使用独立状态图可以让这些事件和恢复契约可验证。"}]
engineering_reading: {"prerequisites":[{"title":"LangChain 组件组合","url":"/agent-engineering/frameworks/langchain-composition/"},{"title":"工具运行时","url":"/agent-engineering/capabilities/tool-runtime/"}],"next":[{"title":"LangGraph 图编排","url":"/agent-engineering/frameworks/langgraph-state/"}],"related":[]}
---

## 从固定顺序转向观察驱动

用户问「报销单 C-27 卡在哪一步」。模型需要决定先查单据，随后可能读审批制度。LangChain Python v1 的 `langchain.agents.create_agent` 将模型节点和工具节点组织为 LangGraph 运行时中的默认循环。应用传入初始消息。模型返回工具请求时工具节点执行，回填对应的工具消息，模型继续用获得的观察生成结果。

```mermaid
flowchart TB
  A["用户消息和运行上下文"] --> B["模型选择回答或请求工具"]
  B -->|请求工具| C["核对并执行工具"]
  C --> D["将回执写回消息"]
  D --> B
  B -->|无后续调用| E["应用验收并返回结果"]
```

## 在模型前后和工具执行处处理不同判断

在模型调用前，应用可按身份和任务裁剪工具、注入验证过的描述或限定成本。工具调用边界适合检查主体、参数和当前资源权限。模型输出后可做格式和引用验收。v1 的 middleware 提供在这些边界接入逻辑的方式，具体钩子以项目采用的实现为准。不要用模型参数提供租户身份，也不要把中间件里的调试日志当作业务回执。

例如模型拿到了查单工具，但 C-27 属于另一租户。工具返回可安全表达的拒绝，模型据此请求可访问的单号。若同一轮还查询制度，按调用 ID 关联各自结果。为外部写入准备独立批准和幂等标识，避免模型重试或检查点恢复触发重复业务操作。

## 哪些编排应移到独立图

普通工具循环可继续使用高层入口。企业任务如果要并行核对两个索引、合流后等待审批、再提交并核对回执，独立 StateGraph 能表达各阶段的状态所有权。旧项目的 `langgraph.prebuilt.create_react_agent` 属于较早入口，架构迁移应先判断是否只需替换高层 Agent 入口，再比较状态、工具消息、持久化和审批行为。

## 小结

`create_agent` 提供标准工具循环，中间件扩展调用边界，LangGraph 提供底层编排。应用负责可信身份、业务授权和任务验收。

## 参考资料

- [LangChain v1 发布说明](https://docs.langchain.com/oss/python/releases/langchain-v1)
- [LangChain Python：Agents](https://docs.langchain.com/oss/python/langchain/agents)
- [LangChain Python：Middleware](https://docs.langchain.com/oss/python/langchain/middleware/overview)
