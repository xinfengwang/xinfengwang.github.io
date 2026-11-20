---
layout: "post"
title: "Supervisor：把分派、结果整合与终止交给协调者"
description: "用支持工单解释能力匹配、任务回执、冲突处理和主管故障转移。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/supervisor/"
engineering_topic: "architecture"
engineering_series: "patterns"
engineering_id: "supervisor"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Supervisor 与 Router 有何区别？","answer":"Router 为一次输入选择处理路径。Supervisor 处理进行中的工作，有权按契约委派多项工作、核对结果、追加申请或终止。"},{"question":"协调者何时可以重新分派工作？","answer":"任务超时或工作者明确拒绝时，先确认原工作状态及是否可能已经产生副作用。只读任务可按新尝试分派，写入要核对持久回执和有效权限。"},{"question":"多路结果中的冲突由谁裁决？","answer":"Supervisor 依据统一口径比较来源、时间和证据范围，能确定的按规则合并。无法裁决的冲突要明确交给有权限的人或报给用户。"},{"question":"协调者重启时从哪里继续？","answer":"从持久记录中恢复已领取工作、已通过的回执、当前版本和待验收依赖。不要只凭聊天记录推断各工作者是否已执行。"},{"question":"什么情况下单 Agent 更合适？","answer":"固定路径、相同权限且各工具输出可直接合并时，单运行时并行调用更少交接与成本。动态拆解和专门角色能改善复杂分支时用主管模式。"}]
engineering_reading: {"prerequisites":[{"title":"多 Agent 协作","url":"/agent-engineering/capabilities/multi-agent-collaboration/"}],"next":[{"title":"Hierarchical","url":"/agent-engineering/architecture/hierarchical/"}],"related":[{"title":"Router","url":"/agent-engineering/architecture/router/"}]}
---

## 委派后的任务仍需要一个验收人

支持工单称「产品发货慢，还需要修改配送地址」。协调者先拆为只读核对物流、查询当前配送规则。修改地址是潜在副作用，必须依赖前置条件和另外的授权。Supervisor 负责分配与验收工作，工具执行器保留真正的权限判定。协调者不能把模型声明的「已完成」作为业务回执。

```mermaid
flowchart TB
  A["主管确定目标与待办"] --> B["物流工作项"]
  A --> C["政策工作项"]
  B --> D["主管核对回执与冲突"]
  C --> D
  D -->|必要证据已齐| E["交付建议或接入审批"]
  D -->|仍可补查| A
```

### 分派消息与回执是协议

请求消息包含任务 ID、版本、前置制品引用、所需能力、可使用工具范围、截止时间和成功条件。物流工作者可以返回 `found` 和运输状态回执，政策工作者可能返回 `blocked` 并说明缺少目的地地区。主管按工作 ID 标记待补信息并保留可用结果。若角色看到了更高权限数据，回执还要核对接收人的可见范围。

Supervisor 需要保存当前任务版本和工作分派状态。子 Agent 用独立产物提交证据，主管写任务级验收。子 Agent 重试后若报告相同结果，按稳定 ID 去重。若不同工作者重复提交同一工作项，比较当前版本和证据后保留一条可用结果，同时记录冲突。

### 从控制单点扩展到可恢复协调

主管逻辑不一定由一个长寿命模型会话执行。使用持久任务状态与接续机制，新的工作进程可读取待验收证据。如果主管成为瓶颈，先测队列、上下文长度和重复分派。可以分批合并、把固定决策移入规则、按权限域分层。评估时加上工作者拒绝、旧回执晚到和主管恢复三类故障，判断工作有没有丢失或重复执行。

## 小结

Supervisor 的关键职责是分派、验收和任务终止。先把输入、能力、权限和可核对结果写成工作项，再增加协调者的自动决定范围。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Wu 等：AutoGen](https://arxiv.org/abs/2308.08155)
