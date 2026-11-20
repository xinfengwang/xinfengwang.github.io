# Agent Engineering 知识覆盖清单

以站点源码中的八个板块、现有系列和文章为准。读者入口在 [Agent 开发知识地图](../agent-engineering.html)。写作和验收按[文章规范](engineering-writing.md)执行。

| 专题状态 | 判断依据 |
| --- | --- |
| 概览已发布 | 已有面向读者的入口，可找到主题和上下游，后续需要补关键机制。 |
| 深度建设中 | 已有专题、实验或案例，仍缺关键机制、选型比较、前后置链接或章末问答。尚缺独立文章的主题在差距栏标记。 |
| 深度已完成 | 对约定范围讲清问题、原理、流程和适用条件，已配置前后置阅读和可折叠问答。只表示该行专题范围达到要求。 |

## 1. 基础理论与核心概念

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| Agent 的定义、控制权、Chatbot / Workflow / Autonomous Agent、目标驱动与技术演进 | `agent-foundations-overview`、`from-llm-to-agent`；运行机制篇对照三种控制方式。 | 深度建设中 | 从一次 LLM 调用开始，补传统 ML、生成式 AI 与 Agent 的演进，以及任务型、对话型、研究、编程、浏览器和多模态 Agent 的边界。 |
| Agent Loop、上下文、动作、外部观察、状态、运行时、验收与终止 | `agent-runtime-overview` 引入 Runtime；`agent-engineering-foundations` 跟踪一次售后查询。 | 深度已完成 | 先读 `from-llm-to-agent`，运行机制篇有 7 题。接着读工具协议、状态管理及 ReAct。 |
| 设计范式与组件责任 | `agent-engineering-architecture` 总览，`agent-deep-dive-react`、`agent-deep-dive-plan-execute`、`agent-deep-dive-reflection-router` 分解。 | 深度建设中 | 本板块保留模型、工具、环境、规划、记忆、编排和验收的架构关系，详细选型归板块三。 |

## 2. 核心技术与能力体系

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| LLM、Transformer、推理服务与模型选择 | `agent-deep-dive-llm-prompt` 讲可执行输出和第一轮选型，`vllm-serving-notes` 讲推理服务。 | 概览已发布 | 先补 tokenization、模型结构、Q/K/V 和多头注意力、位置编码、FFN、逐 token 解码、采样与 KV Cache。再连接幻觉、长上下文、模型路由和部署。 |
| Prompt Engineering | `agent-engineering-capabilities` 及 `agent-deep-dive-llm-prompt` 有结构化输出，`few-shot-retrieval` 讲示例召回。 | 深度建设中 | 补消息与指令层级、zero/few-shot、模板版本和回归。注入防御接板块六。 |
| Function Calling 与 Tool Use | `function-calling` 是入门；`agent-deep-dive-tool-use` 讲工具定义、调用、授权及回填，`tool-schema-router` 延伸多工具筛选。 | 深度已完成 | 先看 Agent Loop，示范篇有 7 题；工具动态发现与权限接 MCP 专题。 |
| RAG 核心架构与证据流 | `rag-basics` 是入门；`agent-deep-dive-rag` 追踪政策从入库到引用，`document-agent-context` 细看上下文装配。 | 深度已完成 | 架构示范篇有 8 题。算法细节和高级检索按下表继续，RAG 整个系列仍在建设。 |
| Context、State 与 Memory | `rag-context-overview`、`agent-memory`、`agent-deep-dive-agent-state`、`workspace-context`。 | 深度建设中 | 明确短期和长期、语义/情节/程序记忆。补记忆提取、写入、合并、冲突、遗忘和可删除性。先分清任务状态，再比较记忆与知识检索。 |
| Planning 与 Reasoning | `agent-planning-patterns`、`structured-plan-executor`、`agent-deep-dive-plan-execute`、`agent-deep-dive-react`。 | 深度建设中 | 规划篇负责依赖、验证、重规划和终止。增补可检查的推理输出、自洽性、树和图搜索、反思、多步推理成本；使用动作、结果与验收说明过程。 |
| Multi-Agent 与环境交互 | `multi-agent-shared-context`、`agent-orchestration-after-delegation`、`gui-agent-function-tree`。 | 深度建设中 | 补角色消息合同、委派、冲突处理，及 Web/API/数据库/文件、Browser 与 Computer Use 的观测和验证。拓扑选型接板块三。 |

### RAG 系列顺序与缺口

目录状态在 `_data/rag_curriculum.yml` 维护，课程页链接本表的知识点对应入口。标为延伸阅读的内容提供背景，完整主课仍按下列缺口补齐。

