---
layout: post
title: "Agent Trace 怎么打，才能找到第一个出错的节点？"
description: "用任务 ID、模型和工具 Span、版本记录及采样策略追踪一次运行。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: quality
content_kind: 工程方法
tags: [Agent, Evaluation, Reliability]
outline:
  - id: problem
    title: "从一个重复工具调用说起"
  - id: design
    title: "设计最小可用的 Span"
  - id: operations
    title: "监控、采样与排障取舍"
---

## 从一个重复工具调用说起 {#problem}

用户看见页面一直显示处理中。先从任务 ID 找本次 Trace，核对模型有没有重复选同一个动作，然后检查第二轮是否真的收到了工具结果。请求总耗时只能说明任务慢，将模型与工具分开记录才知道延迟出在哪个节点。

## 设计最小可用的 Span {#design}

| Span | 可以记录的字段 | 第一个要检查的问题 |
| --- | --- | --- |
| 任务 | 任务 ID、版本、状态、尝试次数 | 是否恢复了上一轮执行 |
| 模型 | 模型及配置标识、输入输出 token、耗时 | 第二轮带了哪些证据 ID |
| 工具 | 调用编号、经过归一化的动作类型、耗时、结果状态 | 参数是否改变，权限有没有拒绝 |
| 验收 | 失败断言、缺失证据或结果回执 | 能否返回给用户 |

OpenTelemetry 负责标准化遥测，应用可以把观测接到 LangSmith 或 Langfuse 等工具。生产保存什么字段要根据业务问得出的问题来决定。保留证据 ID 和版本可以定位大部分异常，正文、身份字段和凭证避免进入常规日志。跨队列保存父任务引用，跨服务传递关联标识。

```python
def first_failure(events):
    for event in events:
        if event["status"] not in ("ok", "skipped"):
            return event["phase"], event["status"]
    return None

events = [{"phase": "model", "status": "ok"}, {"phase": "tool", "status": "timeout"}]
assert first_failure(events) == ("tool", "timeout")
```

## 监控、采样与排障取舍 {#operations}

指标聚合任务成功、人工接管、P95 耗时、队列积压与 token。Trace 关心单条请求的顺序和依赖。正常流量可以采样，关键失败、授权拒绝和生产事故保留必要追踪。采样会影响细分场景的排查，先确认指标和日志是否仍提供完整的失败计数。维护告警阈值、保留时间和读取权限。

[前置：评估与回归](/2026/11/19/agent-deep-dive-evaluation/) · [回到质量专题](/2026/11/19/agent-engineering-quality/#observability)
