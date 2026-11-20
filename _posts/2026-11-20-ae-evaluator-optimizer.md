---
layout: "post"
title: "Evaluator–Optimizer：用独立评分组织有界改进"
description: "将引文质量、业务硬门槛和改进预算分开，比较反馈循环与单次反思。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/evaluator-optimizer/"
engineering_topic: "architecture"
engineering_series: "patterns"
engineering_id: "evaluator-optimizer"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么需要硬门槛与软评分两层？","answer":"硬门槛约束必过条件，例如可访问引用和事实。软评分比较已合格候选的解释清晰度。分开后一个语言流畅度高的候选无法抵消越权或错误引用。"},{"question":"用同一个模型担任生成器与裁判可靠吗？","answer":"角色隔离有助于组织职责，但模型可能共享盲区。关键事实用外部证据及规则检查，软评分用人工校准与稳定样本衡量。"},{"question":"怎么判断循环已经收敛？","answer":"同时检查硬门槛、质量目标、迭代次数、总截止和连续无改进次数。达到预算后选择最好的合格候选，若无合格候选则报告缺口。"},{"question":"评分升高能证明用户获得更好的结果吗？","answer":"在线评分可能奖励更长的文字或特定风格。用独立回归样本和人工复核校准，向生产验收反馈真实完成率和主要错误类型。"},{"question":"与 Reflection 的主要结构差异是什么？","answer":"Reflection 用具体反馈修订候选。Evaluator–Optimizer 将生成、评分、比较和停止做成可替换组件，适合对多个版本按一致标准排序。"}]
engineering_reading: {"prerequisites":[{"title":"Reflection","url":"/agent-engineering/architecture/reflection/"},{"title":"结构化输出","url":"/agent-engineering/capabilities/output-contracts/"}],"next":[{"title":"Human-in-the-Loop","url":"/agent-engineering/architecture/human-in-the-loop/"}],"related":[{"title":"Agent 评估","url":"/agent-engineering/quality/agent-evaluation/"}]}
---

## 审查报告需要什么样的反复改进

合规报告既要可读，也必须准确引用现行条款。生成器先给候选报告。Evaluator 使用统一的规则与评分表，判定证据覆盖、引用可核查和解释层次。Optimizer 根据反馈调整候选。宿主保留候选、检测无进展，并决定何时交付。生成器可以是模板，也可以是模型。评估器由确定性检查、证据比对和生成式评价共同构成。

```mermaid
flowchart TB
  A["生成候选与引用"] --> B["运行硬校验与软评分"]
  B --> C["保存结果和最优候选"]
  C --> D{"达标或停止？"}
  D -->|仍可改进| E["按反馈局部修订"]
  E --> B
  D -->|停止| F["交付合格候选或标记缺口"]
```

| 候选 | 引用授权及事实硬检查 | 可读性（满分 5） | 处理 |
| --- | --- | ---: | --- |
| A | 通过 | 3 | 保留为当前最优 |
| B | 一处引用已失效 | 5 | 不进入候选池 |
| C | 通过 | 4 | 优于 A，可以交付 |
| D | 通过 | 4 | 比较覆盖与长度，避免无上限迭代 |

设置总预算或无进展阈值。例如至多 2 次额外改写，同时要求全部硬条件通过、简洁度达到 4。将评估回执写成缺失字段、源 ID、失败条件和允许改动范围。缺证来自检索时应回到取证流程。只给「再润色」会让评价与修订脱离业务事实。

### 校准评价，与真实任务结果对齐

用独立人工样本检查评价尺度，对成对候选交换顺序以排除位置偏差。生成时保留规则、模型和数据版本。比较单次生成、一次局部反思和多轮优化的质量、尾部延迟及成本。对容易的任务提前跳过循环。若评价反复提高而人工通过率下降，先检查评分准则。需要审批的步骤仍由授权者承担，评分门槛只处理产物质量。

## 小结

用分离的生成和评分组件组织反馈循环。先过硬约束，再比软指标，保留最优合格候选并限制改进成本。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Zheng 等：Judging LLM-as-a-Judge](https://arxiv.org/abs/2306.05685)
