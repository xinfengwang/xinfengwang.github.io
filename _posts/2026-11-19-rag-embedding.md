---
layout: post
title: "Embedding：从词项向量到双塔编码"
description: "固定相同分块和评测集，比较词频、TF-IDF 与本地双塔编码，理解余弦相似和 ANN 的精确基线。"
date: 2026-11-19 21:02:00 +0800
category: Tech
engineering_topic: capabilities
series_key: rag-context
series_index: "01c"
content_kind: 工程方法
tags: [RAG, Embedding, Vector-Search, Evaluation]
audience: "正在实现或排查 Agent 的检索链路，具备基本 Python 阅读能力的读者。"
prerequisite: "Chunking 分块实验"
engineering_reading:
  prerequisites:
    - {title: "Chunking 分块实验", url: /2026/11/19/rag-chunking/}
  next:
    - {title: "ANN 的下一阶段", url: /series/rag-context/#rag-ann}
  related:
    - {title: "RAG 深度系列", url: /series/rag-context/#rag-curriculum}
    - {title: "Hybrid Search 与 RRF（现有笔记）", url: /2026/09/15/hybrid-search/}
outline:
  - {id: problem, title: "为什么错误码和自然语言要分别测？"}
  - {id: concepts, title: "稀疏向量、稠密向量与检索目标"}
  - {id: principles, title: "从分词、池化到余弦相似度"}
  - {id: architecture, title: "离线文档编码与在线查询怎样对齐"}
  - {id: execution, title: "完整执行：把表示误差和搜索误差分开"}
  - {id: implementation, title: "标准库基线怎样运行？"}
  - {id: dense, title: "本地运行两个预训练模型"}
  - {id: tradeoffs, title: "何时用词项、用向量或两者一起？"}
  - {id: next, title: "候选返回了，答案仍要验收"}
---

## 为什么错误码和自然语言要分别测？ {#problem}

客服问 `REF-201` 是什么意思时，其字符串本身是很强的检索信号。换成「承运商交接以后还能拦截包裹吗」，用户和政策可能分别用了 `stop`、`intercept`。词频只看重合，稠密向量可以学习词和上下文间的关系，但有时也会把不同编号视作相近。一次选型需要让不同问法进入相同的验收框架。

## 稀疏向量、稠密向量与检索目标 {#concepts}

词频和 TF-IDF 通常以词项为维度，只保存非零权重。稠密编码器用模型输出固定维度的数组，比较向量时通常不直接操作词项。双塔检索允许分别编码查询和文档；两塔可以共享参数，也可以不同。文档可以离线编码而线上只编码用户查询，这是它比逐对交叉编码更容易扩大候选规模的原因。

训练时常把查询、正样本和若干负样本一起比较，用对比目标提高正样本分值。难负样本（例如意思看似接近但条款不同的退款码）决定模型能否保留关键差异。通用模型也可能没有见过企业内部编号或术语，业务仍要测精确实体、时间、地区和否定条件。

## 从分词、池化到余弦相似度 {#principles}

以 TF-IDF 为例，本实验对每个可见文档集合统计块级文档频率 `df(t)`，并用 `tf(t,d) × [1 + ln((1+N)/(1+df(t)))]` 为词项加权。重合较常见的词权重较低。向量归一化后，余弦相似度就是点积 `q·d`。L2 归一化取各维平方和开方作为模长。无词项时代码返回空向量，避免除零或将没有匹配的文档当作候选。

稠密编码器通常先用 tokenizer 生成子词 ID，再在编码器里得到各位置的上下文表示。平均池化会按注意力掩码只对有效位置求均值；有些模型使用特殊位置的向量或专有投影。选择应按模型定义。若兼容性允许，对查询和文档都进行 L2 归一化后，以点积做精确排序。对单位向量，平方欧氏距离等于 `2 - 2 × 点积`，所以两种指标同序。未经归一化时不能作同样推导。参见 [Stanford 向量空间检索教材](https://nlp.stanford.edu/IR-book/) 与 [Sentence Transformers 相似度说明](https://sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)。

## 离线文档编码与在线查询怎样对齐 {#architecture}

```mermaid
flowchart TB
  A["同一份规范文档与分块"] --> B["编码并标记模型版本"]
  B --> C["向量和来源坐标"]
  D["用户问题和身份"] --> E["查询编码和访问过滤"]
  C --> F["可见范围内计算精确分数"]
  E --> F
  F --> G["Top-K 与证据验收"]
```

向量长度相同并不意味着在同一空间。换编码器、语言模型、归一化方式或提示前缀时，要对文档和查询按对应配置重建。索引至少记录模型标识、权重版本、输入模板、tokenizer、截断策略、维度和相似度。

## 完整执行：把表示误差和搜索误差分开 {#execution}

```mermaid
sequenceDiagram
  participant U as 查询样本
  participant M as 编码器
  participant I as 精确索引
  participant E as 证据验收
  U->>M: 原问题
  M->>I: 向量与可见文档范围
  I->>I: 使用单位向量逐个点积
  I->>E: Top-K 和来源区间
  E-->>U: 证据覆盖、全证据题数与 MRR
```

先用同一组向量对所有允许文档逐个打分。这个精确 Top-K 是以后评估 ANN 的参照。如果精确搜索已找不到证据，应先查表示、分块、截断和访问过滤。这样不会把编码的问题误判成近似搜索问题。

## 标准库基线怎样运行？ {#implementation}

从 [统一实验材料](/series/rag-context/#rag-lab) 下载三文件，用 Python 3.11 或更高版本执行：

```bash
python rag_lab.py embed
python rag_lab.py embed --explain return_and_refund
```

代码先按实验词法分词，再将词频或词频乘 IDF 后归一化。查询期间会取可见片段，同一个范围复用索引。这个词法保留英语连字符编号，中文检索需要适合中文的分词或其他表示。

```python
def cosine(left, right):
    return sum(weight * right.get(term, 0.0) for term, weight in left.items())
```

在相同的 37 个活动块和 Top-3 下，本轮输出如下。

| 表示 | 证据覆盖 | 全证据题数 | MRR |
| --- | ---: | ---: | ---: |
| 词频向量 | 14/16 | 10/12 | 0.861 |
| TF-IDF | 16/16 | 12/12 | 1.000 |

对 `return_and_refund`，脚本可打印每个候选的区间和命中的第几段证据。分数的量纲只在同一种方法内部使用，融合排序时不要直接相加。

## 本地运行两个预训练模型 {#dense}

另下载 [dense_compare.py](/assets/examples/rag/dense_compare.py)，和前三个文件放同一目录。模型首次运行需下载公开 ONNX 权重，不需要模型服务或 API 密钥。建议建 Python 虚拟环境。模型缓存齐全后，可以加 `--offline` 重跑。

```bash
python -m pip install fastembed==0.9.1
python dense_compare.py --cache-dir rag-model-cache
python dense_compare.py --cache-dir rag-model-cache --offline --explain intercept
```

脚本使用 FastEmbed 的 `passage_embed` 和 `query_embed` 走各模型的编码入口，校验向量有限且非零，再归一化。完成编码后只对有权限的候选做精确点积。比较模型为 `BAAI/bge-small-en-v1.5` 与 `sentence-transformers/all-MiniLM-L6-v2`，均为英语模型。依赖与权重说明见 [FastEmbed 支持模型](https://qdrant.github.io/fastembed/examples/Supported_Models/)。

以下是 FastEmbed 0.9.1 在 CPU 的实际输出。两种稠密表示使用相同分块、权限范围和 Top-3，搜索都为精确点积。

| 编码器 | 维度 | 证据覆盖 | 全证据题数 | MRR |
| --- | ---: | ---: | ---: | ---: |
| BGE small EN v1.5 | 384 | 15/16 | 11/12 | 0.917 |
| all-MiniLM-L6-v2 | 384 | 16/16 | 12/12 | 0.944 |

在 `return_exception` 中，BGE 把包含 30 天窗口的块排第一，但这个块在 “excluded” 后截断。完整例外在 `return-window[95:164]`，未进入其 Top-3。MiniLM 把完整例外排第二，故该题取得两段证据。复查时用 `--explain return_exception`，直接对照分数和区间。它区分了块已存在和块没排进候选这两种问题。

实测使用 Python 3.13、FastEmbed 0.9.1 与 ONNX Runtime 1.32.0。权重来自 Qdrant 的 [BGE 快照](https://huggingface.co/Qdrant/bge-small-en-v1.5-onnx-Q/tree/aa8f8b060edb00e03bfdd08813a2949946c8ba55) 和 [MiniLM 快照](https://huggingface.co/Qdrant/all-MiniLM-L6-v2-onnx/tree/d13954661f83248295ba75c1ed411eef3b7b936e)。脚本首次下载使用模型注册表的当前权重，表格对应这里记录的快照。

这批合成问题短，错误码和政策用词与文档高度重合。TF-IDF 在此表现很好，不能由此得到模型的一般优劣。选实际模型应增加同义改写、长文截断、中文或跨语言、相近编号和版本冲突样本，再按场景比较质量、编码时间和模型体积。

## 何时用词项、用向量或两者一起？ {#tradeoffs}

订单号、错误码、产品编号要保留精确通道。口语问法或同义表达可用双塔补召回。对跨语言输入先验证模型支持的语言与业务词汇，再看召回改进是否值得新推理成本。维度越大通常占用更多内存，`N × d × 4` 字节只是 float32 原始矩阵开销，索引结构、元数据和副本要另外计算。

转向 ANN 前确定精确检索是否能满足数据量及延迟。保留检索对照，避免索引配置变化与换模型同时上。线上可以离线批量编码，查询按稳定的模型和权限策略缓存，按同一配置写索引和回滚。

## 候选返回了，答案仍要验收 {#next}

有向量近邻不等于有可引用的业务证据。基线在 2/2 无证据题上仍给出候选。要在候选、上下文与最终答复之间分别核对范围、版本和证据。接下来可回 [RAG 系列的 ANN 路线](/series/rag-context/#rag-ann)，或先读 [混合搜索与 RRF 的现有笔记](/2026/09/15/hybrid-search/)。如果结果像是把规则切断了，回看 [分块实验](/2026/11/19/rag-chunking/) 的区间诊断。
