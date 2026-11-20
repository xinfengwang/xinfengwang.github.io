---
layout: "post"
title: "部署与回滚：镜像、工作流状态和数据版本怎样一起演进"
description: "从 CI 构建到 Kubernetes 滚动更新和灰度门禁，说明长任务与独立模型服务怎样交付。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/production/deployment-and-rollbacks/"
engineering_topic: "production"
engineering_series: "deployment"
engineering_id: "deployment-and-rollbacks"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么回滚镜像不等于回滚整个服务？","answer":"状态 Schema、数据库迁移、队列消息、模型路由和索引代可能已经改变。部署应记录版本组合和兼容约束，再按可验证条件回滚。"},{"question":"readiness 和 liveness 各报告什么？","answer":"readiness 用于判断实例是否可接入服务流量。liveness 用于判断进程是否应重启。临时下游变慢通常不宜直接变成所有 Pod 的重启条件。"},{"question":"滚动发布期间如何保护长任务？","answer":"停止接收新任务，将已领取任务完成或安全释放。把可恢复状态留在持久层，并让 Worker 识别任务及工作流版本。"},{"question":"怎样判断灰度是否应该暂停？","answer":"同时看成功率、权限拒绝异常、最长等待和端到端延迟，并检查关键任务分组。只看全站平均值可能掩盖特定失败回归。"},{"question":"为什么扩展模型服务与扩展 API 可以分开？","answer":"API 入口、Agent Worker 和推理资源的瓶颈不同。按队列等待、连接数和模型吞吐分别扩缩，明确上游限流避免把拥塞推给下游。"}]
engineering_reading: {"prerequisites":[{"title":"流式 Agent API","url":"/agent-engineering/production/streaming-agent-api/"},{"title":"状态与会话","url":"/agent-engineering/production/session-state/"}],"next":[{"title":"性能与成本","url":"/agent-engineering/production/latency-and-cost/"}],"related":[{"title":"文档 Agent 发布与回滚实战","url":"/2026/11/18/document-agent-release/"}]}
---

## 发布的是一组可追踪的运行版本

政策核查应用从测试切到线上，变化可能包括 OCI/Docker 镜像、状态结构、提示词、工具参数、模型服务和向量索引。构建流水线执行锁定依赖和测试，再生成可标识的镜像。环境映射区分数据库、凭据、对象存储和队列。运行日志记录该任务采用的镜像、工作流、模型和索引版本，迅速识别哪种组合出现问题。

```mermaid
flowchart TB
  A["CI 构建、测试与记录版本"] --> B["发布到隔离环境"]
  B --> C["小流量验证与回归"]
  C --> D{"质量与容量门槛通过？"}
  D -->|通过| E["扩大流量并观察旧任务"]
  D -->|未通过| F["暂停、回滚或向前修复"]
```

## 容器滚动更新时怎样处理长任务

使用独立的 API、Worker 和推理服务时，各自测连接、任务堆积和模型吞吐。Kubernetes Deployment 的 rollout 控制 Pod 版本和可用性。对 Worker 的关闭处理，停止新领取，给进行中的任务有限收尾时间。未完成工作留在持久状态与队列，用已验证的版本恢复。readiness 控制就绪流量，进程重启条件由 liveness 等信号表达。初期可用启动探针保护需要较久初始化的容器。若使用长连接，主动验证负载均衡、连接断开与事件重放。

## 为回滚保留可读的版本组合

从状态 v1 增加一个必填字段时，可以先引入兼容读取，并让新字段可由旧数据推导或补齐，在旧 Worker 清空后再收敛 Schema。若直接删除旧字段，旧镜像就可能读不回现有长任务。新索引和查询向量必须匹配，回退同样需要切回相应配置。模型服务如果独立部署，先用相同任务验证路由与证据指标。

灰度把新请求分配给小流量群组，并保留可比较的基线。对比结果须同时看可靠性、否决与授权路径，以及真实业务回执。出现「平均成功率相同但关键组退化」时，暂停放量。回滚后验证计划继续、旧任务可读、事件可回放和索引引用可打开。对已发生业务写入，回滚应用无法撤回业务状态，需要另外依据操作回执处置。

## 小结

用 CI 记录版本和证据，按流量与长任务兼容性决定切换。回滚要同时检查状态、依赖与已有副作用。

## 参考资料

- [Docker：Building best practices](https://docs.docker.com/build/building/best-practices/)
- [Kubernetes：Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Kubernetes：Liveness、Readiness 与 Startup Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
