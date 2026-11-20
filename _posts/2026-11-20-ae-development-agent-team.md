---
layout: "post"
title: "开发 Agent 团队实战：从任务交接到可验证变更"
description: "用一个虚构文档搜索功能说明计划者、实现者、审查者与 Supervisor 的分工。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/cases/development-agent-team/"
engineering_topic: "cases"
engineering_series: "team"
engineering_id: "development-agent-team"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"什么时候应增加多个 Agent 角色？","answer":"角色需要独立信息、不同权限或不同验收视角时更有价值。简单变更可以用单 Agent 与确定性检查。"},{"question":"交接应保留什么？","answer":"保留目标、代码基线、允许修改路径、变更清单、验证结果和仍需人工判断的风险。"},{"question":"为什么审查者应看实际差异？","answer":"实现者的总结可能遗漏错误或副作用。真实 diff、约束和验证结果能独立判断。"},{"question":"同时改同一文件会怎样处理？","answer":"以独立工作区或明确文件责任避免静默覆盖。合流时比较基线和变更，发生冲突由明确归属者处理并重跑验收。"},{"question":"哪一步负责发布？","answer":"开发团队可以交付候选补丁，合并与发布遵循仓库权限和审批。候选通过本地检查不自动获得发布资格。"}]
engineering_reading: {"prerequisites":[{"title":"Supervisor","url":"/agent-engineering/architecture/supervisor/"}],"next":[{"title":"客服 Agent","url":"/agent-engineering/cases/support-agent/"}]}
---

## 一个小功能如何划分责任

虚构项目要给文档页增加标题筛选。产品要求键盘可用、现有路由不变，并保留空结果提示。Supervisor 持有需求和任务状态，计划者草拟验证条件，实现者在隔离工作区改动，审查者读取真实 diff、测试及页面证据。合并由项目授权者决定。

```mermaid
flowchart TB
  A["约定目标与基线"] --> B["实现者提交候选补丁"]
  B --> C["审查者检查真实差异"]
  C -->|发现不足| D["形成可定位的退回意见"]
  D --> B
  C -->|证据齐全| E["提交候选制品与验收"]
```

## 交接的对象是证据

计划阶段保存原规则、边界和样本。实现阶段交接文件、变更与仓库基线版本。审查者用一份固定样本核对标题命中、空状态、窄屏与键盘行为，并确认索引输出不影响其他栏目。若需求修改为跨正文全文搜索，Supervisor 应更新任务版本，按变动范围重排。旧的标题测试成果可以保留，整体完成状态必须重新确认。

## 评估团队是否值得使用

在相同的三个小任务上比较单 Agent 和团队方式。以验收通过率、返工次数、耗时和无需修改文件的变更率为指标。若单步修订主要浪费在重复总结和同步，可将审查改成实际工具核查并减少角色。对跨组件工作，再使用并行分支和独立审查。高层协调角色只处理依赖与证据，避免每位成员携带全部上下文。

## 小结

多角色开发的增益来自可独立验证的制品和责任分配。用明确任务版本和最小权限让计划、实现、审查及授权发布各自可追踪。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