| 顺序与专题 | 已有文章 | 状态 | 后续内容 |
| --- | --- | --- | --- |
| 1. 架构与原理 | `rag-basics` → `agent-deep-dive-rag` | 深度已完成 | 已讲索引、检索、生成、长上下文/微调取舍及 Agent 集成。 |
| 2. 解析与预处理 | `rag-document-parsing` | 深度建设中 | 已有 PDF、Word、HTML、OCR 和证据坐标。补 Markdown、Excel、图表、多模态、清洗去重及版面质量分层；补问答。 |
| 3. Chunking | `rag-chunking` | 深度建设中 | 已有固定窗口、重叠、递归、结构、语义及父子方案的比较。补 Late Chunking、长度与送达预算；补问答。 |
| 4. Embedding | `rag-embedding` | 深度建设中 | 已有双塔、相似度、多语言与维度实验。补对比学习样本、距离函数适用条件和向量版本治理；补问答。 |
| 5. 向量数据库与 ANN | `agent-deep-dive-rag#ingest` 有概览 | 概览已发布 | 新写 Exact、HNSW、IVF/PQ、索引更新/删除、元数据过滤、召回与时延、向量库选型。先读 Embedding。 |
| 6. BM25 和稀疏检索 | `hybrid-search` 有比较 | 概览已发布 | 新写倒排索引、TF-IDF、BM25 的词频饱和和长度归一、中文分词与稀疏向量。 |
| 7. Hybrid Search | `hybrid-search`、`agent-deep-dive-rag#ranking` | 深度建设中 | 深读篇补分数归一、加权融合、RRF、去重和各路 Top-K。依赖 BM25 及向量检索。 |
| 8. Rerank | `agent-deep-dive-rag#ranking` | 概览已发布 | 新写双塔与交叉编码、候选深度、重排阈值、延迟与两阶段评估。 |
| 9. Query 变换 | `rag-for-agent-planning` 提供检索任务背景 | 深度建设中 | 新写 Query Rewrite、Expansion、Multi-Query、HyDE 的对照和漂移判定。 |
| 10. Advanced RAG | `document-agent-context` 讲装配；`rag-chunking` 讲父子分块 | 深度建设中 | 补 Contextual Retrieval、Self-RAG、Corrective RAG、多跳和多模态，分开讲回退条件与验证。 |
| 11. GraphRAG | `agent-deep-dive-rag#ranking` 提及关系图 | 概览已发布 | 新写实体和关系构建、局部和全局查询、授权、增量成本以及和普通检索对照。 |
| 12. Agentic RAG | `rag-for-agent-planning`、`agent-deep-dive-rag#choices` | 概览已发布 | 补查询与数据源路由、迭代补查、证据充分性、停止与降级。先学 Agent Loop 和 RAG 架构。 |
| 13. RAG 评估 | `rag-badcase-debugging`、`document-agent-regression`、`agent-deep-dive-rag#evaluation` | 深度建设中 | 补 Recall/Precision@K、MRR、nDCG 的统一算例及生成层 Faithfulness、相关性、Context Precision/Recall 和 RAGAS。完成到板块六的双向链接。 |

## 3. 架构设计与设计模式

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| Runtime、Orchestrator、数据层及控制流 | `agent-runtime-overview`、`agent-engineering-architecture`、`why-agent-workflow-needs-state-machine`。 | 深度建设中 | 补一张同样输入在模型、工具、状态、知识、记忆和执行层的责任图；用状态和数据流区分工作流与模型驱动。 |
| 单 Agent、Workflow、ReAct、计划执行、Reflection、Router、Human-in-the-Loop | `agent-deep-dive-react`、`agent-deep-dive-plan-execute`、`agent-deep-dive-reflection-router`。 | 深度建设中 | 把一条业务输入贯穿常见模式，补串行、并行、Map-Reduce、Evaluator-Optimizer 及可验证的结构和退出条件。 |
| Supervisor、分层、点对点、多 Agent 与企业架构 | `agent-deep-dive-supervisor`、`supervisor-manager-agent`、`agent-case-platform`。 | 深度建设中 | 补拓扑选择、产物仲裁、隔离、跨租户治理和审计。先读状态机与共享状态。 |

