---
layout: "post"
title: "记忆演进与自我改进：从反馈到可回滚的版本"
description: "区分会话适应、持久记忆、策略更新与训练，解释可追踪反馈的晋升规则。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/agent-adaptation/"
engineering_topic: "frontier"
engineering_series: "adaptation"
engineering_id: "agent-adaptation"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"会话里因反馈改变答复等于训练吗？","answer":"会话反馈可以影响当前上下文。只有受控的数据和训练流程才会改动模型参数。"},{"question":"经验怎样进入长期记忆？","answer":"先标注来源、适用范围和质量，验证并取得适当授权后再写入。低质量反馈或外部资料不能直接改变长期策略。"},{"question":"为什么策略更新应先离线评估？","answer":"反馈可能偏向活跃用户或错误指标。先用固定基线比较质量和关键失败，再选择灰度或回滚。"},{"question":"怎样处理同一问题的矛盾反馈？","answer":"区分校正事实、用户偏好与任务例外，按适用主体、时间和证据分类，保留冲突的来由。"},{"question":"什么时候认定改进有效？","answer":"在未参与适配的独立样本上改善目标指标，同时关键权限、证据和失败指标达标。"}]
engineering_reading: {"prerequisites":[{"title":"记忆助手实战","url":"/agent-engineering/cases/memory-assistant/"},{"title":"Agent 评估","url":"/agent-engineering/quality/agent-evaluation/"}],"next":[{"title":"互操作","url":"/agent-engineering/frontier/agent-interoperability/"}]}
---

## 反馈进入系统有四个不同去向

用户说「这份报告优先写结论」。系统可更新本轮草稿。若用户明确这是一项长期偏好，可写入有范围的记忆。类似反馈成规模出现，可以离线比较提示或路由策略。模型训练则是另一条带数据治理和验证的路径。把四种更新通道分开，便于解释和撤销。

```mermaid
flowchart TB
  A["记录可追踪反馈"] --> B["区分偏好、事实与流程问题"]
  B --> C["局部更新或提议离线变更"]
  C --> D["独立样本验证和审批"]
  D --> E["版本发布、监控与回滚"]
```

## 一个坏反馈怎样避免反复放大

某批用户喜欢短答，评分上涨，但合同例外被省略。优化前先区分风格满意度与事实验收，独立评估例外覆盖。旧证据和旧策略仍留可追踪版本。明确哪些反馈可写入当前用户记忆，哪些仅作为待评估建议。撤回偏好后保证派生摘要和未来调用不再复用。

## 成熟度与验收

记忆读写、版本化提示与离线回归已有可用工程做法。复杂系统持续自行发现并正确修复策略，仍需谨慎验证。验收使用独立留出集、关键约束、来源/权限核对和成本统计。每个上线改动都应能关联反馈、策略版本、评估结果和回滚条件。

## 小结

先判断反馈的对象和适用范围，再选择记忆、配置或训练路径。系统改进依赖独立验证和可回滚版本。

## 参考资料

- [LangGraph：Memory](https://docs.langchain.com/oss/python/langgraph/memory)
- [OpenAI：Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)
