---
layout: "post"
title: "有状态 Workflow：从顺序、分支与合流到等待恢复"
description: "用报销核验演算状态机、并行写入、分支契约和检查点恢复。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/stateful-workflows/"
engineering_topic: "architecture"
engineering_series: "workflow"
engineering_id: "stateful-workflows"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"节点成功就能推进整个流程吗？","answer":"节点只证明自己的产物满足该节点契约。合流节点仍要核对本轮应当出现的分支、版本和例外。部分成功可能转人工或提供只读建议。"},{"question":"合并函数有哪些基本要求？","answer":"可重试的并行节点应按稳定身份合并，重复交付无副作用。若完成顺序不固定，顺序独立的合并函数能减少恢复结果漂移。冲突无法自动调和时显式失败。"},{"question":"循环节点如何确保最终结束？","answer":"记录总截止、步数、前一轮证据和是否取得新信息。重复观察、用户取消或无法获得授权可以作为明确的停止条件。"},{"question":"把人工等待持久化需要保存哪些信息？","answer":"保存业务主体、动作参数指纹、任务版本、批准人范围、过期时间和恢复目标。恢复先核对审批与当前动作是否仍一致。"},{"question":"什么时候应保留固定路径？","answer":"高影响动作、稳定规则和必须审计的分支适合显式控制。可让模型在限定节点里整理证据或建议分支，再由宿主应用已知校验规则。"}]
engineering_reading: {"prerequisites":[{"title":"控制流与数据流","url":"/agent-engineering/architecture/control-and-data-flow/"},{"title":"单 Agent 架构","url":"/agent-engineering/architecture/single-agent-architectures/"}],"next":[{"title":"ReAct 模式","url":"/agent-engineering/architecture/react/"}],"related":[{"title":"LangGraph 图编排","url":"/agent-engineering/frameworks/langgraph-state/"},{"title":"LangGraph 持久化","url":"/agent-engineering/frameworks/langgraph-recovery/"}]}
---

## 把一次报销核验写成有状态的图

上传报销资料后，程序先验收字段，再并行核对票据金额和制度条件，必要时等待人工，最后生成核验记录。图有四个可验证的组成部分。节点读取一份确定版本的输入并产生部分结果。边表示允许的迁移。状态持有任务事实和待处理项。条件边根据验证结果挑选路径。

```mermaid
flowchart TB
  A["接收并验证字段"] --> B["核对票据"]
  A --> C["核对政策"]
  B --> D["汇总本版本结果"]
  C --> D
  D -->|需要补证且有预算| E["请求补充"]
  E --> A
  D -->|达到审批条件| F["持久等待审批"]
  D -->|可直接验收| G["保存核验记录"]
  F -->|审批有效| G
```

### 并行返回顺序会怎样改变结果

任务版本 v5 并行运行 `receipt` 与 `policy`。若两个节点都写 `status`，较晚的「查询成功」可能盖掉先到的「票据有差异」。可以按 `run_version + branch_id` 分别写入 `receipt_result`、`policy_result`。每个分支拥有明确返回状态，合流根据启动时保存的分支集合验收。重复结果按稳定 ID 去重，不同版本结果隔离。若分支可选，由启动器声明其是否进入本次集合，避免合流无期限等待。

| 条件 | 状态迁移 | 存储要点 |
| --- | --- | --- |
| 两路均有效 | 汇总后进入验收 | 存回执和政策版本 |
| 票据不完整 | 转等待补证 | 给出明确缺口和截止时间 |
| 制度服务超时 | 有预算时重试 | 不重复执行已成功分支 |
| 人工审批后金额发生变化 | 原审批失效 | 重新绑定当前金额和版本 |

工作流保存的是可恢复控制状态。运行节点的外部写入要有自己的幂等键或可信回执。保存业务记录前进程挂掉，与业务记录写成功后进程挂掉，可能看起来同样停在同一节点。恢复先核对回执，必要时用同一业务操作标识重新确认，避免重复创建。

### 用失败路径审查图

对循环定义最大次数、缺证类型和最晚结束时间。审批用显式等待状态，有拒绝、过期和取消出口。状态转移应可由旧版本事件重放，最先测试分支重复、乱序、超时和任务版本并发更新。固定流程能围住高影响步骤。动态查证可存在于有界节点里，状态图仍提供外部观察和业务验收。

## 小结

把工作流写成可核对的状态迁移。并行分支单独保存结果，合流按任务版本验收，循环和人工等待有明确出口。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [LangGraph 官方文档：Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
