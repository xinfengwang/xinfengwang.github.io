---
layout: "post"
title: "Agentic Workflow：从固定步骤到受控自治"
description: "用合同核查对比流程、工具循环和动态编排，明确何时让模型决定下一步。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/agentic-workflow/"
engineering_topic: "frontier"
engineering_series: "agentic"
engineering_id: "agentic-workflow"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Agentic 程度由什么决定？","answer":"看模型能否根据观察选择下一动作、调整路径或提出终止，以及宿主对动作和状态的约束。调用模型次数不是充分指标。"},{"question":"固定工作流为什么仍适用于 Agent 系统？","answer":"可预测的审批与写入适合固定边界。动态查证可以放在某个节点内，兼顾灵活性和可审计性。"},{"question":"需要用什么信号评价自治收益？","answer":"在同一任务集比较证据覆盖、失败恢复、单位成本和未经批准动作。按任务复杂度分层。"},{"question":"允许模型修改流程等于授权修改策略吗？","answer":"路径选择只发生在允许的图或动作集合内。工具权限、审批和预算由外部策略决定。"},{"question":"什么是可退出的 agentic 子流程？","answer":"达到验收、预算耗尽、明确无证据或取消时，可交付可核查结果及原因，释放运行资源。"}]
engineering_reading: {"prerequisites":[{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"}],"next":[{"title":"自主 Agent","url":"/agent-engineering/frontier/autonomous-agents/"}]}
---

## 从一份合同核查流程看控制权

入库、核对权限、审查草稿和终止是可写成规则的部分。证据不足时如何补充查询，可能需要根据观察选择。系统可以用固定 Workflow 套一段带预算的工具循环。Agentic 设计要解释每一阶段由谁决定下一步、哪些状态可变、哪些动作必须走权限与批准。

| 控制方式 | 技术特点 | 合适的任务 |
| --- | --- | --- |
| 确定流程 | 代码或状态图决定次序 | 条款或批准标准稳定 |
| 单点模型路由 | 模型在有限路径中选 | 表达复杂但分支可明确定义 |
| 受控工具循环 | 依据观察补查或交付 | 环境结果不确定，查询需迭代 |
| 计划与动态编排 | 调整有依赖的子任务 | 目标复杂且可独立验证子产物 |

```mermaid
flowchart TB
  A["明确目标、范围和预算"] --> B["固定流程选择任务支路"]
  B --> C["在允许范围内自适应补查"]
  C --> D["规则验收及授权"]
  D --> E["交付或说明未完成状态"]
```

## 从评估判断是否值得增加自治

给 30 条相同样本运行两个版本。固定层提供相同证据和权限。若受控循环只在 6 条缺证任务明显提升覆盖，可以把它保留在该类分支。比较其在其他任务的成本、重复调用、提前停止和错误率。经验上，业务状态和高影响动作的可验证性决定哪些区域适合放权。把自治当成逐项选择，可在测得收益时局部扩展。

## 小结

Agentic Workflow 的实用价值在受控范围内根据观察调整。固定规则与自治节点可以组合，验收关注具体业务增益和边界。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
