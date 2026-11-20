---
layout: "post"
title: "Deep Research：规划、证据覆盖与可追溯综合"
description: "比较普通问答和长程研究，关注多路线证据、主张审计与评估界线。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/deep-research/"
engineering_topic: "frontier"
engineering_series: "research-coding"
engineering_id: "deep-research"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"多搜索轮次一定提高质量吗？","answer":"仅当新增搜索提高关键问题覆盖或证据可靠性才值得。重复引用与未核对来源不应计为新增证据。"},{"question":"为什么研究 Agent 要保存主张与来源的映射？","answer":"长报告的段落可能综合多个来源。按主张映射可检验对应原文、时间与适用条件。"},{"question":"独立子研究适合怎样拆分？","answer":"让各子问题有清楚的范围和可验收产物，共享去重标识。涉及相同证据时由合流处理口径。"},{"question":"系统在什么情况下应报告无法证实？","answer":"关键材料不可靠、来源互相冲突或没有足够覆盖时，注明哪些结论无法下定，保留其证据和限制。"},{"question":"如何判断商业研究产品的能力已经成熟？","answer":"查看产品范围、数据访问、独立测试与可审计性。只根据公开示例或单项基准无法保证本业务适用。"}]
engineering_reading: {"prerequisites":[{"title":"研究助手实战","url":"/agent-engineering/cases/research-assistant/"}],"next":[{"title":"Coding Agent","url":"/agent-engineering/frontier/coding-agent/"}]}
---

## 长报告怎样把检索变成证据生产

Deep Research 常包含多步公开资料检索、分解子问题、回顾查证和综合报告。普通问答通常围绕一次上下文组装，长程研究则要维护目标、来源账本、代理分工和未解决问题，并可以在新证据改变前提时重排计划。

```mermaid
flowchart TB
  A["划定问题、来源和停止条件"] --> B["并行查找独立证据"]
  B --> C["记录主张、来源和版本"]
  C --> D["审查覆盖、重复和冲突"]
  D -->|仍有价值| B
  D -->|满足预算| E["综合报告及限制"]
```

## 从一个证据错误推到系统设计

研究三个产品的功能。一份文档来自 Beta 发布，另一份是旧版价格说明。若合流只看片段相似度，可能把功能、版本、价格拼成不存在的组合。给每条主张保存产品、版本、观测日、支持段落及反证。跨分支比较时先对齐对象和时间，对无权访问或不可复核资料另行标记。研究报告引用的可靠性可按抽样主张逐条核对。

## 能力现状与评估

公开产品已经能展示多步浏览与报告生成。面向特定业务的资料完整性、时效与引用支持仍要验证。对照相同问题的单轮 RAG、有限多步检索与并行研究，记录每个子问题覆盖、引用定位准确率、新增资料贡献和单位成本。将搜索失败、上下文遗漏与综合错误分开归因。

## 小结

Deep Research 将搜索、证据账本和综合组织成长程任务。质量来自可核对的主张、明确限制和来源对照。

## 参考资料

- [OpenAI：Introducing deep research](https://openai.com/index/introducing-deep-research/)
- [Anthropic：How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
