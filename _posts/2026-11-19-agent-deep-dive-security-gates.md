---
layout: post
title: "Agent 安全边界，授权和人工审批应该在哪里校验？"
description: "防御外部内容改变动作，设计工具级授权、最小数据范围、审批冻结与审计。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: quality
content_kind: 工程方法
tags: [Agent, Evaluation, Reliability]
outline:
  - id: problem
    title: "一个工具看见的数据比用户多"
  - id: design
    title: "安全检查跨过哪些边界？"
  - id: verification
    title: "测试、审计与优化"
---

## 一个工具看见的数据比用户多 {#problem}

文档工具有整个资料库的读取能力，当前用户只属于客服团队。只靠 Prompt 提醒模型不要访问其他部门资料，工具仍可能把多余字段送进上下文。数据访问要由应用和服务拒绝，平台在运行时绑定用户会话、目标资源和用途。

## 安全检查跨过哪些边界？ {#design}

先识别外部网页、文件和工具结果等非可信来源，把里面的文本当资料。准入层按明确工具清单检查参数，在底层服务按租户、资源和身份限制查询。输出只返回所需数据字段。若运行脚本，隔离任务进程及工作区，控制可访问的文件、凭证和网络。人工批准对应主体、动作、目标、内容摘要和有效时间。实际执行时重查相同字段和当前权限。

```python
def approved(job, approval, now):
    keys = ("subject", "action", "target", "digest")
    return all(job[key] == approval[key] for key in keys) and now < approval["expires"]

job = {"subject": "u1", "action": "save_draft", "target": "A12", "digest": "fixture"}
assert approved(job, {**job, "expires": 5}, 4)
assert not approved({**job, "target": "B13"}, {**job, "expires": 5}, 4)
```

这是对审批记录的业务核验，生产执行还要验证审批人和当下访问授权，核对内容摘要来源，并在涉及外部操作时登记可查回执。

## 测试、审计与优化 {#verification}

测试合成文档和合成身份时，分别检查权限错误、输入异常、审批后内容变化、权限在排队期间撤回和工具不可用。关键验收同时检查工具可见范围、模型可见片段和最终输出。审计记录授权依据、动作、范围与回执，敏感字段按用途设置留存和读取权限。

[回到质量专题](/2026/11/19/agent-engineering-quality/#security) · [OWASP Prompt Injection 指南](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) · [OWASP Excessive Agency 指南](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
