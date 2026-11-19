---
layout: post
title: "RAG 实战，为什么正确的政策没进入模型？"
description: "用版本过滤、按章节分块、稀疏与密集候选融合、重排序及证据装配，定位一条客服政策在检索链中的去向。"
date: 2026-11-19 20:00:00 +0800
category: Tech
engineering_topic: capabilities
content_kind: 工程方法
tags: [Agent, RAG, Retrieval, Evaluation]
outline:
  - id: ingest
    title: "文档解析、分块和索引"
  - id: ranking
    title: "授权、两路召回、融合与重排"
  - id: packing
    title: "装配上下文与引用验收"
  - id: evaluation
    title: "建一张能定位问题的评估表"
---

用户问「快递没到，能不能取消？」知识库里有一条现行政策说明何时能拦截发货。搜索却经常找到旧版退款条款，或返回一段包含「取消」但不谈配送状态的 FAQ。把路径拆开后，可以为每一次失败指出发生在哪一层。

## 文档解析、分块和索引 {#ingest}

解析时抽取正文、标题层次、表头和脚注。给每块保留政策 ID、生效版本、地区、访问范围和更新时间。用「条件 + 结论」作最小有意义片段，像「未出库可取消」这样的规则不能把前半句丢在上一块。均匀长度分块适合快速设基线，有层级的政策优先按小节，长节再按段拆。父子分块用短段匹配，再按相同权限读取父段。

倒排索引用字面词匹配，利于精确查询政策编号。向量索引使用 Embedding 表示文本，利于「取消」与「中止配送」等语义匹配。余弦相似是可以独立复现的基线，数据增大时把近似近邻的召回率和响应时间一起测。向量数据库管理向量与元数据过滤，索引的生命周期还需要应用维护。

## 授权、两路召回、融合与重排 {#ranking}

第一步根据会话确定允许范围，候选里提前排除失效版本和跨租户片段。关键词与向量各自返回有序 ID，经融合累积名次，再挑较短列表给重排器逐对判断。复杂问题可以拆成更具体的查询，或者结合实体图补全跨文档关系。GraphRAG 的额外工作包括构图、验证关系、同步变化与管理授权，基础检索量化不足时可以先做好可复现基线。

```python
def fuse(*rankings, smoothing=60):
    scores = {}
    for ranking in rankings:
        for rank, item in enumerate(dict.fromkeys(ranking), start=1):
            scores[item] = scores.get(item, 0) + 1 / (smoothing + rank)
    return sorted(scores, key=lambda item: (-scores[item], item))

current = "policy-v2#cancel"
lexical = ["faq-v4#cancel", current]
semantic = [current, "policy-v2#intercept"]
assert fuse(lexical, semantic)[0] == current
```

这里输入的列表已在各路召回前按授权和版本过滤。融合前保存每路原始候选及其名次，才能判断相关证据是搜索词不匹配，还是某一路受过滤影响。重排对候选和问题整体打分，可从「适用环境」「有无完整条件」等真实失败里设计验收问题。

## 装配上下文与引用验收 {#packing}

```mermaid
flowchart TB
  A["用户、地区与索引版本"] --> B["授权过滤后生成候选"]
  B --> C["混合融合与重排"]
  C --> D["按预算装配片段和编号"]
  D --> E{"证据支持结论？"}
  E -->|支持| F["交付带出处的答复"]
  E -->|缺失| G["补查或说明缺口"]
```

应用保存实际发给模型的证据 ID。必要条款可提前预留长度，以防解释性段落占满窗口。回复引用必须在本轮证据集合内。要求按授权资源读回原文、显示章节和版本，有助于客服人工核对。更强的语义验收还要逐条判断引用里的文字是否支持该结论。

## 建一张能定位问题的评估表 {#evaluation}

| 失败现象 | 优先核对 | 可复现指标 |
| --- | --- | --- |
| 正确条款从未入选 | 索引版本、文档 ID、权限范围、查询改写 | 正确证据 Recall@k |
| 候选中有条款但位置靠后 | 各路排名、融合分数、重排前后顺序 | MRR 或 nDCG |
| 排名正确却没送达 | 实际装配的 ID、预算和裁剪顺序 | 必要证据送达率 |
| 引用存在仍答错 | 结论对证据、环境与版本支持 | 引用正确率、拒答率 |

先跑固定数据集，再把排序或分块做成单变量对比。线上按缺失环节收集失败，回流到相应的样本和指标。索引内容与权限策略也要带版本，否则很难把一次线上回答还原出来。

[前置知识：Function Calling](/2026/11/19/agent-deep-dive-tool-use/) · [回到八项核心能力](/2026/11/19/agent-engineering-capabilities/#rag)
