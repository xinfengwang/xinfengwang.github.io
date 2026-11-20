---
layout: "post"
title: "自主 Agent：目标、反馈与终止的工程边界"
description: "区分运行时间与动作自治，设计可暂停、可核查的反馈循环。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/autonomous-agents/"
engineering_topic: "frontier"
engineering_series: "long-running"
engineering_id: "autonomous-agents"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"长时运行代表高度自治吗？","answer":"长时任务可能只是等待人工审批。自治描述系统根据目标和观察决定动作的范围。"},{"question":"奖励或完成分数能否直接用来终止？","answer":"只能作为一个信号。要核对验收事实、合规条件和预算，防止出现看似高分却未完成的结果。"},{"question":"如何识别无进展循环？","answer":"记录重复动作、相同证据、状态无改变和耗时。达到阈值后暂停，交付证据和未完成事项。"},{"question":"为什么取消需要检查真实副作用？","answer":"取消可能发生在外部操作完成之后。已发生动作仍需依据回执确认和单独处置。"},{"question":"怎样扩展自治范围？","answer":"先在低风险任务中测结果、错误和人工干预，用实证扩大允许行动，持续保留暂停和审查入口。"}]
engineering_reading: {"prerequisites":[{"title":"长时运行 Agent","url":"/agent-engineering/frontier/long-running-agents/"},{"title":"Agentic Workflow","url":"/agent-engineering/frontier/agentic-workflow/"}],"next":[{"title":"Agent 运行时演进","url":"/agent-engineering/frontier/agent-runtime-evolution/"}]}
---

## 自主程度取决于可决定的动作

一个资料助手在完成当前目录清单前可以调整分类或查询顺序，但不能扩张访问范围或自行发布。自治程度由可修改的计划、可访问的环境、允许动作以及审批和退出条件决定。长时间运行还需要独立的状态、租约、恢复和取消。

```mermaid
flowchart TB
  A["持有目标与工作范围"] --> B["观察和选择行动"]
  B --> C["工具权限与预算校验"]
  C --> D{"结果是否推进目标？"}
  D -->|继续且有预算| A
  D -->|完成或停机条件| E["保存实际结果和原因"]
```

## 给反馈循环设进展条件

资料版本检查的进展可以用已核对的文档数和已消解冲突数衡量。若连续几轮仅返回相同来源，停止并列出缺口。工具失败不要盲目改变目标。恢复时核对当前身份、任务版本和已有工作。即使模型提出「目标完成」，宿主仍验证实际产物和约束。

## 哪些能力已有基础，哪些仍要验证

持久运行、人工批准与有限工具循环已有成熟实现方式。开放目标、长期稳定决策和跨环境泛化仍依赖评估。按任务数、最长运行阶段、复现难度、未授权动作和人工接管成本比较自治版本。先在只读或可撤回的情境独立验证，再决定是否扩大范围。

## 小结

自主系统需要明确目标、可核查进展及停止规则。长时间存活和可控地推进任务是两种不同能力。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [LangGraph：Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