## 4. 开发框架与技术生态

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| LangGraph | `agent-engineering-frameworks` 导读，`agent-deep-dive-langgraph` 讲中断和恢复。 | 深度建设中 | 补 Graph、State、Node、Edge、Reducer，及 Command、Send、子图、并发、持久化各自的执行语义。先学状态机，补问答。 |
| LangChain、LlamaIndex | `agent-engineering-frameworks` 有分层比较。 | 概览已发布 | 各补一篇独立深读。LangChain 讲 Model/Prompt/Runnable/LCEL、检索、解析器、回调与 Agent。LlamaIndex 走 Document/Node/Index/Retriever、Query Engine、响应合成与 Workflow。 |
| AutoGen、CrewAI、Semantic Kernel | `agent-engineering-frameworks` 有组件和用法概览。 | 概览已发布 | 补 AutoGen 消息和版本演进，CrewAI 的 Crew、角色、任务与 process，Semantic Kernel 的 Kernel、Plugin、Function 和集成边界。 |
| MCP、A2A 与互操作 | `mcp-and-function-calling`、`agent-deep-dive-mcp-a2a`、`mcp-tool-trust-boundary`。 | 深度建设中 | 按实际规范版本展开 Host/Client/Server、JSON-RPC、握手、能力协商、工具、资源、提示、Sampling、Roots、传输和安全，以及 A2A 卡片、任务、消息与产物。 |
| 其他 SDK、编排产品、模型服务 | `vllm-serving-notes`。 | 深度建设中 | OpenAI Agents SDK、Google ADK、Pydantic AI 及 Haystack、Dify、n8n、Ollama、LiteLLM 尚缺同场景技术选型。按各自接管的层分类。 |

## 5. 工程化与生产实践

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| 项目结构、状态/会话、持久化与一致性 | `agent-engineering-production`、`agent-deep-dive-durability`、`document-agent-durable-write`。 | 深度建设中 | 补 State/Session/Thread 生命周期，库、缓存、对象存储的分工，备份恢复与并发版本冲突；补问答。 |
| 异步、队列、超时、回退、幂等与恢复 | `retry-rollback-replan`、`agent-checkpoint-idempotency`、`document-agent-durable-write`。 | 深度建设中 | 补 worker 租约与重复投递、退避、熔断、补偿、取消和部分失败，演示如何按外部回执恢复。 |
| 服务接口、部署、发布和成本 | `agent-deep-dive-deployment`、`document-agent-release`、`vllm-serving-notes`。 | 深度建设中 | 补 FastAPI、REST、SSE/WebSocket、认证限流、Docker/Kubernetes、CI/CD 与多版本灰度；量化排队、首 token、吞吐、缓存和降级。 |
| 企业级集成、多租户与工具治理 | `agent-case-platform` 给出跨队列案例。 | 深度建设中 | 补管理面、空间与租户分区、工具注册、知识与任务调度及审计指标。衔接板块三的架构。 |

## 6. 评估、安全与可观测性

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| Agent 评估、Benchmark 与测试 | `evaluation-overview`、`agent-benchmark`、`deterministic-agent-evaluation`、`llm-as-judge`、`document-agent-regression`。 | 深度建设中 | 补任务成功、工具选择/参数、效率和成本的统一粒度，区分单元、集成、端到端、边界和长任务回归，给出版本与评分协议。 |
| RAG Evaluation | `rag-badcase-debugging`、`agent-deep-dive-rag#evaluation`。 | 深度建设中 | 在 RAG 系列维护检索和生成指标的正文，这里补发布阈值、人评一致性与自动评分边界。 |
| 安全与权限治理 | `agent-safety-hitl`、`agent-deep-dive-security-gates`、`mcp-tool-trust-boundary`、`permission-aware-rag`。 | 深度建设中 | 深化直接/间接提示词注入防御、外部数据、权限越界及 SSRF 的出站防护、沙箱和人工审批。用防御用例验证拒绝不可信输入、数据隔离和审计。 |
| Tracing、日志、指标与工具 | `agent-tracing`、`agent-deep-dive-observability`、`agent-badcase-loop`。 | 深度建设中 | 补 OpenTelemetry Span 关系、采样和脱敏，同一轨迹对比 LangSmith、Langfuse、Phoenix、Prometheus/Grafana、Sentry 的定位。 |

## 7. 项目实战与案例拆解

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| 基础 Agent、查单、知识问答、记忆 | `agent-engineering-cases`、`agent-case-support` 和 `build-a-document-agent`。 | 深度建设中 | 补从单次对话到多工具、RAG 问答及 Memory 的小案例。前置 Agent Loop、Tool Use、RAG，案例按业务需求、决策路径和验收组织。 |
| Research、Browser、SQL、数据/文档分析、Workflow | `agent-case-research`、`gui-agent-function-tree`、文档 Agent 系列及 ReproLab 案例。 | 深度建设中 | 补浏览器和 SQL 的只读任务、错误收敛及证据链，解释为什么选择 Agent 或显式工作流。 |
| 多 Agent 和企业系统 | `agent-case-development`、`agent-case-platform`、`agent-orchestration-after-delegation`。 | 深度建设中 | 补 Supervisor/研究/生成协作、企业知识库和流程自动化。用独立验收标准说明并行收益、权限与交付物。 |

