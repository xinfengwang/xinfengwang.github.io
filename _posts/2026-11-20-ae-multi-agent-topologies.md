---
layout: "post"
title: "多 Agent 拓扑：集中式、分层、对等与共享状态"
description: "用同一任务比较四种拓扑的消息路径、关键路径、所有权及故障边界。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/multi-agent-topologies/"
engineering_topic: "architecture"
engineering_series: "multi-agent"
engineering_id: "multi-agent-topologies"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"拓扑图为什么需要标明状态所有者？","answer":"只有消息箭头时，无法判断谁能修改任务状态、谁确认完成、重复回执如何处理。状态所有权、幂等键和迁移条件决定系统的恢复语义。"},{"question":"什么时候中心化协调是合理的？","answer":"多数任务共享验收规则且需要明确问责时，中心协调者可统一迁移和权限。业务量扩大前，验证其排队、接管机制和跨权限范围是否可控。"},{"question":"对等网络怎样避免同一任务被处理两次？","answer":"通过任务的稳定身份、当前版本和明确领取协议协调处理，再以幂等提交应对重复消息。去中心化控制仍需要一致的业务状态约束。"},{"question":"共享工作区与点对点通信能同时存在吗？","answer":"可以。点对点传递委派和回执，共享区保存不可变工件或公共索引。对共享记录加版本和访问范围，具体节点按责任写入自己的产物。"},{"question":"如何比较拓扑的规模效应？","answer":"同时度量收发消息数、单节点负载、资方限流、汇总成本与失败恢复时间。固定任务输入和验收后，比较吞吐与尾部延迟，避免只数 Agent 数量。"}]
engineering_reading: {"prerequisites":[{"title":"多 Agent 协作","url":"/agent-engineering/capabilities/multi-agent-collaboration/"},{"title":"Supervisor","url":"/agent-engineering/architecture/supervisor/"},{"title":"Hierarchical","url":"/agent-engineering/architecture/hierarchical/"}],"next":[{"title":"企业级 Agent 架构","url":"/agent-engineering/architecture/enterprise-agent-architecture/"}]}
---

## 同一份合规报告可以让不同节点负责完成

企业需要六个地区共同完成采购合规清单。每个地区的资料只对相应身份可见。最后要统一比较制度生效时间、采购类型和例外，并允许个别地区暂时无结果。设计拓扑前先确认谁能分配任务、谁拥有地区产物，以及谁能代表整个系统签收结果。

| 拓扑 | 消息怎样走 | 谁拥有当前状态 | 主要压力 |
| --- | --- | --- | --- |
| 集中式 / Supervisor | 所有委派与结果经过中心 | 中心管理任务级状态，各分支写产物 | 中心吞吐、扇入等待和单点影响 |
| 分层式 | 总协调者对区域负责人，负责人对工作者 | 每层只管理自己的子树和上行契约 | 过期预算、重复汇总与故障归因 |
| 去中心化 / 对等 | 节点可按契约互相协商移交 | 任务拥有者或共享协议决定迁移 | 重复占用、死锁、版本及消息风暴 |
| 网络式组合 | 走语义或能力匹配的有限邻接关系 | 所有权随协议显式转移 | 需要路由收敛、超时与显式终止 |

共享 Context 可以叠加在这些拓扑上。例如各地区读同一比较标准的版本 v4。主管只汇总分区内出具的证据摘要和引用，具备权限的人工才可读底层文档。相同 Context 的语义应由任务版本和引用表达。共享状态服务生产并发语义，消息系统负责交付及关联，二者可以分别替换。

```mermaid
flowchart TB
  A["公共任务契约与版本"] --> B["地区负责人"]
  A --> C["其他地区负责人"]
  B --> D["独立产物和证据 ID"]
  C --> E["独立产物和证据 ID"]
  D --> F["汇总者检查覆盖和冲突"]
  E --> F
```

### 在扩大节点数前算清通信和恢复

假设每个工作者一条委派加一条回执，六个工作者经中心共需要 12 条工作消息。若每个结点都主动向其他五个结点推送一次，则有 30 条有向消息。这个比较只描述理想单轮计数，重试、事件广播和聚合可能占用更多。以同一任务产生的实际 Trace 来定位瓶颈，尤其注意中心排队与共享服务限流。

故障演练可以让第四地区在重启后重复提交、第五地区的旧版本结果晚到、第六地区永久缺证。用任务版本和工作项 ID 去重。保存不可变的分支产物，允许汇总按预设规则交付部分结果。若旧结果时间跨过政策变化，不进入本次验收。对等拓扑还要定义失联后的重新领取由谁判定，以及同一任务有两份上报时谁决定有效性。

## 小结

拓扑选择取决于沟通规模、权限分区、失败隔离及任务终态的责任。先建立统一的任务契约和证据回执，再比较集中、分层与对等的实际代价。

## 参考资料

- [Wu 等：AutoGen](https://arxiv.org/abs/2308.08155)
- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
