---
layout: post
title: "LLM 与 Prompt，怎样让 Agent 稳定输出可执行决策？"
description: "从模型选型、系统指令和少样本示例出发，设计结构化输出的校验与评测。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: capabilities
content_kind: 工程方法
tags: [Agent, Prompt, LLM]
outline:
  - id: problem
    title: "从一次错误路由开始"
  - id: design
    title: "把约束布置在正确的地方"
  - id: implementation
    title: "用代码把模型输出变成受控动作"
  - id: evaluation
    title: "怎么做第一轮选型"
---

## 从一次错误路由开始 {#problem}

客服询问「能查查 A12 吗」。一个版本返回了 `read_order`，另一个生成了「我正在查」，却没有产生动作。模型选型先固定任务、工具定义、上下文和评分规则。以结构合格率、正确工具率、业务验收、P95 延迟和每次成功成本评价。输出更长、推理预算更大等改动可以单独测，避免几个因素同时变化。

## 把约束布置在正确的地方 {#design}

系统指令放角色、允许范围、证据和停止条件。Few-shot 示例选正确决策难靠规则解释的边界，例如缺订单号要输出 `ask`，不能猜一个值。Structured Output 可以限定形状和枚举，服务端对资源、身份、状态和动作重新校验。工具的 JSON Schema 与业务结果分别校验，前者保证参数能解析，后者保证可交付。

## 用代码把模型输出变成受控动作 {#implementation}

```python
def decide(payload, allowed_actions):
    if payload.get("action") not in allowed_actions:
        return "reject"
    if payload["action"] == "read_order" and not payload.get("order_id"):
        return "ask"
    return payload["action"]

assert decide({"action": "refund"}, {"ask", "read_order"}) == "reject"
assert decide({"action": "read_order"}, {"ask", "read_order"}) == "ask"
```

空回复、结构错误和工具拒绝应分别进入观测。先做有限次数的结构修复，预留剩余时间供工具和验收器使用。长上下文压缩时，优先保留任务约束与必需证据，再检查少样本示例和引用是不是被裁掉。记录实际 token 与配置版本，让线上问题能够重跑。

## 怎么做第一轮选型 {#evaluation}

用一组包含缺项、冲突、正常和越界请求的样本，让快模型与强模型各跑同一组。分类和字段抽取可以使用低成本模型，复杂证据判断可以路由给更强的模型。保留每类失败原样本，核对路由增加的延迟和误路由风险。

[回到核心技术](/2026/11/19/agent-engineering-capabilities/#model-prompt) · [进阶：Function Calling](/2026/11/19/agent-deep-dive-tool-use/)
