---
layout: "post"
title: "企业级 Agent 平台：工具治理、租户调度与审计"
description: "用共享平台上的两个团队说明权限、版本、容量、知识库与追责的实施路径。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/production/governed-agent-platform/"
engineering_topic: "production"
engineering_series: "platform"
engineering_id: "governed-agent-platform"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"平台共享工具是否意味着各租户都能调用？","answer":"工具注册表示平台认识该能力。运行时仍需明确主体、作用域、环境和业务审批，底层服务独立验证授权。"},{"question":"为什么任务记录应保留当时的策略版本？","answer":"追责时要理解当时的判断与配置。恢复或重新执行时仍应按当前授权判断，不直接沿用过期的批准或权限。"},{"question":"限流是全平台统一还是按租户分配？","answer":"通常需要总预算和租户级上限共同存在。按任务优先级、风险和延迟目标组织队列，记录被限流的原因和恢复条件。"},{"question":"工具下线后旧任务怎么办？","answer":"注册表标记禁止新派发，并为在途任务规定迁移、替换或转人工路径。已发生操作仍保留回执和必要的审计信息。"},{"question":"共享索引如何避免跨租户倾斜与泄露？","answer":"索引查询和原文回读都使用可信租户与授权。必要时采用分区或独立资源，应结合容量、隔离风险和撤权验证选择。"}]
engineering_reading: {"prerequisites":[{"title":"企业级 Agent 架构","url":"/agent-engineering/architecture/enterprise-agent-architecture/"},{"title":"部署与回滚","url":"/agent-engineering/production/deployment-and-rollbacks/"}],"next":[],"related":[{"title":"生产 RAG 架构","url":"/agent-engineering/rag/rag-production/"},{"title":"工具运行时","url":"/agent-engineering/capabilities/tool-runtime/"}]}
---

## 从两个团队共享平台说起

采购团队查询合同并在审批后提交草稿。人事团队查询政策，工具仅限只读。两者可共享模型和队列基础设施，但数据、访问授权、预算与任务交付分开。平台控制面维护 Agent 注册、发布版本、可用工具、知识库绑定及配额。执行面按任务声明与当前身份处理，留下可核对的行为结果。

```mermaid
flowchart TB
  A["控制面发布工具、策略和知识绑定"] --> B["入口按租户建立任务"]
  B --> C["配额与优先级调度"]
  C --> D["Worker 重新核对资源和身份"]
  D --> E["授权的检索与业务操作"]
  E --> F["记录任务、回执和审计"]
```

## 工具与知识库怎样治理

| 记录 | 典型字段 | 谁负责核验 |
| --- | --- | --- |
| Agent 发布版本 | 团队、模型配置、工作流、可用能力 | 发布流程与测试 |
| 工具登记 | 版本、读写级别、责任团队、可用环境 | 工具所有者与执行层 |
| 知识库绑定 | 索引代、租户、来源和数据保留 | 检索层及权威原文服务 |
| 运行记录 | 主体、任务版本、配额、策略和结果 | 任务服务与审计平台 |
| 业务操作 | 操作标识、批准、返回与最终对象 | 业务服务 |

部署新工具时先定义最小授权测试。使用两个仅编号相同的合同验证租户隔离。删除注册工具需明确禁止新派发，对在途任务查看是否使用该版本及是否已有副作用。索引撤权由访问和回读层立即生效，缓存与索引清理可在后台追踪。审计只保留能说明责任和结果的数据，全文按来源系统的权限读取。

## 防止共享容量造成租户之间的耦合

设平台允许 40 个并行工具请求。两个租户各配 12 个保留额度，其余 16 个可按需求共享。持续满载时，剩余额度由队列策略公平分配，避免一个租户重试占满所有共享额度。分别观测队列等待、拒绝率、关键任务成功、成本和续跑失败。对合规或独立容量要求较高的租户，可采用隔离索引、Worker 或完全独立数据面。

验收覆盖三类扰动：权限撤回、共享模型降级、一个租户流量突然增加。审计应能回答哪个版本和主体触发动作、采取了哪条路径、业务系统最终怎样记录。对恢复任务同时保留历史事实与当前权限判定。

## 小结

平台治理把注册、权限、容量和审计建立在任务及资源的明确边界上。共享能力要通过租户隔离、持久版本与真实回执证明能够安全复用。

## 参考资料

- [Kubernetes：Multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/)
- [OpenTelemetry：Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
