---
layout: post
title: "Function Calling 实战，模型提出调用以后发生了什么？"
description: "用一个可运行的 Python 批处理器验证参数、任务授权、拒绝回执和多调用关联。"
date: 2026-11-19 20:00:00 +0800
updated: 2026-11-19
category: Tech
engineering_topic: capabilities
content_kind: 工程方法
tags: [Agent, Tool-Use, Function-Calling, MCP]
continue_reading: /2026/11/19/agent-deep-dive-rag/
engineering_reading:
  prerequisites:
    - {title: "Agent 的运行机制与核心原理", url: /2026/11/19/agent-engineering-foundations/}
  next:
    - {title: "进入 RAG 检索", url: /2026/11/19/agent-deep-dive-rag/}
  related:
    - {title: "智能客服验收实战", url: /2026/11/19/agent-case-support/}
outline:
  - {id: problem, title: "工具调用为什么经常在第二轮出错？"}
  - {id: contract, title: "核心概念：三个编号与两种校验"}
  - {id: principles, title: "底层原理：收到一批调用时先检查集合"}
  - {id: architecture, title: "架构：模型、执行器与业务后端的边界"}
  - {id: flow, title: "一次调用如何回填？"}
  - {id: implementation, title: "Python 实现：乱序回执也能重新配对"}
  - {id: tradeoffs, title: "串行调用、并行调用和固定查询怎么选？"}
  - {id: debugging, title: "工程实践：日志只记能定位断点的字段"}
  - {id: next, title: "从动作协议继续到知识证据"}
---

## 工具调用为什么经常在第二轮出错？ {#problem}

模型发出查单请求，业务接口也返回了订单，客服回复却说「无法查到」。先检查运行时是否把工具回执发到了同一条调用上。另一个常见问题出在请求入口，模型可以输出一个形状完全正确但超出任务范围的订单号。工具链要同时守住消息配对与业务权限。

## 核心概念：三个编号与两种校验 {#contract}

工具定义包含名称、说明和参数形状。调用编号对应模型的某次提议，订单号指出业务资源，写入操作键把重试绑定到同一次批准。参数结构允许字符串订单号，服务端还要校验这确实是当前请求允许的目标，随后根据会话身份确认归属。

| 字段 | 由谁赋值 | 跨什么范围 |
| --- | --- | --- |
| `call_id` | 模型接口或提供方 | 一次提议与工具响应 |
| `order_id` | 用户或业务上下文 | 被查询的订单 |
| `operation_id` | 应用在审批通过后登记 | 一次批准动作的重试与恢复 |

## 底层原理：收到一批调用时先检查集合 {#principles}

对每个工具提议都生成带原编号的成功或结构化失败。可并行的读取可能反序完成，回填先按调用 ID 建索引，再比较期望集合与实际集合。需要分别检查缺失、重复与意外编号。长度相等仍可能把不同调用配在一起。JSON 解析之后要检查顶层形状、字段和业务范围。示例拒绝额外的 `principal` 字段，会话身份由应用单独传给后端。

## 架构：模型、执行器与业务后端的边界 {#architecture}

```mermaid
flowchart TB
  A["模型适配器"] --> B["批次执行器"]
  B --> C["参数与任务目标校验"]
  C --> D["按会话身份查询订单"]
  D --> E["按调用编号生成回执"]
  E --> A
```

适配器负责外部 API 的字段映射。执行器保存当前运行已经接收的 ID。业务后端拥有最终身份规则和查单结果。工具定义描述输入形状，后端授权只接受应用传入的可信会话。

## 一次调用如何回填？ {#flow}

| 提议 | 执行器判断 | 回填状态 |
| --- | --- | --- |
| m1 读取 A12 | 当前任务目标且本人有权限 | `ok` |
| m2 附带身份字段 | 参数有额外字段 | `invalid_arguments` |
| m3 JSON 解析失败 | 无法读取参数 | `invalid_arguments` |
| m4 要求退款 | 本轮没有这个工具 | `unknown_tool` |
| m5 改查 B13 | 超出此次任务目标 | `invalid_target` |

在 OpenAI Responses API 中，用原调用的 `call_id` 对应 `function_call_output`。并行机制、调用字段和错误表示要以提供方文档为准。参考 [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling)。

## Python 实现：乱序回执也能重新配对 {#implementation}

把 [tool_protocol.py](/assets/examples/agent-engineering/tool_protocol.py) 和 [agent_loop.py](/assets/examples/agent-engineering/agent_loop.py) 放在同一个目录，运行 `python tool_protocol.py`。需要 Python 3.11 或更高版本。脚本将五个回执反序后重新配对，并故意制造重复编号和缺回执。

```python
def correlate(proposals: list[Proposal], results: list[Reply]) -> list[Reply]:
    expected = {item.call_id for item in proposals}
    replies = {item.call_id: item for item in results}
    if len(expected) != len(proposals) or len(replies) != len(results) or replies.keys() != expected:
        raise ValueError("results must match the proposed call IDs")
    return [replies[proposal.call_id] for proposal in proposals]
```

模拟器在调用业务后端前拒绝额外字段，已成功的回执只含证据 ID。重复批次按整个批次拒绝，避免一半已发出、另一半才发现关联错误。

## 串行调用、并行调用和固定查询怎么选？ {#tradeoffs}

异步可以减少独立读取的总等待，但会出现乱序、局部失败与更多在途任务。固定执行顺序对已知流程更容易审计。依赖之前的回执才能计算目标时应串行。允许模型一次提出多个动作时，运行时逐个校验风险，并确保每个动作都有可解释的终态。

## 工程实践：日志只记能定位断点的字段 {#debugging}

排查顺序是模型是否提议、运行时是否接受、业务服务是否返回、回填是否命中，以及模型请求里实际送出了什么。记录任务 ID、调用编号、工具类型、状态和耗时。参数带身份或订单正文时，保留经脱敏的关联标识。瞬时错误由工具层在任务预算内重试，业务拒绝返回清楚的状态。工具服务有副作用时还要追操作键和业务回执。

## 从动作协议继续到知识证据 {#next}

工具调用的核心是程序执行后送回可关联的事实。[运行机制示范篇](/2026/11/19/agent-engineering-foundations/#loop) 展示结果怎样驱动下一轮。[RAG 实战](/2026/11/19/agent-deep-dive-rag/) 继续讲工具返回的知识证据如何产生、如何走到交付。