## 8. 前沿技术与发展趋势

| 专题范围 | 现有概览与深读 | 状态 | 缺口与阅读依赖 |
| --- | --- | --- | --- |
| Research、Coding、Browser、Computer Use 与 Agentic Workflow | `agent-engineering-frontier`、`coding-agent-harness`、`agent-case-research`。 | 深度建设中 | 区分已有实用架构与更高自主性探索。补运行证据、任务边界和成功/失败评估。 |
| 长时运行、多模态、实时语音、具身和 Physical AI | `agent-deep-dive-long-running`、`smart-home-agent-loop` 提供恢复与传感案例。 | 深度建设中 | 先完成长任务恢复、观察和停止，再补实时音频中断、多模态确认以及物理系统验证。明确各路线工程成熟度。 |
| 互操作、持续学习、评测基准与 Agent Runtime | `agent-deep-dive-mcp-a2a`、`agent-replay-reading-notes`、`coding-agent-project-ontology`。 | 深度建设中 | 协议细节归板块四。此处跟踪记忆演进、外部反馈、自我改进和运行时研究，区分论文、原型和生产证据。 |

## 已有内容的分工

| 重叠内容 | 概览与深入文章的边界 |
| --- | --- |
| Agent 定义与执行循环 | `from-llm-to-agent` 讲从一次生成到闭环。`agent-engineering-foundations` 跟踪状态转移及验收。`agent-runtime-overview` 导读状态机、多 Agent 和恢复。 |
| 工具调用、路由与 MCP | `function-calling` 解释基本消息。`agent-deep-dive-tool-use` 保持执行合同、授权与回执。`tool-schema-router` 集中处理多工具选择，MCP 篇只解释它新增的协议能力。 |
| RAG 基础、架构、算法与调试 | `rag-basics` 提供最短阅读路径。`agent-deep-dive-rag` 串全过程。解析、分块和嵌入分别保留技术机制，Hybrid 篇深入融合，调试篇专注溯源和复现。 |
| Memory、上下文、State 与工作区 | `agent-deep-dive-agent-state` 给生命周期与所有者，`agent-memory` 讲记忆数据流，`workspace-context` 和 `codebase-context` 提供编程任务中的材料和状态组织。 |
| 规划、状态机与恢复 | `agent-planning-patterns` 做选型入门，`agent-deep-dive-plan-execute` 讲依赖失效，`why-agent-workflow-needs-state-machine` 讲转移，`agent-deep-dive-durability` 讲业务提交后恢复。 |
| Tracing、评估与发布 | `agent-tracing` 讲排障，`agent-deep-dive-observability` 讲数据与采样设计。`agent-benchmark` 讲样本与验收，`document-agent-regression` 和 `document-agent-release` 各负责回归与灰度。 |

## 本轮验收与下一批顺序

1. 先验收三篇样板。读完能分别解释工具结果为何要回填、证据在哪里丢失、模型和运行时各自执行什么。三章共有 22 个默认折叠问题。
2. 继续基础和核心技术。先补 Transformer 与 Prompt，再补 Memory、Planning、Reasoning。RAG 沿课程顺序优先补 ANN、BM25、Hybrid 和 Rerank，把前段三个实验专题的问答补齐后，再往查询变换和 Agentic RAG 扩展。
3. 把工作流、架构模式和 LangGraph 接在同一份状态与产物例子上。随后按协议版本补 MCP、A2A 和其他框架。
4. 继续生产与质量章节。串起持久状态、可靠执行、服务部署、回归、权限、可观测性，再补案例和前沿。
5. 每批更新覆盖清单和附录问答状态。最终遍历八个板块、文章页、前后置链接、目录及桌面和手机端体验。

## 附录 · 现有文章盘点

按源码日期列出 `_posts/` 的 96 篇文章。教学角色以当前正文为准，原系列分类和栏目标签仍在各篇 front matter。概览负责串起知识，深读/实验集中解释或验证某个机制，专题/笔记覆盖一个局部主题，案例负责说明一项具体业务设计。`待补`指尚未使用统一的章末问答组件。

