---
layout: post
title: "Supervisor 与多 Agent，为什么交接必须携带产物？"
description: "从任务委派到产物验收，比较 Supervisor、分层与点对点，处理超时、冲突和重复交接。"
date: 2026-11-19 20:00:00 +0800
category: Tech
engineering_topic: architecture
content_kind: 工程方法
tags: [Agent, Multi-Agent, Supervisor, Architecture]
outline:
  - id: topologies
    title: "三种协作拓扑"
  - id: implementation
    title: "合并时怎样拒绝错任务或重复结果？"
  - id: tradeoffs
    title: "怎样评估要不要拆 Agent？"
---

政策角色说「查到符合条件」，订单角色说「查询完成」。如果协调者只有两句文字，就没法确认它们针对同一订单、同一版本，也无法在换班后复查。多 Agent 系统的输入输出应先定义为可验证的产物合同。

## 三种协作拓扑 {#topologies}

| 模式 | 分配和验收 | 主要风险 |
| --- | --- | --- |
| Supervisor | 一个协调者分配任务、接收产物、核对冲突 | 协调节点成为瓶颈，调度策略也会误判 |
| 分层 | 父层分配子团队，子团队各自调度和汇总 | 需穿透检查预算、版本和责任 |
| 点对点 | 相邻角色从已授权范围直接移交 | 易形成转交环，审计分散 |

先把角色边界写成任务目标、引用、允许的能力和截止时间。交回任务 ID、产物版本、证据范围、状态与错误类型。角色之间传授权引用，由接手方读取，租户和资源权限继续由服务执行。

## 合并时怎样拒绝错任务或重复结果？ {#implementation}

```python
def collect(task_id, required_roles, results):
    accepted = {}
    for result in results:
        if result["task_id"] != task_id or result["role"] not in required_roles:
            continue
        role = result["role"]
        if role in accepted and accepted[role] != result["artifact"]:
            return "conflict"
        accepted[role] = result["artifact"]
    return "ready" if accepted.keys() >= required_roles else "waiting"

a = {"task_id": "job-1", "role": "policy", "artifact": "policy-v2"}
b = {"task_id": "job-1", "role": "order", "artifact": "order-receipt-9"}
assert collect("job-1", {"policy", "order"}, [a, a, b]) == "ready"
assert collect("job-1", {"policy", "order"}, [a, {**a, "artifact": "policy-v1"}]) == "conflict"
```

示例展示重复回执和冲突分支。真实系统还要校验回执签发方、任务分派记录与证据版本，设置超时和最大转交次数。到期的角色可以重新分派，使用同一任务关联与新的尝试标识，过期回包按历史记录处理。需要人工审批时保存等待节点和需要复核的证据。

## 怎样评估要不要拆 Agent？ {#tradeoffs}

先用单 Agent 运行同一批任务，再把职责分立。比较正确交付、角色误派、证据冲突、恢复成功率、等待时间和成本。拆分的依据是角色职责可独立验收，或者上下文、工具和权限确实需要隔离。只有流程顺序变化时，程序节点已经可以让职责更清晰。

[前置知识：结构化计划](/2026/11/19/agent-deep-dive-plan-execute/) · [实战：多 Agent 开发系统](/2026/11/19/agent-case-development/)
