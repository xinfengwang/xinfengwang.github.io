# Agent Engineering 全站文章质量审查

审查基线为仓库提交 `009f27a`。审查 99 篇已发布正文，其中课程 35 篇、历史与独立博客 64 篇。专题入口和跳转页不计为文章。链接指向相应的现有公开路由。

A 保留 28 篇。B 补充 56 篇。C 重写 0 篇。D 重新组织 15 篇。课程与历史博客共用 post 布局，课程正文使用统一的折叠问答，历史博客的问答欠项逐篇留在表中。

原理一栏的「适配」表示以入门、笔记或案例的阅读目标验收。「中」表示机制已说明但还缺展开或可核对例子，「浅」表示主要停留在概念或名词。架构流程一栏同时检查输入、输出及关键依赖。重合主题以现有课程为主线，保留有独立补充价值的历史文章。

## 课程正文

| 板块 · 专题 | 文章与线上路由 | 核心知识 | 背景 / 概念 / 原理 / 架构流程 | 技术图表 / 折叠问答数 | 重合或关联 | 评级与处理 |
| --- | --- | --- | --- | --- | --- | --- |
| 基础理论与核心原理 · 运行时 | [Agent 核心架构：模型、上下文、状态、记忆与环境怎么分工](https://xinfengwang.github.io/agent-engineering/foundations/agent-components/) | 模型、状态和记忆的职责与寿命 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | — | A · 保留，保留入门定位 |
| 评估、安全与可观测性 · Agent Evaluation | [Agent 评估：从任务成功率追到工具选择和行为边界](https://xinfengwang.github.io/agent-engineering/quality/agent-evaluation/) | 任务成功率、工具选择与成本 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | 旧评测导读 | B · 补充，补成功率分层、工具多步对齐和失败类型 |
| 基础理论与核心原理 · 执行循环 | [Agent 运行循环：从一次观察到任务验收](https://xinfengwang.github.io/agent-engineering/foundations/agent-loop/) | 观察、行动、回填、停止与验收 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | — | A · 保留，保留为执行闭环导读 |
| 核心技术与能力体系 · RAG | [Agentic RAG：让检索成为有停止条件的决策](https://xinfengwang.github.io/agent-engineering/rag/agentic-rag/) | 多轮查证、路由和停止预算 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留与固定 RAG 的明确对照 |
| 基础理论与核心原理 · 设计范式 | [Agent 设计范式：用任务特征决定何时路由、规划或循环](https://xinfengwang.github.io/agent-engineering/foundations/choosing-agent-patterns/) | 按任务不确定性选择控制方式 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | — | A · 保留，保留，单模式案例归架构系列 |
| 核心技术与能力体系 · RAG | [Chunking：确定什么内容应该一起被检索](https://xinfengwang.github.io/agent-engineering/rag/chunking/) | 结构分块、重叠、语义和父子回读 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补语义阈值计算和跨段证据对照 |
| 核心技术与能力体系 · RAG | [Contextual Retrieval：让短片段带着它的文档语境进入索引](https://xinfengwang.github.io/agent-engineering/rag/contextual-indexing/) | 语境索引文本与引用原文分离 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留两条文本流和对照实验 |
| 架构设计与设计模式 · 架构基础 | [Agent 架构基础：把控制流与数据流分别画清楚](https://xinfengwang.github.io/agent-engineering/architecture/control-and-data-flow/) | 控制、数据、状态所有权 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补状态写入契约及跨模块失败语义 |
| 核心技术与能力体系 · RAG | [Self-RAG 与 Corrective RAG：检索结果有问题时怎样纠正](https://xinfengwang.github.io/agent-engineering/rag/corrective-retrieval/) | 反思 Token、CRAG 成绩分层与纠错 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留研究机制到工程门控的区分 |
| 核心技术与能力体系 · RAG | [文档解析：保留阅读顺序、表格结构与引用坐标](https://xinfengwang.github.io/agent-engineering/rag/document-ingestion/) | PDF、Word、HTML、OCR 与引用坐标 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补多栏和表格合并的逐步重建例 |
| 核心技术与能力体系 · RAG | [Embedding：查询和证据为什么能在同一空间比较](https://xinfengwang.github.io/agent-engineering/rag/embeddings/) | 双塔、对比学习、相似度和选型 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留，向量与排序的关系可核对 |
| 基础理论与核心原理 · 技术演进 | [从传统自动化到大语言模型：为什么应用开始用语言来决策](https://xinfengwang.github.io/agent-engineering/foundations/from-automation-to-llm/) | 规则、传统模型与语言决策 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | — | A · 保留，保留技术演进入门定位 |
| 核心技术与能力体系 · RAG | [GraphRAG：关系查询和全局主题怎样利用图结构](https://xinfengwang.github.io/agent-engineering/rag/graph-rag/) | 实体边、局部搜索和全局主题 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补实体合并和社区摘要的证据误差 |
| 核心技术与能力体系 · RAG | [混合检索：让词法匹配和向量召回互补](https://xinfengwang.github.io/agent-engineering/rag/hybrid-search/) | RRF 与归一化分数融合 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | 混合检索旧文 | A · 保留，保留名次示例和候选池边界 |
| 项目实战与案例拆解 · 入门项目 | [案例：设计一个可核查的企业政策问答 Agent](https://xinfengwang.github.io/agent-engineering/cases/kb-question-answering/) | 授权政策问答与验收 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补端到端证据回放、成本和对照 |
| 开发框架与技术生态 · LangGraph | [LangGraph 持久化：Checkpoint、Interrupt 与恢复执行](https://xinfengwang.github.io/agent-engineering/frameworks/langgraph-recovery/) | Checkpoint、Thread、Interrupt 和恢复 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，按官方版本复核恢复节点与失败点 |
| 开发框架与技术生态 · LangGraph | [LangGraph 图编排：State、Node、Edge 和 Reducer 怎样协作](https://xinfengwang.github.io/agent-engineering/frameworks/langgraph-state/) | Reducer、Command、Send 和图状态 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补 superstep 并行写冲突和 reducer 例 |
| 前沿技术与发展趋势 · 长时运行 | [长时运行 Agent：任务怎样跨会话继续推进](https://xinfengwang.github.io/agent-engineering/frontier/long-running-agents/) | 会话边界、检查点和成熟度 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补活跃任务租约与可判定终止 |
| 开发框架与技术生态 · MCP | [MCP 能力模型：Tools、Resources、Prompts、Roots 与 Sampling](https://xinfengwang.github.io/agent-engineering/frameworks/mcp-capabilities/) | 工具、资源、提示、Roots 和 Sampling | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，按公开协议修订复核各能力和信任边界 |
| 开发框架与技术生态 · MCP | [MCP 通信：Host、Client、Server 与初始化生命周期](https://xinfengwang.github.io/agent-engineering/frameworks/mcp-lifecycle/) | Host、Client、Server 和握手 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，复核传输与版本协商并补握手时序 |
| 核心技术与能力体系 · Memory | [Agent Memory：区分工作记忆、经历、事实和操作技能](https://xinfengwang.github.io/agent-engineering/capabilities/memory-model/) | 记忆分类、状态与取用 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | Agent Memory 旧文 | B · 补充，补 Context、State、RAG 的同场例证 |
| 核心技术与能力体系 · LLM | [大模型推理：Prefill、Decode、KV Cache 与采样](https://xinfengwang.github.io/agent-engineering/capabilities/model-inference/) | Prefill、Decode、KV 与采样 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | vLLM 笔记 | B · 补充，补 GQA 数值、长上下文与选型边界 |
| 核心技术与能力体系 · RAG | [多模态 RAG：把表格、图表和页面图像变成可核查证据](https://xinfengwang.github.io/agent-engineering/rag/multimodal-rag/) | 图、页和表的多模态证据 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补单页支持多个查询的评测案例 |
| 核心技术与能力体系 · Planning | [任务规划：拆解依赖、安排顺序并根据证据重规划](https://xinfengwang.github.io/agent-engineering/capabilities/planning-and-replanning/) | 依赖、调度和增量重规划 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补故障前后版本表、验收和关键路径 |
| 核心技术与能力体系 · Prompt | [Prompt Engineering：把任务、示例、证据和约束组织成上下文](https://xinfengwang.github.io/agent-engineering/capabilities/prompt-design/) | 消息层级、示例和模板 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补离线评估、上下文组装和结构契约关联 |
| 核心技术与能力体系 · RAG | [查询改写：从用户的说法到可以检索的问题](https://xinfengwang.github.io/agent-engineering/rag/query-transformation/) | 改写、多查询、拆解、HyDE | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留高风险字段和回归对比 |
| 核心技术与能力体系 · RAG | [RAG 评估：分开测召回、证据覆盖与答案支持](https://xinfengwang.github.io/agent-engineering/rag/rag-evaluation/) | Recall、MRR、nDCG 与证据支持 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补标注遗漏、分层指标与上线门禁 |
| 核心技术与能力体系 · RAG | [RAG 基础：让回答依赖可更新、可核对的证据](https://xinfengwang.github.io/agent-engineering/rag/rag-foundations/) | 索引、在线链路和引用 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | RAG 基础旧文 | A · 保留，保留为系列总览 |
| 工程化与生产实践 · 可靠性 | [生产可靠性：从超时到幂等回执，怎样恢复一次外部写入](https://xinfengwang.github.io/agent-engineering/production/recoverable-writes/) | 超时、幂等、Outbox 和补偿 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留并接续长任务案例 |
| 核心技术与能力体系 · RAG | [Rerank：召回之后，怎样判断哪条证据能回答问题](https://xinfengwang.github.io/agent-engineering/rag/reranking/) | 双塔和交叉编码、截断与候选预算 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留，组装机制交给独立正文 |
| 核心技术与能力体系 · RAG | [稀疏检索：从倒排索引到 BM25](https://xinfengwang.github.io/agent-engineering/rag/sparse-retrieval/) | 倒排、分词及 BM25 公式 | 足 / 正 / 深 / 足 | Mermaid 1 / 5 | — | A · 保留，保留字段、罕见词和评分解释 |
| 核心技术与能力体系 · Tool Use | [Function Calling：模型怎样提出工具动作，宿主怎样执行](https://xinfengwang.github.io/agent-engineering/capabilities/tool-calling/) | Schema、调用回填与宿主执行 | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | Function Calling 旧文 | B · 补充，补关联 ID、多调用批次和授权生命周期 |
| 核心技术与能力体系 · LLM | [Transformer：Token 怎样通过注意力形成上下文表示](https://xinfengwang.github.io/agent-engineering/capabilities/transformer/) | Q/K/V、因果注意力、RoPE、FFN | 足 / 正 / 中 / 足 | Mermaid 1、公式 / 5 | — | B · 补充，补张量形状、位置旋转、残差和训练目标 |
| 核心技术与能力体系 · RAG | [向量索引：Exact、HNSW、IVF 和 PQ 怎样交换速度与召回](https://xinfengwang.github.io/agent-engineering/rag/vector-indexes/) | 精确基线、HNSW、IVF、PQ | 足 / 正 / 中 / 足 | Mermaid 1 / 5 | — | B · 补充，补建图、分桶与量化训练过程 |
| 基础理论与核心原理 · Agent 定义 | [什么是 Agent：从目标、环境和下一步控制权来判断](https://xinfengwang.github.io/agent-engineering/foundations/what-is-an-agent/) | 环境、动作、状态与控制权 | 足 / 正 / 适配 / 足 | Mermaid 1 / 5 | — | A · 保留，保留为第一篇术语与选型入口 |

## 历史与独立博客正文

| 板块 · 专题 | 文章与线上路由 | 核心知识 | 背景 / 概念 / 原理 / 架构流程 | 技术图表 / 折叠问答数 | 重合或关联 | 评级与处理 |
| --- | --- | --- | --- | --- | --- | --- |
| 开发框架与技术生态 · LangGraph 多 Agent | [LangGraph 为什么更适合 Multi-Agent？](https://xinfengwang.github.io/2026/09/03/langgraph-for-multi-agent/) | 图编排与 Supervisor | 足 / 正 / 浅 / 部分 | — / 0 | LangGraph 图编排、多 Agent 拓扑 | D · 重组导读，能力分工和扇入合并缺实例 |
| 核心技术与能力体系 · 规划 RAG | [Agent Planning 的 RAG，为什么和普通问答 RAG 不一样？](https://xinfengwang.github.io/2026/09/08/rag-for-agent-planning/) | 历史轨迹做规划 Few-shot | 足 / 正 / 浅 / 部分 | — / 0 | Few-shot Retrieval、Agentic RAG | D · 重组导读，环境匹配与失效判定 |
| 项目实战与案例拆解 · 智能家居 | [Smart Home：感知—预测—决策—验证—执行闭环怎么设计？](https://xinfengwang.github.io/2026/09/09/smart-home-agent-loop/) | 感知预测决策验证执行 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | — | B · 补充，补固定输入与状态回执示例 |
| 前沿技术与发展趋势 · Coding Agent | [Coding Agent 到底比普通 Agent 多了什么？](https://xinfengwang.github.io/2026/09/10/coding-agent-harness/) | Harness 与工件验收 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 研发 Agent Harness | B · 补充，补模型适配器与运行验证边界 |
| 评估、安全与可观测性 · 追踪 | [Agent Tracing：一次失败到底错在哪一层？](https://xinfengwang.github.io/2026/09/11/agent-tracing/) | Trace 分层和失败定位 | 足 / 正 / 中 / 部分 | 文本流程/结构 / 0 | — | B · 补充，补 Span 关系和采样策略 |
| 架构设计与设计模式 · 工作流 | [为什么 Agent Workflow 需要状态机，而不是让 LLM 自由流转？](https://xinfengwang.github.io/2026/09/12/why-agent-workflow-needs-state-machine/) | 状态机约束流转 | 足 / 正 / 浅 / 部分 | — / 0 | Runtime 总纲、LangGraph 图编排 | D · 重组导读，补合法状态转换与并行合并反例 |
| 核心技术与能力体系 · 上下文 | [Context Engineering：Workspace 与 Codebase 应该怎么分？](https://xinfengwang.github.io/2026/09/13/context-engineering-workspace-codebase/) | Workspace 与 Codebase 分域 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Codebase Context、Workspace Context | B · 补充，补快照版本和待解决问题传递 |
| 开发框架与技术生态 · MCP | [MCP：为什么有 Function Calling 还需要协议层？](https://xinfengwang.github.io/2026/09/14/mcp-and-function-calling/) | Function Calling 和协议层 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | MCP 通信、Function Calling | D · 重组导读，链接版本明确的生命周期正文 |
| 评估、安全与可观测性 · 回归 | [Badcase 闭环：怎么把一次 Agent 失败变成下一版系统的能力？](https://xinfengwang.github.io/2026/09/15/agent-badcase-loop/) | 失败分层和回归闭环 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Agent Benchmark | B · 补充，补固定样本与复现判据 |
| 评估、安全与可观测性 · 评测集 | [Agent Benchmark：怎么设计真正能回归的任务集？](https://xinfengwang.github.io/2026/09/15/agent-benchmark/) | 基准任务与发布门禁 | 足 / 正 / 中 / 足 | — / 0 | — | B · 补充，补样本分层与评估器版本 |
| 项目实战与案例拆解 · 项目导论 | [总纲：怎么把一个 Agent Demo 做成可展示、可运行的系统？](https://xinfengwang.github.io/2026/09/15/agent-demo-to-system/) | 从 Demo 到可验收系统 | 足 / 正 / 中 / 足 | — / 0 | — | B · 补充，补同一任务的部署前后验收 |
| 基础理论与核心原理 · 旧导读 | [总纲：AI Agent 到底在解决什么问题？](https://xinfengwang.github.io/2026/09/15/agent-foundations-overview/) | 闭环与模块导览 | 足 / 正 / 浅 / 部分 | 文本流程/结构 / 0 | 什么是 Agent、Agent 核心架构 | D · 重组导读，由现有入门三篇承接概念和流程 |
| 工程化与生产实践 · Harness | [工程实践：Agent Harness 如何把 Workflow、Context 和 Evaluation 串成闭环？](https://xinfengwang.github.io/2026/09/15/agent-harness-closed-loop/) | 工作流上下文权限评估 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 研发 Agent Harness | B · 补充，补可运行工件的版本关联 |
| 核心技术与能力体系 · Memory | [Agent Memory：短期记忆、长期记忆与可控召回](https://xinfengwang.github.io/2026/09/15/agent-memory/) | 分类与召回 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Agent Memory 课程篇 | D · 重组导读，生命周期与写入冲突归专文 |
| 核心技术与能力体系 · Planning | [Planning：ReAct、Plan-and-Execute 与结构化计划怎么选？](https://xinfengwang.github.io/2026/09/15/agent-planning-patterns/) | 规划模式选型 | 足 / 正 / 中 / 部分 | 文本流程/结构 / 0 | Agent 设计范式、任务规划 | D · 重组导读，定量例子和动态计划版本 |
| 架构设计与设计模式 · 旧导读 | [总纲：为什么 Agent 需要 Runtime](https://xinfengwang.github.io/2026/09/15/agent-runtime-overview/) | Runtime、状态机与恢复 | 足 / 正 / 中 / 部分 | 文本流程/结构 / 0 | Agent 核心架构、控制流与数据流 | D · 重组导读，补状态所有权和边界演算 |
| 评估、安全与可观测性 · 安全治理 | [Agent 的权限、安全与 Human-in-the-loop 应该怎么设计？](https://xinfengwang.github.io/2026/09/15/agent-safety-hitl/) | 最小权限与人工审批 | 足 / 正 / 浅 / 足 | 文本流程/结构 / 0 | Coding Agent 工具权限、MCP 工具信任 | D · 重组导读，审批绑定参数和失效条件 |
| 架构设计与设计模式 · 工作流 | [产物驱动 Workflow：为什么 Artifact 比聊天历史更适合推动状态流转？](https://xinfengwang.github.io/2026/09/15/artifact-driven-workflow/) | Artifact 驱动状态迁移 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Workspace Context | B · 补充，补工件版本冲突与过期判定 |
| 前沿技术与发展趋势 · 代码上下文 | [Codebase Context：大仓库到底应该怎么被 Coding Agent 理解？](https://xinfengwang.github.io/2026/09/15/codebase-context/) | 符号检索和依赖扩展 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Workspace 与 Codebase | B · 补充，补索引提交号一致性 |
| 评估、安全与可观测性 · 代码评测 | [Benchmark 驱动 Coding Agent：怎么让系统持续迭代而不是靠感觉调 Prompt？](https://xinfengwang.github.io/2026/09/15/coding-agent-benchmark-loop/) | 代码任务基准与回归 | 足 / 正 / 浅 / 足 | 文本流程/结构 / 0 | Agent Benchmark | B · 补充，补统一基线及难度分层 |
| 评估、安全与可观测性 · 工具权限 | [Coding Agent 的工具权限：为什么最小权限比强 Prompt 更重要？](https://xinfengwang.github.io/2026/09/15/coding-agent-permissions/) | 代码工具按角色与作用域授权 | 足 / 正 / 中 / 足 | — / 0 | 旧安全导论 | B · 补充，区分 Schema 校验与授权决定 |
| 项目实战与案例拆解 · 研发工作流 | [Coding Workflow：Spec → Design → Tasks → Code 为什么比直接写代码稳？](https://xinfengwang.github.io/2026/09/15/coding-workflow/) | 规格设计任务与实现 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 研发 Agent Harness | B · 补充，补需求变更后重验条件 |
| 评估、安全与可观测性 · 确定性评估 | [AST / Assertion：Agent 执行结果怎么做确定性比对？](https://xinfengwang.github.io/2026/09/15/deterministic-agent-evaluation/) | AST、运行和制品断言 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | — | B · 补充，区分语法、行为、环境终态 |
| 评估、安全与可观测性 · 旧导读 | [总纲：为什么 Agent 的评测比聊天机器人难](https://xinfengwang.github.io/2026/09/15/evaluation-overview/) | 四层评测 | 足 / 正 / 中 / 部分 | 文本流程/结构 / 0 | Agent Evaluation | D · 重组导读，作为旧系列导览链接课程评估 |
| 核心技术与能力体系 · 轨迹检索 | [Few-shot Retrieval：怎么让历史轨迹真正帮助 Agent Planning？](https://xinfengwang.github.io/2026/09/15/few-shot-retrieval/) | 按环境选成功和失败轨迹 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 规划 RAG | B · 补充，补适用工具版本和不匹配退路 |
| 基础理论与核心原理 · 旧入门 | [从 LLM 到 Agent：模型、状态、工具与环境](https://xinfengwang.github.io/2026/09/15/from-llm-to-agent/) | 模型动作和环境 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 什么是 Agent、Agent 运行循环 | D · 重组导读，独立阅读价值由新入门覆盖 |
| 核心技术与能力体系 · 工具调用 | [Function Calling：模型到底是怎么学会调用工具的？](https://xinfengwang.github.io/2026/09/15/function-calling/) | Schema、参数和多轮回填 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Function Calling 课程篇 | D · 重组导读，模型训练机制超出正文范围，收敛定位 |
| 评估、安全与可观测性 · 后置校验 | [Guardrail 与 CodeCheck：为什么执行后验证不可缺？](https://xinfengwang.github.io/2026/09/15/guardrail-codecheck/) | 守卫与执行结果核对 | 足 / 正 / 浅 / 部分 | 文本流程/结构 / 0 | 确定性评估 | B · 补充，补工具成功而业务失败的错误模型 |
| 项目实战与案例拆解 · GUI 回归 | [GUI Agent：Badcase 怎么从一次失败变成回归资产？](https://xinfengwang.github.io/2026/09/15/gui-agent-badcase-loop/) | 知识、规划和执行失效分类 | 足 / 正 / 中 / 足 | — / 0 | — | B · 补充，补 UI 版本固定和结果标注 |
| 项目实战与案例拆解 · GUI 知识库 | [GUI 知识构建：从界面操作到可检索指令](https://xinfengwang.github.io/2026/09/15/gui-agent-function-tree/) | 界面树、意图和索引构建 | 足 / 正 / 深 / 足 | — / 0 | — | A · 保留，保留公开展示与评测口径区别 |
| 核心技术与能力体系 · 混合检索 | [Hybrid Search：关键词、向量与 RRF 为什么要一起用？](https://xinfengwang.github.io/2026/09/15/hybrid-search/) | 融合名次与重排 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 混合检索课程篇 | D · 重组导读，主讲移至课程 RRF 数值例子 |
| 评估、安全与可观测性 · 模型裁判 | [LLM-as-Judge 为什么不稳定，以及什么时候还能用？](https://xinfengwang.github.io/2026/09/15/llm-as-judge/) | 偏差、配对和混合评估 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | — | B · 补充，补人工标定和位置交换控制 |
| 架构设计与设计模式 · 协作可靠性 | [多 Agent 系统最常见的五类流转 Badcase](https://xinfengwang.github.io/2026/09/15/multi-agent-badcases/) | 委派、退出、重复和恢复 | 足 / 正 / 中 / 部分 | 文本流程/结构 / 0 | Supervisor 与 Manager | B · 补充，补互斥写入和扇入验收条件 |
| 架构设计与设计模式 · 共享状态 | [多 Agent 共享上下文：到底应该共享什么，不共享什么？](https://xinfengwang.github.io/2026/09/15/multi-agent-shared-context/) | 状态投影和工件交接 | 足 / 正 / 中 / 足 | — / 0 | Workspace Context | B · 补充，补并行更新版本冲突 |
| 评估、安全与可观测性 · 交互评测 | [无交互评测与真实交互 Harness，有什么本质差异？](https://xinfengwang.github.io/2026/09/15/offline-eval-vs-interactive-harness/) | 无交互夹具、审批和真实行为 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | — | B · 补充，补不可替换的人机交互样本 |
| 评估、安全与可观测性 · 权限 RAG | [权限 RAG：最小权限、元数据过滤与越权防护怎么做？](https://xinfengwang.github.io/2026/09/15/permission-aware-rag/) | 访问范围、过滤缓存和日志 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 向量索引、文档解析 | B · 补充，补撤权后缓存失效和跨租户样本 |
| 博客独立文章 · 工程写作 | [从项目 README 到技术博客：如何公开表达工程深度？](https://xinfengwang.github.io/2026/09/15/public-engineering-writing/) | 公开材料、指标语境与失败样例 | 足 / 正 / 适配 / 适配 | 文本流程/结构 / 0 | — | A · 保留，独立写作文章，保留定位 |
| 核心技术与能力体系 · RAG 排障 | [RAG Badcase：知识库有答案却检索不到，怎么排查？](https://xinfengwang.github.io/2026/09/15/rag-badcase-debugging/) | 逐层追踪丢失证据 | 足 / 正 / 中 / 足 | — / 0 | 文档 Agent 上下文、RAG 评估 | B · 补充，补从召回到组装的可观测字段 |
| 核心技术与能力体系 · RAG 旧入门 | [RAG 基础：Chunk、Embedding、Vector Search 到底怎么串起来？](https://xinfengwang.github.io/2026/09/15/rag-basics/) | Chunk、Embedding 与 Top-K | 足 / 正 / 浅 / 足 | 文本流程/结构 / 0 | RAG 基础、Chunking、Embedding | D · 重组导读，使旧文指向课程基础和分块专篇 |
| 核心技术与能力体系 · 上下文旧导读 | [总纲：Agent 的上下文为什么比 Prompt 更重要](https://xinfengwang.github.io/2026/09/15/rag-context-overview/) | Prompt、RAG 与 Workspace | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Prompt Engineering、RAG 基础 | D · 重组导读，收敛成跨文导览 |
| 项目实战与案例拆解 · ReproLab | [ReproLab：Planner / Executor / Critic 的工程边界怎么划？](https://xinfengwang.github.io/2026/09/15/reprolab-agent-boundaries/) | Planner、Executor 和 Critic | 足 / 正 / 中 / 足 | — / 0 | 结构化计划执行 | B · 补充，补一个完整的数据制品交接样例 |
| 项目实战与案例拆解 · ReproLab | [ReproLab：可信科研 Agent 的数据血缘为什么是核心？](https://xinfengwang.github.io/2026/09/15/reprolab-provenance/) | Dataset、Run、Artifact 与 Claim | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | — | B · 补充，补环境和上游依赖版本示例 |
| 工程化与生产实践 · 故障恢复 | [Retry、Rollback 与 Replan：Agent 失败以后怎么继续？](https://xinfengwang.github.io/2026/09/15/retry-rollback-replan/) | Retry、Replan、补偿 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 生产可靠性 | B · 补充，补未知执行结果与执行回执 |
| 评估、安全与可观测性 · 脚本校验 | [Script Validation：JSON、Workflow 与 Bash 到底应该校验什么？](https://xinfengwang.github.io/2026/09/15/script-validation/) | JSON、工作流与脚本校验 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 确定性评估 | B · 补充，补静态检查通过却运行失败的反例 |
| 评估、安全与可观测性 · 指标设计 | [七维评测：为什么 Agent 不能只看任务完成率？](https://xinfengwang.github.io/2026/09/15/seven-dimension-agent-evaluation/) | 七维能力和聚合边界 | 足 / 正 / 中 / 部分 | — / 0 | Agent Evaluation | B · 补充，补分母、样本切片与阈值标定 |
| 项目实战与案例拆解 · 智能家居数据 | [Smart Home：传感器抖动、异常值与数据筛选怎么处理？](https://xinfengwang.github.io/2026/09/15/smart-home-sensor-data/) | 滤波、异常与冲突 | 足 / 正 / 中 / 足 | — / 0 | — | B · 补充，补迟到乱序与采样频率 |
| 项目实战与案例拆解 · 结构化规划 | [工程实践：为什么结构化 Plan + Executor 更适合可评测 Agent？](https://xinfengwang.github.io/2026/09/15/structured-plan-executor/) | 计划契约、状态及可评测执行器 | 足 / 正 / 中 / 足 | — / 0 | 任务规划 | B · 补充，补计划变更前后的实例 |
| 架构设计与设计模式 · 多 Agent 协调 | [Supervisor 与 Manager Agent：任务到底应该怎么分发？](https://xinfengwang.github.io/2026/09/15/supervisor-manager-agent/) | 角色路由和产物验收 | 足 / 正 / 中 / 部分 | — / 0 | 多 Agent 流转 Badcase | B · 补充，补扇入、冲突与责任转移 |
| 核心技术与能力体系 · 工具路由 | [Tool Schema 与 Tool Router：工具多了以后怎么办？](https://xinfengwang.github.io/2026/09/15/tool-schema-router/) | Schema、候选裁剪和权限前置 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | Function Calling 课程篇 | B · 补充，补工具重名、版本和调用批次 |
| 架构设计与设计模式 · 任务上下文 | [Workspace Context：任务产物如何跨 Agent 传递？](https://xinfengwang.github.io/2026/09/15/workspace-context/) | Workspace 快照与跨角色交接 | 足 / 正 / 中 / 足 | 文本流程/结构 / 0 | 共享上下文、Artifact 工作流 | B · 补充，补制品并发提交条件 |
| 工程化与生产实践 · 版本化规格 | [增量规格与全量知识：让 Agent 的下一次任务从正确事实开始](https://xinfengwang.github.io/2026/11/01/agent-spec-change-lifecycle/) | 增量事实、验证和并发归档 | 足 / 正 / 深 / 足 | — / 0 | — | A · 保留，保留导出任务变更案例 |
| 工程化与生产实践 · 研发 Harness | [研发 Agent Harness：规范、上下文与验证闭环](https://xinfengwang.github.io/2026/11/01/reliable-development-agent-harness/) | 作用域、校验、恢复及维护 | 足 / 正 / 深 / 足 | 文本流程/结构 / 0 | — | A · 保留，保留，同主题短文可导向此文 |
| 工程化与生产实践 · 幂等恢复 | [Agent 任务恢复后，怎么避免把同一个动作做两遍？](https://xinfengwang.github.io/2026/11/05/agent-checkpoint-idempotency/) | 审批、提交和目标确认 | 足 / 正 / 中 / 足 | — / 0 | 文档 Agent 写入、生产可靠性 | B · 补充，补供应方缺幂等键的边界 |
| 评估、安全与可观测性 · 复盘笔记 | [Agent Harness 学习心得：失败重放能验证什么？](https://xinfengwang.github.io/2026/11/05/agent-replay-reading-notes/) | 重放样本、错误定位与范围 | 足 / 正 / 适配 / 足 | — / 0 | — | A · 保留，保留笔记定位，后续关联追踪课 |
| 评估、安全与可观测性 · MCP 安全 | [MCP 工具接进来之后，谁决定数据能不能发出去？](https://xinfengwang.github.io/2026/11/05/mcp-tool-trust-boundary/) | 工具能力与数据外发授权 | 足 / 正 / 中 / 足 | — / 0 | MCP 能力模型 | B · 补充，补连接、资源和任务级授权区分 |
| 核心技术与能力体系 · 推理服务 | [vLLM 学习笔记：长 Prompt 进来时，GPU 怎么分时间和显存？](https://xinfengwang.github.io/2026/11/05/vllm-serving-notes/) | Prefill、批处理和 PagedAttention | 足 / 正 / 中 / 足 | — / 0 | 大模型推理 | B · 补充，标注服务版本，补吞吐与首字权衡 |
| 博客独立文章 · 创意编程 | [雨夜便利店 SoraMart：从三维场景到可玩的交互原型](https://xinfengwang.github.io/2026/11/12/soramart-creative-coding/) | 交互原型、状态和运行验收 | 足 / 正 / 适配 / 足 | — / 0 | — | A · 保留，保留在原创意编程系列 |
| 项目实战与案例拆解 · 文档 Agent | [从零写一个文档 Agent：工具、状态和验收](https://xinfengwang.github.io/2026/11/18/build-a-document-agent/) | 真实形状的 call_id 和停止验收 | 足 / 正 / 深 / 足 | Mermaid 2 / 0 | — | A · 保留，保留为执行循环实战 |
| 核心技术与能力体系 · 上下文组装 | [明明检索到了，Agent 为什么没把那段话用上？](https://xinfengwang.github.io/2026/11/18/document-agent-context/) | 四阶段证据 ID、预算和回归 | 足 / 正 / 深 / 足 | Mermaid 1 / 0 | — | A · 保留，可作为组装正文的进阶实战 |
| 工程化与生产实践 · 写入恢复 | [写入成功，为什么 Agent 还显示未完成？](https://xinfengwang.github.io/2026/11/18/document-agent-durable-write/) | 双库状态、断点注入和回执 | 足 / 正 / 深 / 足 | Mermaid 2 / 0 | — | A · 保留，保留为幂等可靠性实战 |
| 评估、安全与可观测性 · 回归实战 | [Agent 改完真的更好吗？拿一次漏检索做回归](https://xinfengwang.github.io/2026/11/18/document-agent-regression/) | 版本对比、漏检索及上线门禁 | 足 / 正 / 深 / 足 | Mermaid 1 / 0 | — | A · 保留，保留为回归测试实战 |
| 工程化与生产实践 · 发布回滚 | [总完成率没变，为什么还要回滚 Agent？](https://xinfengwang.github.io/2026/11/18/document-agent-release/) | 分组失败、发布版本与核验 | 足 / 正 / 深 / 足 | Mermaid 1 / 0 | — | A · 保留，保留为生产发布实战 |
| 架构设计与设计模式 · 协作委派 | [任务交给多个 Agent 之后，谁负责把事情做完？](https://xinfengwang.github.io/2026/11/19/agent-orchestration-after-delegation/) | 任务、对话、运行与验收契约 | 足 / 正 / 深 / 足 | Mermaid 1 / 0 | — | A · 保留，保留，课程侧补通用拓扑 |
| 前沿技术与发展趋势 · 项目知识 | [Coding Agent 记住了项目，为什么还是会改错？](https://xinfengwang.github.io/2026/11/19/coding-agent-project-ontology/) | 对象、关系、不变量和增量语义 | 足 / 正 / 深 / 足 | Mermaid 1 / 0 | — | A · 保留，保留，记忆专题链接为应用 |

## RAG 专题结论

保留现有 15 篇阅读顺序。向量检索的相似度、倒排索引与 BM25、RRF 及分数融合、双塔与交叉编码均已有正文。第二轮先补索引构建过程、复杂版面与分块的可核算案例，再建设上下文组装与生产架构。上下文组装以证据覆盖、预算和回退为主，使用文档 Agent 现有实验作为关联阅读。生产架构以索引代迁移、权限、缓存、延迟及成本为主，评估指标留在既有 RAG Evaluation。

## 阶段记录

以下审查记录以基线版本为准。后续文章的状态、阅读路径与验收按 [内容路线](content-roadmap.md) 更新。
