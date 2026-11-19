---
layout: post
title: "任务写入成功后进程退出，Agent 怎样从回执恢复？"
description: "分析任务状态、幂等键、目标端事务、并发重投和不确定结果。"
date: 2026-11-19 19:30:00 +0800
category: Tech
engineering_topic: production
content_kind: 工程方法
tags: [Agent, Runtime, Production]
outline:
  - id: problem
    title: "同一个超时对应两条路径"
  - id: design
    title: "四个字段各解决什么"
  - id: implementation
    title: "事务顺序和恢复条件"
  - id: verification
    title: "怎样演练故障而不是只看日志？"
---

## 同一个超时对应两条路径 {#problem}

审批通过后发送保存申请。进程可能在请求发出前退出，也可能在目标系统提交之后退出。检查点只显示「已批准」，单凭本地状态无法区分。有业务回执时补记完成，目标支持幂等且回执缺失时用原操作编号提交。

## 四个字段各解决什么 {#design}

| 字段 | 放在哪里 | 用途 |
| --- | --- | --- |
| task ID | 任务库 | 找到原任务、阶段与所有产物 |
| operation ID | 审批后冻结，目标端建立唯一约束 | 保证重投引用同一动作 |
| expected version | 与批准内容一起冻结 | 避免覆盖已经发生的其他修改 |
| receipt | 与目标写入在同一事务提交 | 证明外部操作结果 |

## 事务顺序和恢复条件 {#implementation}

```sql
BEGIN;
-- 按 operation_id 查询回执，并校验同一操作的内容摘要。
UPDATE drafts
SET version = version + 1, content = :content
WHERE id = :id AND version = :expected_version;
-- 确认更新恰好一行，再登记回执。
INSERT INTO receipts(operation_id, draft_id, version)
VALUES (:operation_id, :id, :expected_version + 1);
COMMIT;
```

唯一约束与条件更新处理两类并发：同一动作被两个 Worker 执行，只能有一个结果；不同动作同时尝试修改同一旧版，只能一个成功。处理竞争后重新查询回执，校验对应的内容。如果目标没有查回执或幂等能力，进入结果未知、人工核对或业务补偿。

## 怎样演练故障而不是只看日志？ {#verification}

分别在发送前和提交后中断进程，再启动一个 Worker。验证前一种路径补做原操作，后一种补记完成，任一路径多次重复仍然只有一个目标版本。还要测试审批后用户改了草稿、外部目标版本过期、权限在排队期间变更。

[前置：生产服务](/2026/11/19/agent-engineering-production/#persistence) · [进阶：发布与回滚](/2026/11/19/agent-deep-dive-deployment/)
