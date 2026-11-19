---
layout: post
title: "四个 Agent 实战，验证从客服到平台的工程能力"
description: "依次做智能客服、Research Agent、多 Agent 开发系统和企业平台。每个案例都给出输入、执行图、代码、可验证的结果与优化方向。"
date: 2026-11-19 20:21:00 +0800
category: Tech
engineering_topic: cases
content_kind: 工程方法
tags: [Agent, Case-Studies, RAG, Planning, Multi-Agent]
continue_reading: /2026/11/19/agent-engineering-frontier/
outline:
  - id: support
    title: "智能客服 Agent"
  - id: research
    title: "Research Agent"
  - id: development
    title: "Multi-Agent 开发系统"
  - id: platform
    title: "企业级 Agent 平台"
  - id: ladder
    title: "四个案例怎样递进"
---

这组练习从只读订单问答开始，再逐步引入跨来源证据、多角色交接和多租户平台。四个案例用合成数据，可以在本地重复运行。先看每个案例要交付什么，再决定要实现哪些能力。

## 智能客服 Agent {#support}

**入门。** 用户输入订单号和问题，系统交付订单进度、政策出处和转人工状态。模型负责表达与必要的工具选择，业务接口负责身份校验。先看四类验收请求怎样驱动工具与检索的设计。

[阅读智能客服 Agent](/2026/11/19/agent-case-support/)

## Research Agent {#research}

**进阶。** 用户给出研究问题，系统交付有来源映射的报告和仍缺少的证据。规划器把问题拆成子题，搜索与核验分开保存，按新证据修订报告。

[阅读 Research Agent](/2026/11/19/agent-case-research/)

## Multi-Agent 开发系统 {#development}

**进阶。** 用一个合成函数的需求变更观察规格、实现、审查和测试怎样交接。Supervisor 按结构化产物和检查结果推进阶段，失败可以追到具体步骤。

[阅读 Multi-Agent 开发系统](/2026/11/19/agent-case-development/)

## 企业级 Agent 平台 {#platform}

**高级。** 接受多租户请求，给不同业务 Agent 分派任务。重点是统一验证身份、Agent 权限与工具范围，保留任务状态和一份能够追踪的运行记录。

[阅读企业级 Agent 平台](/2026/11/19/agent-case-platform/)

## 四个案例怎样递进 {#ladder}

| 案例 | 可验收的核心交付 | 新增的失败模式 |
| --- | --- | --- |
| 智能客服 | 查到本人的订单，答复引用现行政策 | 查到他人订单，或旧条款进入答案 |
| Research | 每条结论有证据，缺口进入报告 | 同源转载被当成独立证据 |
| 多 Agent 开发 | 实现版本、审查结果、测试证据能匹配 | 测试了旧产物，或失败后不断重试 |
| 企业平台 | 各租户按权限提交、执行并查询任务 | 混用身份、队列重投或权限在执行前变化 |

[前置知识：评估、安全与可观测性](/2026/11/19/agent-engineering-quality/) · [进阶阅读：前沿技术与趋势](/2026/11/19/agent-engineering-frontier/)
