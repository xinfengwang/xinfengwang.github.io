---
layout: post
title: "ReAct 怎么落地，工具结果怎样改变下一步？"
description: "用物流状态的三种分支实现有界 ReAct，讨论动作集合、回填、预算与停止条件。"
date: 2026-11-19 20:00:00 +0800
category: Tech
engineering_topic: architecture
content_kind: 工程方法
tags: [Agent, ReAct, Planning, Tool-Use, Architecture]
outline:
  - id: design
    title: "需要哪些运行组件？"
  - id: implementation
    title: "实现有界循环"
  - id: tradeoffs
    title: "如何判断值得用 ReAct？"
---

查单以后发现包裹已交接，但订单工具没返回承运商的扫描事件。固定流程可以对每笔订单都查询扫描记录。另一种设计是让模型看订单结果后，判断还有没有必要再查。ReAct 适合解决这类下一步依赖新观测的问题。

## 需要哪些运行组件？ {#design}

当前任务和工具观测形成可见状态。决策层根据这些信息选择一个动作，例如读取订单、查扫描事件或结束。Executor 校验可用工具和参数并执行，按调用编号保存结果。完成条件由验收器检查。这里关心的是可核对的动作与依据，可以用运行记录复盘错误。

## 实现有界循环 {#implementation}

```python
def run(choose, tools, finish, maximum_steps=3):
    observations = {}
    for _ in range(maximum_steps):
        action = choose(dict(observations))
        if action == "finish":
            return finish(observations)
        if action not in tools or action in observations:
            return "stopped"
        observations[action] = tools[action]()
    return "budget_exhausted"

def choose(observed):
    if "read_order" not in observed:
        return "read_order"
    if observed["read_order"] == "handed_off" and "read_scan" not in observed:
        return "read_scan"
    return "finish"

assert run(choose, {"read_order": lambda: "handed_off", "read_scan": lambda: "received"},
           lambda result: result["read_scan"]) == "received"
assert run(lambda _: "read_order", {"read_order": lambda: "ok"}, lambda _: "ok") == "stopped"
```

根据两次观测记录得到三种分支：订单仍在仓库时可以结束，已交接时补查扫描，无权访问时停止。真实动作会带参数，重复检测要比较工具与归一化参数。验收失败需要新的有效证据，避免循环用原样输入反复请求。

## 如何判断值得用 ReAct？ {#tradeoffs}

用相同的物流任务给固定工作流和 ReAct 各跑一次。统计合格交付率、工具总数、重复调用率、超时和中止原因。固定规则能覆盖已知分支时，留一小段有界搜索往往就够用。依赖很多、需要提前展示进度的任务可换成显式计划，再让各节点保留局部决策。

[回到架构模式总览](/2026/11/19/agent-engineering-architecture/#planning-patterns) · [下一种模式：Plan-and-Execute](/2026/11/19/agent-deep-dive-plan-execute/) · [ReAct 论文](https://arxiv.org/abs/2210.03629)
