---
layout: post
title: "Agent 评估实战，把一次线上错误变成发布门禁"
description: "从上线失败生成测试夹具，对照基线、候选与关键分组，分别检查过程和产物。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: quality
content_kind: 工程方法
tags: [Agent, Evaluation, Reliability]
outline:
  - id: fixture
    title: "从失败轨迹提取样本"
  - id: rubric
    title: "定义机器检查和语义评分"
  - id: gate
    title: "把样本接到发布流程"
---

## 从失败轨迹提取样本 {#fixture}

用户在知识库有权限，任务仍说找不到政策。复盘需要输入、会话范围、数据版本、工具回执和预期交付。去除非必要的账户内容，保留可建立同一现象的合成示例。为知识库补一条正确证据项，为端到端验收补一条引用要求。前者能快速定位检索，后者证明改动最后传到了交付。

## 定义机器检查和语义评分 {#rubric}

程序判断任务状态、禁止动作、引用来源 ID、写入回执及审批关系。人工或模型辅助评审关注结论是不是由原文支持、重要条件是否遗漏、用户是否得到明确的后续路径。用人工评分校准评估器，固定评审规则与版本。多步任务查看首次偏差，不同时重算后面所有环节。

```python
def compare(baseline, candidate):
    assert baseline.keys() == candidate.keys()
    return {
        "improved": [key for key, passed in baseline.items() if not passed and candidate[key]],
        "regressed": [key for key, passed in baseline.items() if passed and not candidate[key]],
    }

assert compare({"A": True, "B": False}, {"A": False, "B": True}) == {
    "improved": ["B"], "regressed": ["A"]
}
```

## 把样本接到发布流程 {#gate}

候选用同一份数据和相同任务比较结果，记录随机性和重复运行分布。对身份、工作区、任务类型分组，单独看关键用例。越权和未批准写入是独立门禁，不能由其他任务得分抵消。灰度前留好基线与回放入口，线上受影响的案例在修复后再测一次。

[回到评估与安全](/2026/11/19/agent-engineering-quality/#evaluation) · [下一篇：可观测性](/2026/11/19/agent-deep-dive-observability/)
