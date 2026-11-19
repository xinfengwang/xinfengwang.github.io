---
layout: post
title: "LangGraph 从 State 到 Checkpoint，审批以后从哪里继续？"
description: "用同一份状态走过分支、暂停及恢复，区分调用栈、运行线索与外部业务回执。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: frameworks
content_kind: 工程方法
tags: [Agent, Framework, MCP]
outline:
  - id: problem
    title: "先明确框架要解决什么"
  - id: design
    title: "画出节点和运行标识"
  - id: implementation
    title: "用原生节点描述一次暂停"
  - id: tradeoffs
    title: "框架选择怎样做实测"
---

## 先明确框架要解决什么 {#problem}

一个客服服务可以在一个函数里查单、起草并返回。但人工可能隔天才批准保存申请，普通调用栈无法跨进程留住状态。LangGraph 的 Node 接收并更新 State，Edge 连接步骤或根据状态选择分支，Checkpointer 提供持久化。应用仍要定义任务边界及业务验收。

## 画出节点和运行标识 {#design}

草稿节点输出申请摘要；审批节点读取摘要并暂停；保存节点收到批准结果后重新校验身份和目标版本，再提交同一个操作编号。重复启动的请求需要查任务状态，恢复时沿原来的 thread 标识。把未完成与已完成的工具动作分别记录，Node 恢复时可能重新进入，因此对外部写入必须单独设计幂等。

## 用原生节点描述一次暂停 {#implementation}

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command, interrupt

class State(TypedDict):
    draft: str
    decision: str

def approve(state: State):
    decision = interrupt({"draft": state["draft"]})
    return {"decision": "accepted" if decision is True else "declined"}

builder = StateGraph(State)
builder.add_node("approval", approve)
builder.add_edge(START, "approval")
builder.add_edge("approval", END)
graph = builder.compile(checkpointer=InMemorySaver())
run = {"configurable": {"thread_id": "sample-1"}}
graph.invoke({"draft": "A12", "decision": "pending"}, config=run)
assert graph.invoke(Command(resume=True), config=run)["decision"] == "accepted"
```

代码依赖 LangGraph，使用内存检查点演示同一进程的暂停和恢复。进程重启后的测试要换持久化实现，并加入访问隔离。恢复逻辑只读取审批结果，外部写入放到独立节点前检查批准内容和回执。排查时同时看 thread 标识、已恢复的节点、操作编号和目标系统版本。

## 框架选择怎样做实测 {#tradeoffs}

写三条同样的验收用例：暂停到隔天、进程在提交后退出、一次审批超时。固定流程可直接把状态写进数据库。跨更多节点、分叉和循环时，图运行时能集中表达状态转移和运行历史。用恢复用例的维护成本和失败分类来比较两种实现。

[回到框架总览](/2026/11/19/agent-engineering-frameworks/) · [LangGraph 官方中断说明](https://docs.langchain.com/oss/python/langgraph/interrupts)
