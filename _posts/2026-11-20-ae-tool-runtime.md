---
layout: "post"
title: "工具运行时：从调用 ID、权限判定到并发与回执"
description: "沿一次报销查询和草稿提交理解 Registry、执行器、并行边界、回填关联及恢复。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/capabilities/tool-runtime/"
engineering_topic: "capabilities"
engineering_series: "tools"
engineering_id: "tool-runtime"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Registry 和执行器各持有什么？","answer":"Registry 管工具的版本、结构、能力声明和适配入口。执行器拿到已选版本及本次身份、资源和预算，完成实际执行与回执处理。登记了能力只意味着宿主可识别该能力。"},{"question":"两个调用返回顺序反了怎么办？","answer":"按运行作用域和调用 ID 将回执关联原请求，而不是用数组位置配对。还需适配模型接口要求的消息顺序，保留工具状态并对重复回执去重。"},{"question":"两个读工具一定能并行吗？","answer":"若下游读需要上游返回的条款 ID，或两个调用争抢同一不可并用的资源，就存在顺序约束。独立读取还要约定快照一致性、并发上限和结果合并。"},{"question":"调用 ID 与业务幂等键为何同时需要？","answer":"调用 ID 描述一次模型消息中的工具请求。模型重试可能产生新调用 ID。幂等键标识同一个业务动作，可在跨尝试和跨进程时寻找原回执。"},{"question":"HTTP 超时后凭什么决定能否重试？","answer":"先判定操作类型和交付结果是否未知。独立只读请求可使用受控重试。写请求以同一业务操作标识核对回执，仅在下游明确支持对应幂等语义时重发。"},{"question":"工具 Schema 通过后还要核对什么？","answer":"宿主需核对身份、租户、资源作用域、操作资格及当前状态。结构正确的单号可以属于别的用户，也可能已归档或正在被其他任务更新。"}]
engineering_reading: {"prerequisites":[{"title":"Function Calling","url":"/agent-engineering/capabilities/tool-calling/"},{"title":"结构化输出","url":"/agent-engineering/capabilities/output-contracts/"}],"next":[{"title":"MCP 生命周期","url":"/agent-engineering/frameworks/mcp-lifecycle/"}],"related":[{"title":"可恢复写入","url":"/agent-engineering/production/recoverable-writes/"}]}
---

## 模型发出调用之后有三方职责

员工希望查 C-27 的状态、查看现行报销政策，并在有需要时提交说明草稿。模型可以同时提出 `get_claim` 和 `find_policy`。宿主必须决定这两个操作能否执行，以及实际完成后怎样把对应结果交给模型。业务系统负责对单号归属、规则版本和最终写入作权威判定。

Registry 存工具的稳定名称、版本、输入契约、读写性质以及调用适配器。工具发现应先按任务、身份和作用域筛选，再让模型在可用候选中选择。任务身份与可信租户由宿主注入，避免让模型输入中的 `tenant_id` 直接变成授权凭据。工具执行器领取一次具体调用，跑超时、授权、结果验证与记录。MCP 可以承载发现和调用，远程声明仍需进入宿主的工具信任与治理流程。

## 按调用 ID 建立一条可追踪链路

```mermaid
sequenceDiagram
  participant M as 模型
  participant H as 宿主
  participant T as 工具执行器
  participant S as 业务服务
  M->>H: 提议工具名、参数和调用 ID
  H->>H: 绑定身份、能力版本与资源授权
  H->>T: 分发许可的调用
  T->>S: 请求或查询业务回执
  S-->>T: 成功、失败或待核对
  T-->>H: 带调用 ID 的结构化结果
  H-->>M: 按接口约定回填并继续
```

用同一轮的两个读取看并行细节。模型发出编号 `c1` 的单据查询和编号 `c2` 的政策查询。政策缓存先返回 `c2`。等待另一路成功后，宿主将结果关联各自调用，记录证据版本和时间，再按模型 API 规定提交结果。若 `c1` 返回拒绝，宿主保留拒绝状态，只暴露最少的失败信息。同时有旧政策和现行政策时，优先查询运行开始时明确的生效日期及允许范围。

| 工具请求关系 | 执行方式 | 需要守住的约束 |
| --- | --- | --- |
| 两路独立读 | 同批并发 | 并发上限、各自剩余时间和数据版本 |
| 查单得到报销类型后读规则 | 顺序 | 用可信上游结果补足下游业务条件 |
| 两项动作将写同一单据 | 用业务版本或锁串行协调 | 发现版本冲突后复核，避免覆盖 |
| 读取与写入引用同一草稿 | 写前复核最新状态 | 先前读取成功不能替代当前授权 |

## 把错误按可恢复性表达

结构无效时，给模型安全、具体的错误类型，允许在剩余预算内修正。权限拒绝后应等权限条件变化或更换可读对象。临时只读失败可退避重试，仍需尊重运行级截止时间。写入请求超时且结果未知时，需要单独的待核对状态。业务系统支持幂等时，跨模型调用与进程恢复应复用同一业务键。批准与工具参数绑定，关键参数变更后重新核对批准范围。

工具输出也属于外部数据。适配器应解析必要字段、控制返回大小，并为来源和失败类型保留可机读标识。模型可组织说明和提出下一步，最终动作资格与实际回执由运行时判定。验证并行路径时，至少覆盖回执乱序、部分失败、写后超时及授权发生变化四种情况。

## 小结

工具运行时把概率式工具选择转化成有主体、版本、结果和权限的操作。独立读可以有界并发。写入恢复必须围绕业务操作与可信回执建模。

## 参考资料

- [OpenAI API：Function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Model Context Protocol：Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [IETF RFC 9110：HTTP 方法和幂等语义](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods)
