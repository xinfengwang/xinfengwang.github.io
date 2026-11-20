---
layout: "post"
title: "Agent 可观测性：用 Trace、指标和日志解释真实运行"
description: "从一次慢任务追踪 Span、异步关联、采样、指标维度及敏感数据治理。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/quality/agent-observability/"
engineering_topic: "quality"
engineering_series: "observability"
engineering_id: "agent-observability"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Trace 和日志如何配合？","answer":"Trace 组织一次运行的跨组件时间与因果关系。结构化日志可携带 trace_id 和阶段错误，为特定 Span 提供诊断语境。"},{"question":"为什么不能把每个任务 ID 当指标标签？","answer":"每个 ID 会形成新的时间序列，增加存储与查询成本。聚合指标使用少量稳定维度，个体任务在 Trace 或日志里查。"},{"question":"Trace 采样会遗漏哪些信息？","answer":"采样可能使少数高价值与短暂错误不在 Trace 后端。用独立计数掌握总体，再在预算内提高失败、异常耗时等诊断样本的保留率。"},{"question":"重投的 Worker 怎样与原任务关联？","answer":"传播可信追踪上下文，同时记录业务 run_id 和工作项。独立消费或批量处理可用 Span Links 关联相关操作，并保留尝试身份。"},{"question":"为什么模型回复不应默认进入 Trace？","answer":"提示、回复和工具参数可能包含敏感数据。先记录计量、状态、版本和阶段，确有诊断需要的内容通过受权存储和保留策略访问。"}]
engineering_reading: {"prerequisites":[{"title":"Agent 测试体系","url":"/agent-engineering/quality/testing-agent-systems/"},{"title":"性能与成本","url":"/agent-engineering/production/latency-and-cost/"}],"next":[{"title":"评估与观测工具","url":"/agent-engineering/quality/observability-tools/"}],"related":[]}
---

## 一个超时报警怎样找到实际瓶颈

政策助手的端到端 P95 从 1.2 秒变为 2.1 秒。仅查询模型 P95 不能判断原因。应用至少记录入队、领取、两路召回、合流、模型和验收的时间，并以统一 Trace 关联。若慢样本在领取前就等待 700 毫秒，应继续看 Worker 容量和裁剪策略。如果领取及时而重排请求积压，干预点则在下游或批处理。

```mermaid
flowchart TB
  A["接入层创建运行与 Trace"] --> B["队列关联 Worker 尝试"]
  B --> C["采集检索、模型和工具 Span"]
  C --> D["聚合延迟、错误和用量"]
  C --> E["关联结构化日志与回执"]
  D --> F["报警后定位并构建回归"]
  E --> F
```

## 三类信号各解释一部分事实

| 信号 | 回答的问题 | 适合保留 |
| --- | --- | --- |
| Metrics | 某类请求多久、失败多少、资源是否饱和 | 分布、计数、队列深度与低基数维度 |
| Traces | 某次运行的阶段、关键路径和故障位置 | Span 开始结束、父子或链接、响应类别与版本 |
| Logs | 具体错误、发布或恢复事件说明了什么 | 结构化类型、时间、关联 ID 与受控摘要 |

有异步任务时，生产者向消息系统传播可识别的追踪上下文。消费者根据任务与尝试建立 Span，可用 Span Links 表达跨批次或一对多关联。运行 ID 是业务键，Trace ID 是遥测关联键，历史采样或丢失 Span 时仍能用业务记录查终态。重试单独记录尝试，避免两次尝试被统计为两个成功任务。首 Token、生成结束与业务验收完成分别计时。

## 从采样、标签和权限约束观测成本

为 HTTP 路由、模型版本、工具类别和结果类型设有限维度。每个用户、提示全文、任务 ID 适合在受控诊断记录查询，避免形成高基数指标。指标汇总独立于 Trace 采样。若希望提高失败 Trace 保留率，可以在支持的后端基于完整跟踪信号做尾部采样，同时考虑缓冲开销和未到达的 Span。GenAI 语义约定随版本演进，记录采用版本并在升级时校验仪表盘维度。

演练时主动制造一次测试队列积压和一次受控工具超时。检查警报能否按版本、运行类型快速分层，团队是否能从 Trace 跳到真实回执。检查导出前敏感字段是否清除，以及审计记录与可观测信号的访问权限是否独立。

## 小结

先用指标发现变化，再用 Trace 定位一次运行，最后用日志和实际回执核对原因。用有限维度、采样与访问策略控制成本和隐私。

## 参考资料

- [OpenTelemetry：Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry：GenAI 语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Prometheus：Histograms](https://prometheus.io/docs/practices/histograms/)
