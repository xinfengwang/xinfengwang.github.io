---
layout: "post"
title: "Map-Reduce：并行提取，再按证据和口径合并"
description: "用月报汇总解释分片、并行、合流与可验证的增量恢复。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/architecture/map-reduce/"
engineering_topic: "architecture"
engineering_series: "patterns"
engineering_id: "map-reduce"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"哪些任务适合 Map-Reduce？","answer":"分片可以独立验收且合并契约明确，例如各地区独立提取同类指标。若分片必须依赖共同问题和核对顺序，先拆出公共预处理。"},{"question":"为什么不能直接汇总各组的百分比？","answer":"各组分母可不同。应输出分子和分母，由 Reduce 按实际总数计算。直接平均会让样本少的小组具有和大组一样的权重。"},{"question":"一个分片永久失败时怎样汇总？","answer":"保留已验收分片，明确缺失范围，并按业务完整性要求输出部分结果或停止发布。不能用其他分片推断缺失数字。"},{"question":"同一分片重试后怎么避免重复计数？","answer":"Map 结果带任务版本和稳定分片 ID。Reduce 按该键查当前结果并去重。若同键内容冲突，走核对或明确覆盖规则。"},{"question":"什么时候分层 Reduce 会丢失证据？","answer":"各级只传摘要时，可能漏掉例外或重复来源。对子结果保存源 ID、统计量和冲突列表，最终用原文回查关键结论。"}]
engineering_reading: {"prerequisites":[{"title":"有状态 Workflow","url":"/agent-engineering/architecture/stateful-workflows/"}],"next":[{"title":"Evaluator–Optimizer","url":"/agent-engineering/architecture/evaluator-optimizer/"}],"related":[{"title":"上下文组装","url":"/agent-engineering/rag/context-assembly/"}]}
---

## 怎样在文档量增长后维持可核对性

要汇总三个地区的企业服务月报。每个地区的文档可以独立抽取工单总数、解决数和异常项。Map 节点输出结构化分片结果与来源 ID。Reduce 根据共享统计口径做合并，避免把模型生成的摘要直接当作统计结果。与分片规则固定的 Map-Reduce 相比，动态 Orchestrator 可根据输入决定分片。后者需要额外验证分片是否重叠或漏掉目标范围。

```mermaid
flowchart TB
  A["登记分片清单和版本"] --> B["并行提取分片数据"]
  B --> C["校验每片字段及来源"]
  C --> D["按版本、分片 ID 去重"]
  D --> E["按口径汇总并报告缺口"]
```

| 地区 | 已解决 | 工单总数 | 当地解决率 |
| --- | ---: | ---: | ---: |
| A | 90 | 100 | 90% |
| B | 9 | 10 | 90% |
| C | 3 | 10 | 30% |

总解决率为 102 / 120，即 85%。三个当地百分比的算术平均是 70%。如果只返回「解决率」，就无法复原正确全局指标。保留原始分子分母、统计期、类别版本和可访问的引用。若三个分片的工单重复，按稳定实体 ID 去重后再计算，或证明数据分区彼此独立。模型可摘要异常叙述，计数和口径以确定规则验证。

### 控制并行、局部失效和可追踪性

分片较多时有界并发可以保护共享 API。Reduce 只等启动时登记的分片，在总截止时间后按明确标准定为部分成功或不交付。重跑地区 C 时，旧 A 和 B 在时间和版本一致的前提下复用。将最终汇总附上参与分片和缺口，防止重复计算或「数据完整」误标。若来源跨地域保密，Map 只上行符合访问契约的字段，最终产物仍按权限检查。

## 小结

并行能加快独立分片处理，可靠汇总依赖稳定 ID、同一口径和可回查证据。先验证分片与数据契约，再决定是否使用生成式汇总。

## 参考资料

- [Dean 与 Ghemawat：MapReduce](https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/)
- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
