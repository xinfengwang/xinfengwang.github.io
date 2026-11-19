---
layout: series
title: "RAG 与 Context Engineering"
permalink: /series/rag-context/
series_key: rag-context
---

读完[现有 RAG 基础导读](/2026/09/15/rag-basics/)，可以从解析开始，亲手把售后政策变成证据。先确认入库的内容还原了原文，再比较分块和向量表示。遇到线上失败，可单独读[分层排查案例](/2026/11/19/agent-deep-dive-rag/)，按日志定位召回、重排、装配或引用。

{% include rag-curriculum.html %}

<h2 id="rag-lab">统一实验材料</h2>
<p>实验使用合成的售后政策，含不同版本、地区和访问范围。下载 <a href="{{ '/assets/examples/rag/rag_lab.py' | relative_url }}">rag_lab.py</a>、<a href="{{ '/assets/examples/rag/corpus.json' | relative_url }}">corpus.json</a> 与 <a href="{{ '/assets/examples/rag/eval.json' | relative_url }}">eval.json</a> 到同一目录，用 Python 3.11 或更高版本运行 <code>python rag_lab.py verify</code>。解析、分块和词项向量实验只用标准库。</p>
<p>要比较本地预训练向量，可再下载 <a href="{{ '/assets/examples/rag/dense_compare.py' | relative_url }}">dense_compare.py</a>，安装 FastEmbed，并按 <a href="{{ '/2026/11/19/rag-embedding/#dense' | relative_url }}">Embedding 篇的运行说明</a>复用同一评估集。</p>
