---
layout: "post"
title: "Reflection：让问题可诊断，修改可验证"
description: "用一次引用修订区分自评、外部反馈和确定性验证。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/reflection/"
engineering_topic: "architecture"
engineering_series: "patterns"
engineering_id: "reflection"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"什么反馈可以驱动有意义的反思？","answer":"说明具体目标、违反的条件和可查证的依据。报告「P4 为旧版，现行 G7 未被使用」比只说不够好更能指导局部修复。"},{"question":"为什么同一个模型检查自己的输出仍可能漏掉错误？","answer":"生成器和评审器可能共享相同误解。格式与事实应通过独立规则、真实数据或人工核对，反思负责整理修复候选。"},{"question":"反思一次后发现更多错误怎么办？","answer":"先比较稳定验收条件与前一候选，若退化可以保留原稿。设迭代上限，仍无有效进展时返回缺口或交给人工。"},{"question":"Reflection 与重规划在哪些层级使用？","answer":"反思调整一个判断或草稿。若反馈推翻任务范围、依赖或已执行计划的前提，则回到规划层，作废相关产物。"},{"question":"何时将反馈写进长期记忆？","answer":"经过单独验证、来源明确且可迁移的经验才适合写入。一次失败的模型解释可以留在当前回执，避免持续传播错误规则。"}]
engineering_reading: {"prerequisites":[{"title":"Agent 推理与搜索","url":"/agent-engineering/capabilities/reasoning-and-search/"}],"next":[{"title":"Evaluator–Optimizer","url":"/agent-engineering/architecture/evaluator-optimizer/"}]}
---

## 从一句「再检查一下」到可定位的修订

助手草拟采购合规说明，引用条款 P4 并推荐审批人。核对服务发现 P4 过期，当前可见条款 G7 调整了金额线。Reflection 对候选产物生成有针对性的反馈，再修改候选重新验收。关键输入是可证实的缺陷和影响范围。允许模型根据证据重拟表述，不能用模型自评补齐不存在的事实。

```mermaid
flowchart TB
  A["生成带来源的草稿"] --> B["校验版本、字段和引用"]
  B -->|定位到具体缺陷| C["生成最小修订建议"]
  C --> D["生成修订稿"]
  D --> B
  B -->|通过| E["交付核对后的稿件"]
  B -->|无进展或超出预算| F["保留可用信息并报缺口"]
```

检查器给出问题代码 `source_expired`、位置「第 2 条」、观察版本 P4、新证据 G7、允许调整的字段以及停止预算。修订只替换受影响结论，保留其余已核实引用。修订后重新检查全部引用，以防修正某一字段时破坏其他条款。

### 哪些反馈来自规则，哪些适合让模型处理

| 反馈 | 建议职责 |
| --- | --- |
| 条款撤销或版本超期 | 权威元数据和规则判断 |
| 结论与原文事实冲突 | 以明确条款比对，复杂语义加人工抽检 |
| 表达难理解 | 模型或人工提供修改建议 |
| 缺少业务决策所需事实 | 有授权时补证，否则报告缺口 |

轮次内保存初稿、修订前后差异和验收结果。失败反馈如果涉及根本前提，应递交规划器处理，而非重复修改文字。对于开放主题可用 Reflection 辅助发现遗漏。确定字段和引用校验可以直接由工作流拒绝，节省额外模型调用。

## 小结

Reflection 将可证实反馈变成有范围的修订。有效性来自独立核查、可比较的候选和明确退出，不取决于生成多少轮解释。

## 参考资料

- [Shinn 等：Reflexion](https://arxiv.org/abs/2303.11366)
- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
