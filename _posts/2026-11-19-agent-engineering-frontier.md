---
layout: post
title: "从 Deep Research 到长时运行，怎样读懂 Agent 的下一步"
description: "拆解 Agentic Workflow、Deep Research、Coding Agent、Browser Use、Computer Use、长任务、MCP 和 A2A、多模态、具身与持续学习。"
date: 2026-11-19 20:22:00 +0800
category: Tech
engineering_topic: frontier
content_kind: 工程方法
tags: [Agent, Deep-Research, Long-Running, Multimodal, A2A]
outline:
  - id: task-agents
    title: "Agentic Workflow、Deep Research 与 Coding Agent"
  - id: environment
    title: "Browser Use、Computer Use 与多模态"
  - id: long-running
    title: "长时任务的规划与恢复"
  - id: interoperability
    title: "MCP、A2A 与跨应用协作"
  - id: learning
    title: "持续学习与自我优化"
---

Agent 能完成十分钟任务之后，下一步可能是跨应用委派、读大量资料或运行几小时。这些变化都可以被拆成可观察的系统行为。先问它增加了哪个动作或恢复能力，再看怎样验证。

## Agentic Workflow、Deep Research 与 Coding Agent {#task-agents}

Agentic Workflow 在程序的明确流程中开放一部分模型选择。Deep Research 把问题拆成子题，搜集来源，比较说法，再输出带引用和证据强度的报告。可复核的产物包括问题树、来源元数据与引用图。检验它是否有价值，可以在同一组题上固定时间和工具预算，比较每条结论的证据覆盖、重复来源和回退率。

Coding Agent 要读代码库规则、定位相关文件、产生小范围修改并运行指定测试。看起来能自主写代码的系统，工程差异常出现在能否重跑验证、怎么识别生成了旧版本的补丁，以及谁决定宣布交付。用一个本地小函数和封闭测试集评估修改正确率、与规格的一致性及变更范围。

## Browser Use、Computer Use 与多模态 {#environment}

Browser Use 可以依赖结构化页面和可访问性信息，Computer Use 还可能根据截图与坐标执行操作。多模态系统能同时读取文本、图表与画面，仍需要为每种来源定义观察结果。页面重新布局或截图过期时，动作前重新确认目标，操作后读回可核对状态。遇到授权、付款或对外发送，权限与确认在动作入口独立校验。

具身智能多出真实时间、接触反馈和物理限制。先在仿真或离线轨迹里检查传感器延迟、观测缺失及安全停机。环境适配层负责验证动作边界，系统设计要提供独立的安全约束和人工接管。

## 长时任务的规划与恢复 {#long-running}

长任务要保存目标、计划版本、可重放记录和未完成步骤。阶段性评估能发现任务偏离，也能决定是否还要花预算。将外部不可逆操作作为单独阶段，写入完成要取回回执。下面的函数用已持久化的观察做三类恢复决策，便于把恢复条件写成测试。

```python
def resume_action(checkpoint, receipt):
    if checkpoint["stage"] == "awaiting_approval":
        return "wait"
    if checkpoint["stage"] == "awaiting_receipt":
        return "record_completion" if receipt else "investigate"
    return "resume_plan"

assert resume_action({"stage": "awaiting_receipt"}, "receipt:8") == "record_completion"
assert resume_action({"stage": "awaiting_receipt"}, None) == "investigate"
```

## MCP、A2A 与跨应用协作 {#interoperability}

MCP 能连接工具和上下文，A2A 能连接独立 Agent。跨应用后，审计要能追到哪个组织或服务执行了动作、传出了哪些数据、任务取消后如何处理迟到产物。验证时可以让远端任务处于需补充输入的状态，再演练重复通知和权限到期，检查调用方有没有把任务误记成完成。

## 持续学习与自我优化 {#learning}

把反馈做成候选改动，例如补充一条稳定偏好、调整检索配置或增加新的工具路由。候选必须能追到来源、变更范围和回滚版本。先去重和脱敏，再用固定评测集与线上样本验证。自动优化可用来提出规则和 Prompt 候选，涉及权限、流程或发布策略时，由授权的发布过程确认。

| 待验证方向 | 先固定的变量 | 观察什么 |
| --- | --- | --- |
| 更长的执行 | 时间、动作预算和故障点 | 暂停、恢复、取消能否重放 |
| 多模态输入 | 同一组页面及图片 | 读到的证据、操作目标和最终状态 |
| 跨应用协作 | 远端角色权限和协议版本 | 任务关联、数据范围和回执 |
| 持续学习 | 固定基线、候选与评测集 | 按场景比较变化，核对可回滚性 |

[前置知识：四个实战案例](/2026/11/19/agent-engineering-cases/) · [回到开发闭环：任务合同](/2026/11/19/agent-engineering-foundations/#task-contract) · [延伸阅读：Agent Runtime](/2026/09/15/agent-runtime-overview/)
