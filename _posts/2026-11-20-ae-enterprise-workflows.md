---
layout: "post"
title: "企业业务工作流实战：从采购草稿到批准、提交和补偿"
description: "用虚构采购流说明流程状态、可重试操作、异步批准与回执核对。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/cases/enterprise-workflows/"
engineering_topic: "cases"
engineering_series: "enterprise"
engineering_id: "enterprise-workflows"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"语言模型负责哪个环节？","answer":"负责理解请求、整理证据和提出候选草稿。预算、授权、审批和终态由权威系统核对。"},{"question":"审批期间怎样释放 Worker？","answer":"持久化任务状态和审阅的具体制品，进入等待状态。收到授权事件后由新的运行读取并重新验收。"},{"question":"为什么要求稳定操作 ID？","answer":"未知结果时可查询真实服务，安全重试时也可以使用同一逻辑标识防止重复写入。"},{"question":"取消流程是不是可以直接撤销已发生业务动作？","answer":"流程取消只能约束未来动作。已创建的业务对象需要按独立补偿规则、授权及当前业务状态处理。"},{"question":"怎样判断系统可以上线？","answer":"核对正常提交、参数变化、拒绝、回执丢失、并发重复与实际结果。高影响错误需要定义拒绝上线的门槛。"}]
engineering_reading: {"prerequisites":[{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"},{"title":"生产可靠性","url":"/agent-engineering/production/recoverable-writes/"}],"next":[]}
---

## 先找到具有副作用的分界

内部采购任务从材料归集、预算核对、草稿准备、授权审批走到业务提交。文档、候选制品与审批分别有版本。模型可以在准备阶段查找材料并提出草案；提交必须走确定性工作流，受预算、授权和目标对象状态约束。

```mermaid
flowchart TB
  A["收集申请和资料"] --> B["生成可审查草稿"]
  B --> C["等待绑定版本的审批"]
  C -->|已批准| D["提交并核对业务回执"]
  C -->|拒绝或变更| E["退回或结束"]
  D -->|结果未知| F["按操作 ID 复查"]
  F -->|确认结果| G["记录最终状态"]
  D -->|已确认| G
```

## 一次暂停恢复怎样避免重复采购

审批关联草稿 v4 和 10000 元申请。用户改成 12000 元后，产生 v5，旧审批不生效。批准 v5 后，Worker 记录稳定操作 ID 并调用业务系统。若外部成功但返回超时，先查询该操作，再更新任务。相同逻辑操作只保留一个真实结果，不因重投另起身份。若操作失败且当前业务允许补偿，另外建立带授权的补偿任务。

## 从小范围开始部署

先只生成草稿和理由，人工在业务系统操作。回放批准及提交验证有把握后，再对部分团队开启受控写入。门槛包括批准参数与实参一致、重复消息下实际只有一个对象、拒绝和撤权时确无副作用。把权限、证据、阶段和结果写入可追踪记录。业务回执系统独立于聊天和模型状态。

## 小结

企业自动化应在实际副作用前确认业务契约，审批与状态可恢复，最终结果可追踪。选择合适的模型环节能降低业务状态变更的随机风险。

## 参考资料

- [AWS：Transactional Outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
