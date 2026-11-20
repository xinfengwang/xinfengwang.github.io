---
layout: "post"
title: "结构化输出：从 JSON Schema 到可验证的 Agent 输出契约"
description: "用同一份审批草稿区分合法 JSON、结构约束、业务判断和宿主校验。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/capabilities/output-contracts/"
engineering_topic: "capabilities"
engineering_series: "prompt"
engineering_id: "output-contracts"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"有效 JSON 为何仍无法驱动工作流？","answer":"JSON 只保证数据可解析。字段缺失、枚举写错、两字段矛盾甚至引用无权限的资料都可能出现在合法 JSON 中。工作流还需要结构契约和业务验收。"},{"question":"缺字段和 null 有什么区别？","answer":"缺字段表示生产者没有提交该字段。null 可以是契约明确允许的空值。若消费者用 null 表示待补证据，应在 Schema 和业务枚举里同时定义，并约定如何处理。"},{"question":"约束解码为什么不能证明一条引用真实？","answer":"约束器主要判断输出是否还能形成符合结构的序列。一个形状正确的来源 ID 仍可能指向当前用户不可见、已经过期或没有读到的条款。宿主需要使用本次证据集合核对。"},{"question":"同一份输出什么时候适合重试？","answer":"若遇到暂时连接失败，可在预算内重试。若源文件缺权限，重试模型无法获得授权，应转到待补信息或人工处理。若模型拒绝或达到长度上限，应按平台回执单独分类。"},{"question":"为什么扩充枚举也可能让旧客户端出错？","answer":"生产者接受了新枚举值，旧消费者的分支却只处理原有值。先使消费者兼容未知状态或做版本隔离，再切换生产者，避免把未知结果误归到成功分支。"}]
engineering_reading: {"prerequisites":[{"title":"Prompt Engineering","url":"/agent-engineering/capabilities/prompt-design/"}],"next":[{"title":"Function Calling","url":"/agent-engineering/capabilities/tool-calling/"}],"related":[{"title":"工具运行时","url":"/agent-engineering/capabilities/tool-runtime/"}]}
---

## 审批草稿有三个不同的成功条件

人事助手需要给出一个动作建议，告诉流程系统是继续提交草稿、索要资料，还是转人工。模型回答「看起来可以报销」对读者有意义，流程系统却无法确定下一状态。最直接的改法是要求 JSON。输出 `{"decision":"approved"}` 能解析，但系统要的是 `draft_ready`，而且批准本身属于人工审批。可用契约同时定义**数据形状、业务状态和状态的验证人**。

在这个案例中，宿主已把现行条款限定在用户可见范围，并把检索结果以来源 ID 提供给模型。模型生成建议和引用。宿主对引用、条件和工作流状态做校验。任何真正的提交仍调用单独的授权工具。

## 明确每个字段在消费者眼里的含义

下例把待补资料表示为 `missing_info`，让每个分支返回相同字段集合。空数组代表没有附带来源。该例使用 JSON Schema 对象属性与必填字段，业务约束留给宿主。

```json
{
  "type": "object",
  "properties": {
    "decision": {
      "type": "string",
      "enum": ["draft_ready", "missing_info", "manual_review"]
    },
    "source_ids": {
      "type": "array",
      "items": {"type": "string"}
    },
    "reason": {"type": "string"}
  },
  "required": ["decision", "source_ids", "reason"],
  "additionalProperties": false
}
```

JSON Schema 全规范支持多种组合和条件。模型 API 通常只支持某些子集，提交前按实际服务核对。上例统一字段集合，有利于多个消费者接入。若某字段必须区分「合同明确没有上限」与「无法确认上限」，应用显式状态表达两种结果，避免用一个空字符串承载两种意义。跨字段规则也应写清楚，例如 `draft_ready` 至少有一个可访问来源，`missing_info` 要指出哪个业务条件缺失。

## 从模型输出到状态迁移

```mermaid
flowchart TB
  A["指令、证据和结构约束"] --> B["模型生成候选结果"]
  B --> C{"服务回执与结构有效？"}
  C -->|有效| D["宿主核对证据与业务条件"]
  C -->|拒绝或截断| E["记录失败类型并结束或恢复"]
  D -->|核对通过| F["进入对应业务分支"]
  D -->|缺证或冲突| E
```

只用 Prompt 约定格式时，模型仍可能加 Markdown 围栏或漏字段。JSON 模式主要约束语法。支持结构化输出的服务可以在解码时依据 Schema 限制候选后缀。拒答、中断和输出长度上限仍需按服务回执处理。宿主先区分回执，再解析并验证结构，最后核对语义。

例如用户问「会议延期的改签费能否报销」，模型给出 `draft_ready` 和 `P-17`。虽然枚举正确，应用查到 P-17 已失效。若本次还有现行条款，宿主可要求按这些证据重新组织一次。若可见资料不存在，结果进入待补信息。两种情况都应保留失败阶段，评估时才能区分「格式不合规」和「证据不足」。

## 让契约可演进

一份契约至少有模型输入、宿主校验和消费者三个位置。变更枚举、字段或空值语义时，维护可追踪的契约版本。通过旧结果回放、拒绝和截断样例验证消费者，再逐步切换生产者。日志记录解析失败、Schema 失败和业务失败各自数量，排查时可以直接定位改动属于哪一层。工具调用同样会使用参数 Schema，但会额外经过身份、授权与动作审计。

## 小结

结构约束降低机器消费的歧义。引用是否真实、数据是否可见、业务状态能否变更，由拥有这些事实的宿主或业务服务验证。为缺证和人工分支设计明确的输出，对整个 Agent 的可靠性有直接影响。

## 参考资料

- [JSON Schema 官方文档：Objects](https://json-schema.org/understanding-json-schema/reference/object)
- [OpenAI API：Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
