---
layout: "post"
title: "研究助手实战：从问题拆解到可核查报告"
description: "围绕一个虚构选型问题，设计检索、证据账本、冲突处理与停机条件。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/cases/research-assistant/"
engineering_topic: "cases"
engineering_series: "advanced"
engineering_id: "research-assistant"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么研究任务需要保留证据账本？","answer":"主题式摘要可能丢失出处、时间和冲突。账本让每条主张关联原文与判断条件，并支持中断后恢复。"},{"question":"相互矛盾的资料应该怎样呈现？","answer":"先确认版本、范围和口径是否一致。若仍冲突，写清双方证据和不能消解的原因，避免凭数量投票。"},{"question":"如何决定停止继续查找？","answer":"检查子问题覆盖、来源质量、预算与新增证据收益。已到截止且关键证据缺失时交付限制与待核对项。"},{"question":"为什么不能把搜索摘要直接当证据？","answer":"摘要可能截断语境或采用旧内容。对关键结论访问权威来源，保留可核对位置和时间。"},{"question":"并行子研究最容易出现什么问题？","answer":"不同分支可能重复搜同一来源或使用不同口径。共享研究约束和来源标识，在综合前核对覆盖、重复与冲突。"}]
engineering_reading: {"prerequisites":[{"title":"RAG 基础","url":"/agent-engineering/rag/rag-foundations/"},{"title":"任务规划","url":"/agent-engineering/capabilities/planning-and-replanning/"}],"next":[{"title":"数据分析助手","url":"/agent-engineering/cases/data-analysis-assistant/"}]}
---

## 研究问题先变成验收条件

假设团队要比较两种内部文档检索方案，关心引用质量、数据访问控制和更新成本。输出为三维比较表及证据索引。应用先把任务拆为三个子问题，为每项声明适用时间、首选证据和缺证策略。金额、性能或兼容性若只得到营销说法，用「未验证」表示。

```mermaid
flowchart TB
  A["固定问题、范围和截止时间"] --> B["拆解并查找材料"]
  B --> C["写入证据账本"]
  C --> D["检查覆盖与冲突"]
  D -->|缺证且有预算| B
  D -->|达到验收或预算| E["输出报告及证据"]
```

## 查询、取证和综合怎样配合

搜索发现来源，读取阶段核对发布方、日期、版本和原文。将来源 ID、原文定位、主张草案及限制写入账本。例子中方案 A 的延迟来自 100 条合成查询，方案 B 的延迟来自实际高峰，两者不能直接判输赢。综合阶段可以先展示两个运行条件，并提出同负载复测。引用是供读者核查的一部分，不能用无证据的措辞掩盖差距。

研究 Agent 可为不同维度并行派发查证；资料不足的维度允许再查。浏览仅访问获授权的公开资料或内部范围，模型不根据网页文字改变系统任务。以预算、截止和可验证覆盖决定何时停。保存搜索词、已读来源和未解决问题，恢复时避免重复消费相同资料。

## 用失败样本验收

将过时文档、两个相似但版本不同的事实和只有摘要没有原文的来源放进受控素材。检查报告标出未覆盖维度、保留冲突、合并重复来源，并让读者能够从比较表走到引用。记录有效引用比例、覆盖和耗时。若某个结论依赖缺失数据，即使表格完整也应降为待证。

## 小结

研究助手的可交付物包括报告与证据账本。查询负责找材料，综合负责解释可比较性，预算和缺证规则保护研究范围。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
