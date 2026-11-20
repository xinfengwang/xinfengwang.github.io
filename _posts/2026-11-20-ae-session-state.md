---
layout: "post"
title: "状态与会话：分清 Session、Thread、Run 和 Checkpoint"
description: "沿两次对话和一次审批暂停理解状态归属、版本竞争与断点恢复。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/production/session-state/"
engineering_topic: "production"
engineering_series: "state"
engineering_id: "session-state"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么 Session ID 不等于登录身份？","answer":"Session 是应用层会话容器。同一会话标识能否读取或恢复，服务还应核对当前用户、租户与资源。"},{"question":"Thread、Run 和 Checkpoint 如何关联？","answer":"Thread 聚合同一执行上下文内的运行。Run 表示一次触发。Checkpoint 在指定执行点记录状态以及恢复所需位置和版本。应用需定义各自的归属。"},{"question":"两个请求同时更新审批状态怎么办？","answer":"以预期状态与版本完成原子条件写入。成功方产生新版本，另一方重新读并判断是否拒绝、重试或合并。避免以最后到达为默认胜者。"},{"question":"恢复时如何处理过期批准？","answer":"核对动作版本、主体资格、批准有效期和目标资源状态。若条件改变，按当前业务规则返回等待或终止。"},{"question":"聊天历史足以恢复一条长任务吗？","answer":"聊天历史可解释用户意图，不能证明已执行步骤和副作用。恢复依赖可信任务状态、工件和外部业务回执。"}]
engineering_reading: {"prerequisites":[{"title":"Agent 项目分层","url":"/agent-engineering/production/agent-project-structure/"},{"title":"LangGraph 持久化","url":"/agent-engineering/frameworks/langgraph-recovery/"}],"next":[{"title":"数据持久化","url":"/agent-engineering/production/storage-for-agents/"}],"related":[]}
---

## 用户看见一段对话，系统维护多种状态

员工上午查差旅规定，并留下一份待审批草稿。下午另开对话询问客户招待。批准上午草稿的人可能是业务审核员，应用的登录会话可能也已刷新。若把这些对象共享同一个 ID，恢复时容易串用聊天、权限和任务状态。不同框架的命名会有差异，项目应先写清对象关系。

| 概念 | 示例含义 | 常见寿命 |
| --- | --- | --- |
| Session | 应用级交互容器，归某个主体 | 可跨多次请求 |
| Conversation | 用户可读的消息与引用 | 由产品保存和清理策略决定 |
| Thread | 编排状态与历史快照的关联范围 | 可包含多个 Run |
| Run | 一次具体图调用、恢复调用或任务触发 | 从开始到已完成、失败或中断 |
| State | 当前阶段、证据、待办与操作身份 | 随事件更新 |
| Checkpoint | 可恢复位置与一份状态快照 | 使用后端的保留与版本策略 |

```mermaid
flowchart TB
  A["身份及会话归属"] --> B["选择 Thread"]
  B --> C["创建 Run"]
  C --> D["提交带版本的 Checkpoint"]
  D -->|审批等待| E["暂停并释放 Worker"]
  E -->|授权有效| C
```

## 防止迟到事件推进新状态

设草稿在 v7 等待同意。取消请求与批准同时到达。存储可以按「期望 v7 且当前处于等待」做原子条件更新。若取消先成功成为 v8，批准请求应返回冲突并读取当前状态。若批准先到达，批准也不代表外部提交已完成。执行前再次确认批准内容、当前身份和目标资源。业务回执独立保存，用来核对未知结果。

读取进度时可以使用缓存。涉及审批和写入的判断应从权威状态确认。恢复先找到可见 Thread，再加载其检查点、未完成工作项、预算及已执行副作用。长期记忆独立保存用途与撤回状态。线程清理不应该让合规要求保留的审计回执一起丢失，需要分别制定策略。

## 小结

会话、任务和运行有各自归属。以版本控制并发更新，以检查点恢复过程，以业务回执确认实际副作用。把三者分开后，线程恢复和数据清理都更容易验证。

## 参考资料

- [LangGraph：Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [PostgreSQL：Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
