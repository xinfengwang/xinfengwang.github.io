---
layout: post
title: "Context、Memory 和 State 怎样分工？"
description: "从一次跨会话客服任务出发，设计上下文组装、短期与长期记忆、冲突处理、过期和遗忘。"
date: 2026-11-19 20:00:00 +0800
category: Tech
engineering_topic: capabilities
content_kind: 工程方法
tags: [Agent, Memory, Context, Checkpoint]
outline:
  - id: roles
    title: "生命周期与数据职责"
  - id: implementation
    title: "写入、更新与删除怎样落到代码？"
  - id: workflow
    title: "一条任务里什么时候读取它？"
---

用户上周让系统「这个订单只用英文回复」，今天用中文询问另一笔退款。运行时既有近期上下文，也可能从长期存储找到上周的偏好。它要先判断偏好究竟属于哪笔订单，状态又该从哪里恢复。

## 生命周期与数据职责 {#roles}

| 部件 | 生命周期 | 示例及负责人 |
| --- | --- | --- |
| Context | 当前一次模型请求 | 输入、最近消息、当前证据，由组装器拼装 |
| 短期记忆 | 当前会话或任务 | 对话事实、问过的澄清项，由会话存储维护 |
| 长期记忆 | 多次会话 | 明确确认的语言偏好，由有范围和留存规则的记忆服务维护 |
| State | 一次任务完成前后 | 等待审批、已保存的回执，由运行时持久化 |

摘要保存本会话仍需要的事实，关键数字、政策出处和审批ID保留结构化引用。上下文预算不足时优先保留当前目标、业务约束、必要证据。长期记忆只在符合主体、用途、有效期和权限时召回，可搭配检索分数和时间因素排序。

## 写入、更新与删除怎样落到代码？ {#implementation}

```python
def preferences(records, subject, order, now):
    eligible = [
        item for item in records
        if item["subject"] == subject and item["order"] in (None, order)
        and item["expires"] > now and item["allowed"]
    ]
    eligible.sort(key=lambda item: (item["order"] is not None, item["updated"]), reverse=True)
    return eligible[0]["language"] if eligible else None

records = [
    {"subject": "u1", "order": "A12", "language": "en", "expires": 10, "updated": 3, "allowed": True},
    {"subject": "u1", "order": None, "language": "zh", "expires": 20, "updated": 1, "allowed": True},
]
assert preferences(records, "u1", "A12", 5) == "en"
assert preferences(records, "u1", "B13", 5) == "zh"
assert preferences(records, "u1", "A12", 12) == "zh"
```

生产存储给记忆记录附来源、主体、适用范围、有效期和版本。更新要区分用户明确确认与系统推导，当前任务的明确指示优先。删除时同时识别缓存、检索索引和异步更新任务。要验证遗忘是否生效，可以用之前召回成功的查询重跑，确认记录和索引都无法再返回。

## 一条任务里什么时候读取它？ {#workflow}

服务端先恢复任务状态和权限，再用本次问题、业务证据、可用偏好生成 Context。得到模型结果后，任务检查点记录动作或等待状态。若检测到可长期复用的新偏好，先核对用户表达和范围，再写入记忆服务；把检索错误、重复偏好和用户删除动作列入评测。长期记忆越多，误召回和权限治理的成本越高。用跨会话偏好的实际重复率衡量投入。

[回到核心能力中的 Memory](/2026/11/19/agent-engineering-capabilities/#memory) · [进阶阅读：生产级恢复](/2026/11/19/agent-engineering-production/#persistence)
