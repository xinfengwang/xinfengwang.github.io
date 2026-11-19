---
layout: series
title: "RAG 与 Context Engineering"
permalink: /series/rag-context/
series_key: rag-context
---

读完[现有 RAG 基础导读](/2026/09/15/rag-basics/)，可以从解析开始，亲手把售后政策变成证据。先确认入库的内容还原了原文，再比较分块和向量表示。遇到线上失败，可单独读[分层排查案例](/2026/11/19/agent-deep-dive-rag/)，按日志定位召回、重排、装配或引用。

{% include rag-curriculum.html %}

## 已有文章怎么读 {#rag-reading-guide}

| 入口 | 文章 | 适合解决的问题 |
| --- | --- | --- |
| 概览 | [上下文工程总纲](/2026/09/15/rag-context-overview/) · [RAG 基础](/2026/09/15/rag-basics/) | 总纲解释检索产物在 Agent 上下文中的位置。基础篇把离线入库和在线检索串起来，对解析、分块和向量只做引导。 |
| 机制与实验 | [文档解析](/2026/11/19/rag-document-parsing/) · [Chunking](/2026/11/19/rag-chunking/) · [Embedding](/2026/11/19/rag-embedding/) | 逐步替换格式解析、切分或向量表示，使用同一份政策和证据做对照。 |
| 混合检索 | [Hybrid Search 与 RRF](/2026/09/15/hybrid-search/) · [RAG 实战的排序部分](/2026/11/19/agent-deep-dive-rag/#ranking) | 两处都讲到融合。前者说明关键词与向量为什么互补，实战篇追踪一条政策怎样经过权限过滤、融合和重排。 |
| 排障与复现 | [RAG Badcase](/2026/09/15/rag-badcase-debugging/) · [客服政策实战](/2026/11/19/agent-deep-dive-rag/) · [文档 Agent 上下文实战](/2026/11/18/document-agent-context/) | 三篇共享按阶段追证据的方法。分别用于排障清单、版本与权限下的检索路径，以及用 Node.js 重现预算裁剪。 |
| 证据边界 | [权限 RAG](/2026/09/15/permission-aware-rag/) · [客服 Agent 案例](/2026/11/19/agent-case-support/) | 前者讨论数据过滤与访问控制，后者把证据不足或操作未确认的情况放到业务流程中看。 |
| 规划检索 | [面向 Agent Planning 的 RAG](/2026/09/08/rag-for-agent-planning/) · [Few-shot Retrieval](/2026/09/15/few-shot-retrieval/) · [Workspace 与 Codebase](/2026/09/13/context-engineering-workspace-codebase/) | 使用历史计划、执行轨迹与工作区文件补充上下文，为后续 Agentic RAG 的检索目标与数据源选型做准备。 |

<h2 id="rag-lab">统一实验材料</h2>
<p>实验使用 10 份合成售后政策，覆盖不同版本、地区和访问范围。评估集包含 14 条英文查询、6 条中文和 2 条西语查询，每条查询绑定标准答案和相应的证据。无证据样本的标准答案说明可见资料的限度。检索脚本评分依据是证据区间，答案字段供后续生成层评估使用。</p>
<p>下载 <a href="{{ '/assets/examples/rag/rag_lab.py' | relative_url }}">rag_lab.py</a>、<a href="{{ '/assets/examples/rag/corpus.json' | relative_url }}">corpus.json</a> 与 <a href="{{ '/assets/examples/rag/eval.json' | relative_url }}">eval.json</a> 到同一目录，用 Python 3.11 或更高版本运行 <code>python rag_lab.py verify</code>。基础解析、分块和词项向量实验只用标准库。</p>
<p>要验证 HTML、Word 和 PDF 的格式差异，可下载 <a href="{{ '/assets/examples/rag/parse_formats.py' | relative_url }}">parse_formats.py</a>，按 <a href="{{ '/2026/11/19/rag-document-parsing/#implementation' | relative_url }}">解析篇的命令</a>生成同一份退款政策的样本。<a id="rag-ocr-model" href="https://github.com/tesseract-ocr/tessdata_fast/tree/4.1.0">Tesseract 训练数据目录</a>提供 <code>eng.traineddata</code> 与 <code>chi_sim.traineddata</code>。</p>
<p>要实测稠密语义分块和向量检索，可再下载 <a href="{{ '/assets/examples/rag/dense_compare.py' | relative_url }}">dense_compare.py</a>，按 <a href="{{ '/2026/11/19/rag-embedding/#dense' | relative_url }}">Embedding 篇的运行说明</a>安装 FastEmbed。</p>
