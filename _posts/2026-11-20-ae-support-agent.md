---
layout: "post"
title: "客服 Agent 实战：政策证据、订单状态与人工接管"
description: "用订单咨询与改址草稿串联检索、实时状态、授权、回执和升级。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/cases/support-agent/"
engineering_topic: "cases"
engineering_series: "enterprise"
engineering_id: "support-agent"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"客服政策与订单状态分别从哪里来？","answer":"政策来自可溯源的规则与版本，订单状态来自可信订单服务。当前订单状态不能由历史文档或记忆推断。"},{"question":"能否用客户历史偏好直接执行改址？","answer":"历史信息可用于澄清或提示。具体动作仍要核对当前身份、订单状态、目标地址和有效批准。"},{"question":"什么情况下应该升级人工？","answer":"政策冲突、身份无法确认、写入结果未知或超过客服权限时均可升级，携带最少必要上下文和已有证据。"},{"question":"为什么正确的分流也能算成功？","answer":"若任务的业务规则要求转人工，及时交接是正确终态。统计时需要与自主解决分开。"},{"question":"怎样避免从回复误判为改址成功？","answer":"核对订单服务最终状态和可信回执。若尚未确认，应在回复里明确待核对。"}]
engineering_reading: {"prerequisites":[{"title":"知识库问答","url":"/agent-engineering/cases/kb-question-answering/"},{"title":"Agent 安全边界","url":"/agent-engineering/quality/agent-trust-boundaries/"}],"next":[{"title":"企业业务工作流","url":"/agent-engineering/cases/enterprise-workflows/"}]}
---

## 一个问题含两类信息和一个可能的动作

客户问「快递发出了吗，如果没有，能修改地址吗」。模型先辨别查询和动作意图。订单服务给实时状态，政策库给当前可用的改址规则。用户只询问能否修改时输出可核查建议；若用户另行确认具体目标，才进入有批准保护的改址流程。

```mermaid
flowchart TB
  A["确认身份与意图"] --> B["查订单状态及现行政策"]
  B --> C{"请求与授权满足动作条件？"}
  C -->|仅查询| D["解释并引用"]
  C -->|允许| E["核对对象状态、执行和回执"]
  C -->|未知或超范围| F["转人工并带证据"]
  E --> D
```

## 状态变化会改变权限

假设查询显示订单尚在揽收前，用户确认了新地址。批准绑定订单身份与新地址摘要。执行前再次读取订单版本。如果订单已发出，则原条件发生变化，应依据当前政策转人工或说明不可修改。若提交超时，查询同一业务操作 ID，回传「待核对」而不是承诺完成。

政策片段、实时状态和实际回执分别留来源。避免把完整客户历史直接转给人工或记录进通用 Trace。人工接手看到问题、已核对证据、拒绝或等待原因，以及下一步该确认什么。

## 验收分清四类结果

测试样本覆盖正常咨询、政策换版、提交前状态变化和响应丢失。分别统计自主解决、正确转接、未经批准的动作和真实回执一致性。业务通常重视正确拒绝和真实完成率，不能只统计生成回复的条数。逐个复核变更状态的运行，确认没有同一动作重复提交。

## 小结

客服 Agent 把政策和订单事实连接到明确的状态机。工具真实结果决定完成，人工接管处理无法自动核对的边界。

## 参考资料

- [OpenAI：Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)
