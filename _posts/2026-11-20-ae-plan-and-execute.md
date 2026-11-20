---
layout: "post"
title: "Plan-and-Execute：让计划成为可验证的执行契约"
description: "从多供应商比价看计划结构、依赖、局部作废和重新执行。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/plan-and-execute/"
engineering_topic: "architecture"
engineering_series: "patterns"
engineering_id: "plan-and-execute"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么自然语言计划很难恢复？","answer":"它一般没有动作输入、依赖、版本和验收定义。用可检查字段将步骤与产物绑定，恢复时才能从确知状态继续。"},{"question":"Planner 可以给执行器授予写入权限吗？","answer":"Planner 提议动作和依赖。执行器必须检查可信身份、业务策略、批准范围和当前资源状态，计划文本不能授权。"},{"question":"怎样判断应当局部重规划？","answer":"找到变化的前提及依赖它的节点。未使用该前提的产物可以在复核时效后保留，受影响的节点和下游结果按新版本重建。"},{"question":"计划第 6 步超时后要重跑第 1 到 5 步吗？","answer":"若步骤 1 到 5 的产物仍有合法版本并满足有效期，不必重做。第 6 步先根据副作用与回执判定可重试或需核对。"},{"question":"计划执行完如何确认任务完成？","answer":"将输出与用户目标、范围、证据和验收标准比较。允许有主流程都结束但报告仍缺证据的状态。"}]
engineering_reading: {"prerequisites":[{"title":"任务规划","url":"/agent-engineering/capabilities/planning-and-replanning/"},{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"}],"next":[{"title":"Reflection","url":"/agent-engineering/architecture/reflection/"}],"related":[{"title":"ReAct","url":"/agent-engineering/architecture/react/"}]}
---

## 比价任务为什么需要有形的计划

采购同事要比较 A、B、C 三家报价，统一货币和税费，说明差异并生成可审查的清单。即使三个报价可并行读取，归一化也必须看到三家资料的版本和日期。Plan-and-Execute 将这些依赖写入计划，执行器按计划领取和验收工作。随环境变化可以更新计划。

### Planner 应交给执行器什么

计划包含目标、已确认假设、步骤依赖、工作预算，以及每步可检查的输出。例如节点 `normalize` 依赖 `quote:A`、`quote:B`、`quote:C` 和 `fx:v1`。结果必须含报价版本、金额、币种、税率适用时间和依据。执行器先验证节点设定是否引用允许的工具、依赖是否存在、是否有闭环和越权动作。工具获取真实报价后，按工作项记录可验证产物。

```mermaid
flowchart TB
  A["形成目标与验收标准"] --> B["生成有依赖的计划"]
  B --> C["验证并逐步执行"]
  C --> D{"产物或前提变化？"}
  D -->|前提变化| E["局部作废并更新计划版本"]
  E --> C
  D -->|满足验收| F["交付证据与结果"]
  D -->|暂时失败| C
```

三份报价已取回时，C 发来修订版。只让 C 重取，并使归一化后的总表及审查失效。A 和 B 在确认现行性后可保留。若汇率也必须按新时点重新计算，则生成 `fx:v2` 后重跑所有依赖汇率的归一化结果。迟到的旧 C 通过计划版本识别并隔离，不应覆盖新结果。

### 和直接循环、固定 Workflow 怎样组合

当步骤少且下一步高度取决于即时观察，ReAct 的寻路成本较低。固定 Workflow 适合重复业务规则，强调明确状态与审批。Plan-and-Execute 适合任务要拆出多个有独立产物的分支，并需动态更新依赖图。可以固定「验收计划、核对权限、提交」三个外部边界，在其中按计划调度取证节点。每步最长等待和任务全局预算都需要留下记录，禁止计划重算不断延长预算。

## 小结

计划是对目标、输入、输出、依赖及失败路径的声明。执行器验证与记录真实结果。重规划从受影响的前提出发，复用仍适用的产物。

## 参考资料

- [Wang 等：Plan-and-Solve Prompting](https://arxiv.org/abs/2305.04091)
- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
