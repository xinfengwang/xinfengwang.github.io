---
layout: "post"
title: "LangGraph 持久化：Checkpoint、Interrupt 与恢复执行"
description: "理解 Thread、持久快照、重放与审批恢复，区分图状态和外部业务回执。"
date: "2026-11-20 12:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frameworks/langgraph-recovery/"
engineering_topic: "frameworks"
engineering_series: "langgraph"
engineering_id: "langgraph-recovery"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"thread_id 能当访问令牌使用吗？","answer":"不能。它只是与快照关联的标识。查询、恢复和中断接口都需要独立验证用户对任务和目标的权限。"},{"question":"为什么写操作不宜放在 interrupt 前面？","answer":"相同节点恢复时可能从头执行，审批前副作用也更难解释。将写动作放在后续节点，并用稳定幂等键保护重放与崩溃恢复。"},{"question":"Checkpoint 已经指向下一步，能证明外部服务成功吗？","answer":"图状态能记录已接收的回执。若只有本地步骤名而没有可验证的业务回执，不能证明执行结果，关键动作仍需要可查的回执。"},{"question":"回放为何可能得到不同结果？","answer":"模型采样、文档版本、外部服务状态和时间都可能改变。要复盘历史事实应读取当时保存的证据和结果，重跑用于对照。"},{"question":"审批后目标金额发生变化，怎样恢复？","answer":"把审批绑定到动作摘要与状态版本。恢复时验证版本与授权，发生实质变化重新审批或回到明确的决策分支。"}]
engineering_reading: {"related":[{"title":"可靠性设计与幂等回执","url":"/agent-engineering/production/recoverable-writes/"}]}
---

## 等人工批准期间不应让进程一直等待

一个咨询工单需经理确认后才能提交。模型已经收集证据并起草操作，下一步可能在几小时后才执行。进程内变量、HTTP 连接或对话全文无法可靠表达任务停在哪里。LangGraph 的 Checkpoint 机制按图执行步骤记录状态，Thread 为同一图运行的相关快照提供范围，Interrupt 允许明确停止并等待外部恢复输入。本文基于官方 Python 持久化与 Interrupt 接口的执行语义。

## Checkpointer 保存的是图运行状态

配置 Checkpointer 后，可把一次图执行的状态快照与任务位置关联到指定 thread_id，并按实现提供恢复、历史和状态查询。内存方案可用于本地试验，跨进程恢复需要共享的持久后端和适当的生命周期策略。Thread ID 不是身份凭证，调用恢复接口须重新核验任务归属和权限。角色或授权变化后，不能仅因旧状态显示已同意便继续。

历史回放是从已有状态或历史节点出发重新执行。重新调用模型、网络接口和读取的新版本数据可能得到不同结果。对需要可核查或可复跑的任务，应保存真实证据、模型配置、版本和回执。重放时取哪种数据要明确，不能把重放结果等同于当时执行过的事实。

```mermaid
flowchart TB
  A["生成待审批动作并持久化"] --> B["Interrupt 进入等待"]
  B --> C["收到带任务版本的审批"]
  C --> D{"重新校验身份和动作"}
  D -->|通过| E["独立写入节点"]
  D -->|拒绝或已变化| F["终止或重新审批"]
  E --> G["保存业务回执和图状态"]
```

## Interrupt 恢复为什么要考虑节点从头再跑

Interrupt 会暂停并等待外部输入。官方文档所述模式通常使用同一 thread_id，通过 Command(resume=…) 继续。恢复时被中断的节点可从开头重执行，interrupt 前的代码不能假定只执行一次。因此，将不可重复的写操作放在审批之后的独立节点，并且用稳定操作标识和幂等后端保护。节点在 interrupt 前若已创建待审批记录，需要确保重入能够读取同一记录而不再创建。

审批应绑定动作内容、任务版本、人员和有效期限。用户审批后，运行时仍需确认金额、目标和授权未变化。按一个布尔值继续执行可能让批准意图绑定到另一条后来改写的动作。可在更新后要求重新审批，拒绝时走明确的取消、退回或交给人工的分支。

## 练习怎样从失败恢复

设计三种故障：审批期间进程离线、执行成功但回执未保存、恢复时用户权限已变。第一种需要持久 Checkpointer 和同一线程关联。第二种要核对外部操作 ID，因为图状态不能证明业务服务是否完成。第三种应该阻止继续，按业务规则结束或请求有权者批准。对并行步骤还需检查已完成子结果能否复用，以及重复更新是否会被正确合并。

## 小结

Checkpoint 保存图快照，Interrupt 表达等待，Resume 把外部输入送回同一任务。外部副作用要靠授权和业务回执验证，并按节点可能重入设计。

## 参考资料

- [LangGraph Python：Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph Python：Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
