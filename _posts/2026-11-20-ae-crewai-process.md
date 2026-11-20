---
layout: "post"
title: "CrewAI：用 Agent、Task、Crew 和 Flow 描述协作"
description: "用资料核验与报告交付区分角色、任务、顺序或分层 Process，以及外层事件流。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/crewai-process/"
engineering_topic: "frameworks"
engineering_series: "crewai"
engineering_id: "crewai-process"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Agent 的 Role 和 Goal 足以确定任务完没完成吗？","answer":"Role 和 Goal 影响职责与模型行为。Task 需要声明可观察的期望输出，外部验收核对证据、结构和状态。"},{"question":"Sequential 与 Hierarchical 有什么区别？","answer":"顺序方式按计划推进任务。分层方式增加管理者负责必要的分派和结果核对，自由度更高也增加调度成本。"},{"question":"Crew 与 Flow 怎能组合？","answer":"Flow 编排确定性事件、业务条件或状态，在一个步骤中调用 Crew 完成需要多角色处理的任务，再将经验证结果写回。"},{"question":"为什么要定义角色可用工具？","answer":"限制工具能缩小模型的选择范围。可信执行层还应按实际用户和资源权限校验，避免仅靠角色文字完成授权。"},{"question":"Manager 应在何时终止重分派？","answer":"任务达到验收、无权或无证据、达到阶段截止或尝试预算时停止。返回明确缺口和已有可用制品。"}]
engineering_reading: {"prerequisites":[{"title":"单 Agent 架构","url":"/agent-engineering/architecture/single-agent-architectures/"},{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"}],"next":[{"title":"生态选型","url":"/agent-engineering/frameworks/agent-ecosystem/"}],"related":[]}
---

## 用 Task 写清楚角色要交付什么

合同核查需要阅读附件、提取版本与日期、生成比较表。CrewAI 中的 Agent 定义角色、目标和可用工具，Task 定义要做什么及期望输出，Crew 组织成员和任务。实践中应把「负责审查」展开成明确输入和产物，把条款 ID、当前生效日和证据字段纳入验收，而不仅用自然语言的角色描述。

```mermaid
flowchart TB
  A["Flow 接收任务和可信范围"] --> B["Crew 组织 Agent 与 Task"]
  B --> C["提取证据与交付候选"]
  C --> D["应用核对引用和字段"]
  D --> E["记录结果或转人工"]
```

## Process 控制 Crew 内部怎样工作

顺序 Process 适合已知「抽取、复核、整理」顺序，各任务可以接收前序产物。分层 Process 引入管理者选择工作者并核对输出。可按实际版本配置管理 Agent 或管理模型。地区知情任务存在不同工具或资料时，分层可能有价值。若核查步骤稳定，管理者重复生成计划会增加时间和费用。

| 信息 | 放在哪 | 为什么 |
| --- | --- | --- |
| 角色擅长的内容 | Agent | 制定工具与职责范围 |
| 交付格式和验收材料 | Task | 能验证每个分支的实物结果 |
| 管理或顺序的规则 | Process | 确定 Crew 内部控制权 |
| 授权、事件路由和持久状态 | 外层应用或 Flow | 决定跨团队业务流程及结束条件 |

## 什么时候需要 Flow 包围 Crew

如果资料扫描失败，应用应先控制是否补件或进入人工分支。Flow 将这些事件和状态组织为明确步骤，Crew 则在其中承担语义工作。回归时分别检查 Crew 的产物契约和 Flow 的失败转移。对于外部修改，继续使用稳定操作身份和真实回执。代码升级时检查 Process、Flow 持久化和恢复 API 的具体版本，保持业务验收固定。

## 小结

CrewAI 为角色和任务提供协作模型。用显式 Flow 管状态与关键分支，把 Crew 的自由度限制在真正需要的环节。

## 参考资料

- [CrewAI：Processes](https://docs.crewai.com/en/concepts/processes)
- [CrewAI：Flows](https://docs.crewai.com/en/concepts/flows)