| 文章 | 主要入口 | 教学角色 | 章末问答 |
| --- | --- | --- | --- |
| [LangGraph 为什么更适合 Multi-Agent？](../_posts/2026-09-03-langgraph-for-multi-agent.md) | 工作流系列 | 专题/笔记 | 待补 |
| [Agent Planning 的 RAG，为什么和普通问答 RAG 不一样？](../_posts/2026-09-08-rag-for-agent-planning.md) | RAG系列 | 专题/笔记 | 待补 |
| [Smart Home：感知—预测—决策—验证—执行闭环怎么设计？](../_posts/2026-09-09-smart-home-agent-loop.md) | 案例系列 | 案例 | 待补 |
| [Coding Agent 到底比普通 Agent 多了什么？](../_posts/2026-09-10-coding-agent-harness.md) | 编程系列 | 专题/笔记 | 待补 |
| [Agent Tracing：一次失败到底错在哪一层？](../_posts/2026-09-11-agent-tracing.md) | 评估系列 | 专题/笔记 | 待补 |
| [为什么 Agent Workflow 需要状态机，而不是让 LLM 自由流转？](../_posts/2026-09-12-why-agent-workflow-needs-state-machine.md) | 工作流系列 | 专题/笔记 | 待补 |
| [Context Engineering：Workspace 与 Codebase 应该怎么分？](../_posts/2026-09-13-context-engineering-workspace-codebase.md) | RAG系列 | 专题/笔记 | 待补 |
| [MCP：为什么有 Function Calling 还需要协议层？](../_posts/2026-09-14-mcp-and-function-calling.md) | 基础系列 | 专题/笔记 | 待补 |
| [Badcase 闭环：怎么把一次 Agent 失败变成下一版系统的能力？](../_posts/2026-09-15-agent-badcase-loop.md) | 评估系列 | 专题/笔记 | 待补 |
| [Agent Benchmark：怎么设计真正能回归的任务集？](../_posts/2026-09-15-agent-benchmark.md) | 评估系列 | 专题/笔记 | 待补 |
| [总纲：怎么把一个 Agent Demo 做成可展示、可运行的系统？](../_posts/2026-09-15-agent-demo-to-system.md) | 案例系列 | 概览/导读 | 待补 |
| [总纲：AI Agent 到底在解决什么问题？](../_posts/2026-09-15-agent-foundations-overview.md) | 基础系列 | 概览/导读 | 待补 |
| [工程实践：Agent Harness 如何把 Workflow、Context 和 Evaluation 串成闭环？](../_posts/2026-09-15-agent-harness-closed-loop.md) | 案例系列 | 专题/笔记 | 待补 |
| [Agent Memory：短期记忆、长期记忆与可控召回](../_posts/2026-09-15-agent-memory.md) | 基础系列 | 专题/笔记 | 待补 |
| [Planning：ReAct、Plan-and-Execute 与结构化计划怎么选？](../_posts/2026-09-15-agent-planning-patterns.md) | 基础系列 | 专题/笔记 | 待补 |
| [总纲：为什么 Agent 需要 Runtime](../_posts/2026-09-15-agent-runtime-overview.md) | 工作流系列 | 概览/导读 | 待补 |
| [Agent 的权限、安全与 Human-in-the-loop 应该怎么设计？](../_posts/2026-09-15-agent-safety-hitl.md) | 基础系列 | 专题/笔记 | 待补 |
| [AI Agent 工程学习地图：从 Tool Use 到 Reliable Agent](../_posts/2026-09-15-ai-agent-engineering-map.md) | 独立文章 | 概览/导读 | 待补 |
| [产物驱动 Workflow：为什么 Artifact 比聊天历史更适合推动状态流转？](../_posts/2026-09-15-artifact-driven-workflow.md) | 工作流系列 | 专题/笔记 | 待补 |
| [Codebase Context：大仓库到底应该怎么被 Coding Agent 理解？](../_posts/2026-09-15-codebase-context.md) | 编程系列 | 专题/笔记 | 待补 |
| [Benchmark 驱动 Coding Agent：怎么让系统持续迭代而不是靠感觉调 Prompt？](../_posts/2026-09-15-coding-agent-benchmark-loop.md) | 编程系列 | 专题/笔记 | 待补 |
| [Coding Agent 的工具权限：为什么最小权限比强 Prompt 更重要？](../_posts/2026-09-15-coding-agent-permissions.md) | 编程系列 | 专题/笔记 | 待补 |
| [Coding Workflow：Spec → Design → Tasks → Code 为什么比直接写代码稳？](../_posts/2026-09-15-coding-workflow.md) | 编程系列 | 专题/笔记 | 待补 |
| [AST / Assertion：Agent 执行结果怎么做确定性比对？](../_posts/2026-09-15-deterministic-agent-evaluation.md) | 评估系列 | 专题/笔记 | 待补 |
| [总纲：为什么 Agent 的评测比聊天机器人难](../_posts/2026-09-15-evaluation-overview.md) | 评估系列 | 概览/导读 | 待补 |
| [Few-shot Retrieval：怎么让历史轨迹真正帮助 Agent Planning？](../_posts/2026-09-15-few-shot-retrieval.md) | RAG系列 | 专题/笔记 | 待补 |
| [从 LLM 到 Agent：模型、状态、工具与环境](../_posts/2026-09-15-from-llm-to-agent.md) | 基础系列 | 概览/导读 | 待补 |
| [Function Calling：模型到底是怎么学会调用工具的？](../_posts/2026-09-15-function-calling.md) | 基础系列 | 概览/导读 | 待补 |
| [Guardrail 与 CodeCheck：为什么执行后验证不可缺？](../_posts/2026-09-15-guardrail-codecheck.md) | 评估系列 | 专题/笔记 | 待补 |
| [GUI Agent：Badcase 怎么从一次失败变成回归资产？](../_posts/2026-09-15-gui-agent-badcase-loop.md) | 案例系列 | 案例 | 待补 |
| [GUI 知识构建：从界面操作到可检索指令](../_posts/2026-09-15-gui-agent-function-tree.md) | 案例系列 | 案例 | 待补 |
| [Hybrid Search：关键词、向量与 RRF 为什么要一起用？](../_posts/2026-09-15-hybrid-search.md) | RAG系列 | 专题/笔记 | 待补 |
| [LLM-as-Judge 为什么不稳定，以及什么时候还能用？](../_posts/2026-09-15-llm-as-judge.md) | 评估系列 | 专题/笔记 | 待补 |
| [多 Agent 系统最常见的五类流转 Badcase](../_posts/2026-09-15-multi-agent-badcases.md) | 工作流系列 | 专题/笔记 | 待补 |
| [多 Agent 共享上下文：到底应该共享什么，不共享什么？](../_posts/2026-09-15-multi-agent-shared-context.md) | 工作流系列 | 专题/笔记 | 待补 |
| [无交互评测与真实交互 Harness，有什么本质差异？](../_posts/2026-09-15-offline-eval-vs-interactive-harness.md) | 编程系列 | 专题/笔记 | 待补 |
| [权限 RAG：最小权限、元数据过滤与越权防护怎么做？](../_posts/2026-09-15-permission-aware-rag.md) | RAG系列 | 专题/笔记 | 待补 |
| [从项目 README 到技术博客：如何公开表达工程深度？](../_posts/2026-09-15-public-engineering-writing.md) | 案例系列 | 专题/笔记 | 待补 |
| [RAG Badcase：知识库有答案却检索不到，怎么排查？](../_posts/2026-09-15-rag-badcase-debugging.md) | RAG系列 | 专题/笔记 | 待补 |
| [RAG 基础：Chunk、Embedding、Vector Search 到底怎么串起来？](../_posts/2026-09-15-rag-basics.md) | RAG系列 | 概览/导读 | 待补 |
| [总纲：Agent 的上下文为什么比 Prompt 更重要](../_posts/2026-09-15-rag-context-overview.md) | RAG系列 | 概览/导读 | 待补 |
| [ReproLab：Planner / Executor / Critic 的工程边界怎么划？](../_posts/2026-09-15-reprolab-agent-boundaries.md) | 案例系列 | 案例 | 待补 |
| [ReproLab：可信科研 Agent 的数据血缘为什么是核心？](../_posts/2026-09-15-reprolab-provenance.md) | 案例系列 | 案例 | 待补 |
| [Retry、Rollback 与 Replan：Agent 失败以后怎么继续？](../_posts/2026-09-15-retry-rollback-replan.md) | 工作流系列 | 专题/笔记 | 待补 |
| [Script Validation：JSON、Workflow 与 Bash 到底应该校验什么？](../_posts/2026-09-15-script-validation.md) | 编程系列 | 专题/笔记 | 待补 |
| [七维评测：为什么 Agent 不能只看任务完成率？](../_posts/2026-09-15-seven-dimension-agent-evaluation.md) | 评估系列 | 专题/笔记 | 待补 |
| [Smart Home：传感器抖动、异常值与数据筛选怎么处理？](../_posts/2026-09-15-smart-home-sensor-data.md) | 案例系列 | 案例 | 待补 |
| [工程实践：为什么结构化 Plan + Executor 更适合可评测 Agent？](../_posts/2026-09-15-structured-plan-executor.md) | 案例系列 | 专题/笔记 | 待补 |
| [Supervisor 与 Manager Agent：任务到底应该怎么分发？](../_posts/2026-09-15-supervisor-manager-agent.md) | 工作流系列 | 专题/笔记 | 待补 |
| [Tool Schema 与 Tool Router：工具多了以后怎么办？](../_posts/2026-09-15-tool-schema-router.md) | 基础系列 | 专题/笔记 | 待补 |
| [Workspace Context：任务产物如何跨 Agent 传递？](../_posts/2026-09-15-workspace-context.md) | 编程系列 | 专题/笔记 | 待补 |
| [增量规格与全量知识：让 Agent 的下一次任务从正确事实开始](../_posts/2026-11-01-agent-spec-change-lifecycle.md) | 编程系列 | 深读/实验 | 待补 |
| [研发 Agent Harness：规范、上下文与验证闭环](../_posts/2026-11-01-reliable-development-agent-harness.md) | 编程系列 | 深读/实验 | 待补 |
| [Agent 任务恢复后，怎么避免把同一个动作做两遍？](../_posts/2026-11-05-agent-checkpoint-idempotency.md) | 工作流系列 | 深读/实验 | 待补 |
| [Agent Harness 学习心得：失败重放能验证什么？](../_posts/2026-11-05-agent-replay-reading-notes.md) | 独立文章 | 专题/笔记 | 待补 |
| [MCP 工具接进来之后，谁决定数据能不能发出去？](../_posts/2026-11-05-mcp-tool-trust-boundary.md) | 基础系列 | 深读/实验 | 待补 |
| [vLLM 学习笔记：长 Prompt 进来时，GPU 怎么分时间和显存？](../_posts/2026-11-05-vllm-serving-notes.md) | 独立文章 | 专题/笔记 | 待补 |
| [雨夜便利店 SoraMart：从三维场景到可玩的交互原型](../_posts/2026-11-12-soramart-creative-coding.md) | 独立文章 | 案例 | 待补 |
| [从零写一个文档 Agent：工具、状态和验收](../_posts/2026-11-18-build-a-document-agent.md) | 基础系列 | 案例 | 待补 |
| [明明检索到了，Agent 为什么没把那段话用上？](../_posts/2026-11-18-document-agent-context.md) | RAG系列 | 深读/实验 | 待补 |
| [写入成功，为什么 Agent 还显示未完成？](../_posts/2026-11-18-document-agent-durable-write.md) | 工作流系列 | 深读/实验 | 待补 |
| [Agent 改完真的更好吗？拿一次漏检索做回归](../_posts/2026-11-18-document-agent-regression.md) | 评估系列 | 深读/实验 | 待补 |
| [总完成率没变，为什么还要回滚 Agent？](../_posts/2026-11-18-document-agent-release.md) | 评估系列 | 深读/实验 | 待补 |
| [Multi-Agent 开发系统实战，把需求、实现、审查和测试串起来](../_posts/2026-11-19-agent-case-development.md) | 项目案例 | 案例 | 待补 |
| [企业级 Agent 平台实战，任务跨队列后如何保住权限](../_posts/2026-11-19-agent-case-platform.md) | 项目案例 | 案例 | 待补 |
| [Research Agent 实战，让报告的结论能追到原始证据](../_posts/2026-11-19-agent-case-research.md) | 项目案例 | 案例 | 待补 |
| [智能客服 Agent 实战，从查单到带依据的答复](../_posts/2026-11-19-agent-case-support.md) | 项目案例 | 案例 | 待补 |
| [Context、Memory 和 State 怎样分工？](../_posts/2026-11-19-agent-deep-dive-agent-state.md) | 核心能力 | 专题/笔记 | 待补 |
| [Agent 部署与灰度，从任务队列到版本回滚](../_posts/2026-11-19-agent-deep-dive-deployment.md) | 生产工程 | 专题/笔记 | 待补 |
| [任务写入成功后进程退出，Agent 怎样从回执恢复？](../_posts/2026-11-19-agent-deep-dive-durability.md) | 生产工程 | 深读/实验 | 待补 |
| [Agent 评估实战，把一次线上错误变成发布门禁](../_posts/2026-11-19-agent-deep-dive-evaluation.md) | 评估与安全 | 专题/笔记 | 待补 |
| [LangGraph 从 State 到 Checkpoint，审批以后从哪里继续？](../_posts/2026-11-19-agent-deep-dive-langgraph.md) | 开发框架 | 深读/实验 | 待补 |
| [LLM 与 Prompt，怎样让 Agent 稳定输出可执行决策？](../_posts/2026-11-19-agent-deep-dive-llm-prompt.md) | 核心能力 | 专题/笔记 | 待补 |
| [长时 Agent 怎么把目标、计划和外部回执一起带过重启？](../_posts/2026-11-19-agent-deep-dive-long-running.md) | 前沿趋势 | 专题/笔记 | 待补 |
| [MCP 和 A2A 的边界，从一次跨应用研究任务看清](../_posts/2026-11-19-agent-deep-dive-mcp-a2a.md) | 开发框架 | 专题/笔记 | 待补 |
| [Agent Trace 怎么打，才能找到第一个出错的节点？](../_posts/2026-11-19-agent-deep-dive-observability.md) | 评估与安全 | 专题/笔记 | 待补 |
| [Plan-and-Execute，怎样把计划变成能检查的依赖图？](../_posts/2026-11-19-agent-deep-dive-plan-execute.md) | 架构设计 | 深读/实验 | 待补 |
| [RAG 核心原理，为什么正确的政策没进入模型？](../_posts/2026-11-19-agent-deep-dive-rag.md) | 核心能力 | 深读/实验 | 8 题 |
| [ReAct 怎么落地，工具结果怎样改变下一步？](../_posts/2026-11-19-agent-deep-dive-react.md) | 架构设计 | 专题/笔记 | 待补 |
| [Router 与 Reflection，分别在什么时候介入？](../_posts/2026-11-19-agent-deep-dive-reflection-router.md) | 架构设计 | 专题/笔记 | 待补 |
| [Agent 安全边界，授权和人工审批应该在哪里校验？](../_posts/2026-11-19-agent-deep-dive-security-gates.md) | 评估与安全 | 专题/笔记 | 待补 |
| [Supervisor 与多 Agent，为什么交接必须携带产物？](../_posts/2026-11-19-agent-deep-dive-supervisor.md) | 架构设计 | 专题/笔记 | 待补 |
| [Function Calling 实战，模型提出调用以后发生了什么？](../_posts/2026-11-19-agent-deep-dive-tool-use.md) | 核心能力 | 深读/实验 | 7 题 |
| [Agent 架构怎么选，从固定工作流到多 Agent](../_posts/2026-11-19-agent-engineering-architecture.md) | 架构设计 | 概览/导读 | 待补 |
| [拆开 Agent 的八项能力，从工具调用到环境验证](../_posts/2026-11-19-agent-engineering-capabilities.md) | 核心能力 | 概览/导读 | 待补 |
| [四个 Agent 实战，验证从客服到平台的工程能力](../_posts/2026-11-19-agent-engineering-cases.md) | 项目案例 | 概览/导读 | 待补 |
| [Agent 的运行机制与核心原理](../_posts/2026-11-19-agent-engineering-foundations.md) | 基础理论 | 深读/实验 | 7 题 |
| [Agent 框架怎么选，看它接管了执行链的哪一层](../_posts/2026-11-19-agent-engineering-frameworks.md) | 开发框架 | 概览/导读 | 待补 |
| [从 Deep Research 到长时运行，怎样读懂 Agent 的下一步](../_posts/2026-11-19-agent-engineering-frontier.md) | 前沿趋势 | 概览/导读 | 待补 |
| [Agent 如何变成能部署、恢复和回滚的服务](../_posts/2026-11-19-agent-engineering-production.md) | 生产工程 | 概览/导读 | 待补 |
| [Agent 什么时候能上线？用评测、权限和 Trace 回答](../_posts/2026-11-19-agent-engineering-quality.md) | 评估与安全 | 概览/导读 | 待补 |
| [任务交给多个 Agent 之后，谁负责把事情做完？](../_posts/2026-11-19-agent-orchestration-after-delegation.md) | 独立文章 | 深读/实验 | 待补 |
| [Coding Agent 记住了项目，为什么还是会改错？](../_posts/2026-11-19-coding-agent-project-ontology.md) | 独立文章 | 深读/实验 | 待补 |
| [Chunking：固定窗口、重叠与结构感知](../_posts/2026-11-19-rag-chunking.md) | 核心能力 | 深读/实验 | 待补 |
| [RAG 文档解析：表头、章节和证据坐标](../_posts/2026-11-19-rag-document-parsing.md) | 核心能力 | 深读/实验 | 待补 |
| [Embedding：从词项向量到双塔编码](../_posts/2026-11-19-rag-embedding.md) | 核心能力 | 深读/实验 | 待补 |
