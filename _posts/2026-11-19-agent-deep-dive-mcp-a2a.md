---
layout: post
title: "MCP 和 A2A 的边界，从一次跨应用研究任务看清"
description: "区分工具调用、Agent 任务通信、权限传播、任务关联和外部产物验收。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: frameworks
content_kind: 工程方法
tags: [Agent, Framework, MCP]
outline:
  - id: problem
    title: "研究任务遇到两个外部依赖"
  - id: mcp
    title: "MCP 连接工具和材料"
---

## 研究任务遇到两个外部依赖 {#problem}

用户让研究助手对比三份授权资料。调用文档搜索服务时需要工具名称、参数和证据回执。请求另一部门的研究 Agent 做一项核验时，则需要远端接受任务、更新进展和交回产物。这两条链路有不同的中间状态与失败方式。

## MCP 连接工具和材料 {#mcp}

Host 管理客户端连接，服务端按能力暴露 Tools、Resources 和 Prompts。客户端发现工具定义后应按应用的能力和权限选择是否执行。读到工具响应，保存执行状态和来源字段。用户授权范围由可信服务根据身份判断，工具自己的说明可以帮助选择，不能扩大访问权限。

## A2A 连接远端任务 {#a2a}

根据 Agent Card 发现服务能力与认证要求。发送消息后，根据协议和实现可获得响应或关联的任务，通过状态更新、轮询或事件获取进展。产物处理前核对任务关联、租户和资料范围。需要追加输入时，运行时保存远端任务 ID，收到用户补充再继续。超时、取消、结果迟到都应定义本地状态。

```python
def accept_artifact(expected, event):
    if (event["task"], event["scope"]) != (expected["task"], expected["scope"]):
        return "reject"
    return "complete" if event["status"] == "completed" and event.get("artifact") else "waiting"

job = {"task": "remote-12", "scope": "team-a"}
assert accept_artifact(job, {**job, "status": "completed", "artifact": "record-1"}) == "complete"
assert accept_artifact(job, {**job, "scope": "team-b", "status": "completed"}) == "reject"
```

例子展示业务层的任务关联，未复刻某个 SDK 的接口。连接两个协议时用同一个本地任务 ID 关联工具调用与远端任务，保留协定版本、授权范围及产物摘要。工具定义变化可以版本化，远端任务则需要另外处理取消和重复状态更新。

[回到框架总览](/2026/11/19/agent-engineering-frameworks/#protocols) · [MCP 规范](https://modelcontextprotocol.io/specification/) · [A2A 规范](https://a2a-protocol.org/latest/specification/)
