---
layout: "post"
title: "数据分析助手实战：从指标口径到只读 SQL 和可复算交付"
description: "以虚构工单看板为例，追踪指标澄清、语义查询、结果验证和制品。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/cases/data-analysis-assistant/"
engineering_topic: "cases"
engineering_series: "advanced"
engineering_id: "data-analysis-assistant"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么必须先确认指标口径？","answer":"解决率可能按创建期、解决期或期末存量定义。口径不同会产生都能运行却语义不同的查询。"},{"question":"为什么要同时限制数据库角色和查询？","answer":"只读角色限制实际操作，查询计划验证表、列、租户范围与资源成本。两层共同保护可见性和可用性。"},{"question":"怎样验证分析结果可复算？","answer":"保存数据快照、过滤、统计定义、结果和查询版本。在独立小样本里手工核对分子分母。"},{"question":"图表能否自动证明主张？","answer":"图表表现聚合结果，仍要校验分母、缺失行、时间范围与样本量。因果解释还需要更强的研究设计。"},{"question":"一个区域没有记录怎么办？","answer":"区分无样本、无权限和采集失败。没有分母时显示不可计算，并说明可用数据范围。"}]
engineering_reading: {"prerequisites":[{"title":"结构化输出","url":"/agent-engineering/capabilities/output-contracts/"},{"title":"Agent 安全边界","url":"/agent-engineering/quality/agent-trust-boundaries/"}],"next":[{"title":"开发 Agent 团队","url":"/agent-engineering/cases/development-agent-team/"}]}
---

## 先规定什么算解决率

虚构工单数据库中，团队问「上月各区域解决率是多少」。要澄清按上月创建的工单作为分母，按本次统计截止已解决的同批工单作为分子，并确认地区、时区和状态定义。模型负责识别语义与提出分析计划，受控查询器对照指标目录解释字段、范围和合法操作。

```mermaid
flowchart TB
  A["澄清指标和统计范围"] --> B["生成结构化分析计划"]
  B --> C["校验范围与成本预算"]
  C --> D["在受控只读数据上聚合"]
  D --> E["核对结果和来源"]
  E --> F["交付图表、数字和口径"]
```

## 怎样限制执行与核对结果

用允许的视图和预定义指标定义组织查询，可信身份与租户由服务注入。数据库使用最小权限只读角色，限制执行时间及结果行数。记录所选指标版本、起止区间、快照和字段。报告不应默认返回明细身份数据。更新或管理操作由另外有明确授权的流程处理。

假设地区 A 创建 100 单、解决 90，B 创建 10 单、解决 3，地区 C 暂无样本。有数据区域整体解决率为 93/110，约 84.5%。90% 与 30% 的简单平均为 60%，对应的是地区等权指标。地区 C 标为无样本，不当作零。用例还要覆盖状态变更晚到与日期跨时区。

## 让结果可以被独立复算

输出同时包含报告和结构化制品，标记数据快照、口径、各组分子分母和例外。校验行数、范围及区间边界。若资源预算不够，用预聚合视图或转后台作业，再按同一口径验收。生产时用重复运行检验指标稳定性，遇到未知字段转成澄清而非生成替代值。

## 小结

先解释指标，再提议查询与图表。用权限、成本边界和可复算制品把自然语言需求变成可靠分析。

## 参考资料

- [PostgreSQL：Privileges](https://www.postgresql.org/docs/current/ddl-priv.html)
- [PostgreSQL：Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
