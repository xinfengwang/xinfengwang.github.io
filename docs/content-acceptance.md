# Agent Engineering 交付与验收记录

本记录对应草稿 PR #2 的课程版本。基线为 `009f27a` 中的 99 篇正文。交付范围为八大板块的课程、入口与阅读路径，以及原有文章和跳转的兼容性。

## 课程覆盖

| 板块 | 专题 | 独立正文 | 折叠问答 | 新增 | 深化 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 基础理论与核心原理 | 5 | 5 | 25 | 0 | 0 |
| 核心技术与能力体系 | 9 | 29 | 146 | 8 | 12 |
| 架构设计与设计模式 | 6 | 14 | 70 | 13 | 1 |
| 开发框架与技术生态 | 9 | 14 | 70 | 10 | 4 |
| 工程化与生产实践 | 9 | 9 | 45 | 8 | 1 |
| 评估、安全与可观测性 | 6 | 5 | 25 | 4 | 1 |
| 项目实战与案例拆解 | 4 | 7 | 35 | 6 | 1 |
| 前沿技术与发展趋势 | 9 | 11 | 55 | 10 | 1 |
| **合计** | **57** | **94** | **471** | **59** | **21** |

评估板块复用 RAG 分层评估正文，正文和问答在核心技术板块只计一次。RAG 专栏包含 17 篇正文。

## 验收结果

- Jekyll 3.10 生产模式构建，核对 158 个正文路由、57 个已配置专题与 32 个历史跳转页。
- 94 篇课程分别以 1360 像素桌面视口和 390 像素触控视口验证。打开与关闭问答，检查目录和阅读导航，并验证每篇 Mermaid 图表和含公式文章的渲染。
- 64 篇历史博客也通过桌面与窄屏检查，确认正文、标题和已有图表正常呈现。
- 核对课程首页、八个板块和 RAG 入口上的 20 处图片加载。验证主题切换能在刷新后保持，代码块实际渲染高亮。
- 在浏览器执行 32 个旧地址的默认跳转及 26 个历史片段跳转，核对查询参数保留。
- 逐条检查 104 个课程页面的同站链接、锚点与资源引用。核查 142 个去重外部引用，并将 Deep Research 的受限引用换成可访问的官方 API 文档。

## 文章处置

新增 59 篇、深化 21 篇。全量重写为 0 篇。基线的 99 篇保留原地址，其中 78 篇正文维持基线内容。逐篇基线评级见 [内容审查表](content-audit.md)。

### 基础理论与核心原理

**保留基线正文**

- [Agent 核心架构：模型、上下文、状态、记忆与环境怎么分工](../_posts/2026-11-20-ae-agent-components.md)
- [Agent 运行循环：从一次观察到任务验收](../_posts/2026-11-20-ae-agent-loop.md)
- [Agent 设计范式：用任务特征决定何时路由、规划或循环](../_posts/2026-11-20-ae-choosing-agent-patterns.md)
- [从传统自动化到大语言模型：为什么应用开始用语言来决策](../_posts/2026-11-20-ae-from-automation-to-llm.md)
- [什么是 Agent：从目标、环境和下一步控制权来判断](../_posts/2026-11-20-ae-what-is-an-agent.md)

### 核心技术与能力体系

**新增**

- [上下文组装：让有限窗口覆盖问题所需的证据](../_posts/2026-11-20-ae-context-assembly.md)
- [Agent 与外部环境：从观察、动作到状态核对](../_posts/2026-11-20-ae-environment-interaction.md)
- [记忆生命周期：从提取、更新到压缩、撤回与遗忘](../_posts/2026-11-20-ae-memory-lifecycle.md)
- [多 Agent 协作：角色、消息、共享状态与结果验收](../_posts/2026-11-20-ae-multi-agent-collaboration.md)
- [结构化输出：从 JSON Schema 到可验证的 Agent 输出契约](../_posts/2026-11-20-ae-output-contracts.md)
- [生产 RAG 架构：索引代、权限、延迟和降级](../_posts/2026-11-20-ae-rag-production.md)
- [Agent 推理：从单条解释到可验证的候选搜索](../_posts/2026-11-20-ae-reasoning-and-search.md)
- [工具运行时：从调用 ID、权限判定到并发与回执](../_posts/2026-11-20-ae-tool-runtime.md)

**深化**

- [Chunking：确定什么内容应该一起被检索](../_posts/2026-11-20-ae-chunking.md)
- [文档解析：保留阅读顺序、表格结构与引用坐标](../_posts/2026-11-20-ae-document-ingestion.md)
- [GraphRAG：关系查询和全局主题怎样利用图结构](../_posts/2026-11-20-ae-graph-rag.md)
- [Agent Memory：区分工作记忆、经历、事实和操作技能](../_posts/2026-11-20-ae-memory-model.md)
- [大模型推理：Prefill、Decode、KV Cache 与采样](../_posts/2026-11-20-ae-model-inference.md)
- [多模态 RAG：把表格、图表和页面图像变成可核查证据](../_posts/2026-11-20-ae-multimodal-rag.md)
- [任务规划：拆解依赖、安排顺序并根据证据重规划](../_posts/2026-11-20-ae-planning-and-replanning.md)
- [Prompt Engineering：把任务、示例、证据和约束组织成上下文](../_posts/2026-11-20-ae-prompt-design.md)
- [RAG 评估：分开测召回、证据覆盖与答案支持](../_posts/2026-11-20-ae-rag-evaluation.md)
- [Function Calling：模型怎样提出工具动作，宿主怎样执行](../_posts/2026-11-20-ae-tool-calling.md)
- [Transformer：Token 怎样通过注意力形成上下文表示](../_posts/2026-11-20-ae-transformer.md)
- [向量索引：Exact、HNSW、IVF 和 PQ 怎样交换速度与召回](../_posts/2026-11-20-ae-vector-indexes.md)

**保留基线正文**

- [Agentic RAG：让检索成为有停止条件的决策](../_posts/2026-11-20-ae-agentic-rag.md)
- [Contextual Retrieval：让短片段带着它的文档语境进入索引](../_posts/2026-11-20-ae-contextual-indexing.md)
- [Self-RAG 与 Corrective RAG：检索结果有问题时怎样纠正](../_posts/2026-11-20-ae-corrective-retrieval.md)
- [Embedding：查询和证据为什么能在同一空间比较](../_posts/2026-11-20-ae-embeddings.md)
- [混合检索：让词法匹配和向量召回互补](../_posts/2026-11-20-ae-hybrid-search.md)
- [查询改写：从用户的说法到可以检索的问题](../_posts/2026-11-20-ae-query-transformation.md)
- [RAG 基础：让回答依赖可更新、可核对的证据](../_posts/2026-11-20-ae-rag-foundations.md)
- [Rerank：召回之后，怎样判断哪条证据能回答问题](../_posts/2026-11-20-ae-reranking.md)
- [稀疏检索：从倒排索引到 BM25](../_posts/2026-11-20-ae-sparse-retrieval.md)

### 架构设计与设计模式

**新增**

- [企业级 Agent 架构：用租户、任务和工具契约划定边界](../_posts/2026-11-20-ae-enterprise-agent-architecture.md)
- [Evaluator–Optimizer：用独立评分组织有界改进](../_posts/2026-11-20-ae-evaluator-optimizer.md)
- [Hierarchical：让跨层委派保留责任、权限和预算](../_posts/2026-11-20-ae-hierarchical.md)
- [Human-in-the-Loop：让人工决定可以暂停、回填与验证](../_posts/2026-11-20-ae-human-in-the-loop.md)
- [Map-Reduce：并行提取，再按证据和口径合并](../_posts/2026-11-20-ae-map-reduce.md)
- [多 Agent 拓扑：集中式、分层、对等与共享状态](../_posts/2026-11-20-ae-multi-agent-topologies.md)
- [Plan-and-Execute：让计划成为可验证的执行契约](../_posts/2026-11-20-ae-plan-and-execute.md)
- [ReAct 模式：用真实观察决定下一步行动](../_posts/2026-11-20-ae-react.md)
- [Reflection：让问题可诊断，修改可验证](../_posts/2026-11-20-ae-reflection.md)
- [Router：在确定规则、模型分类与低置信回退之间路由](../_posts/2026-11-20-ae-router.md)
- [单 Agent 架构：用控制权和失败类型选择系统](../_posts/2026-11-20-ae-single-agent-architectures.md)
- [有状态 Workflow：从顺序、分支与合流到等待恢复](../_posts/2026-11-20-ae-stateful-workflows.md)
- [Supervisor：把分派、结果整合与终止交给协调者](../_posts/2026-11-20-ae-supervisor.md)

**深化**

- [Agent 架构基础：把控制流与数据流分别画清楚](../_posts/2026-11-20-ae-control-and-data-flow.md)

### 开发框架与技术生态

**新增**

- [A2A v1.0：从 Agent Card 到跨服务任务与制品](../_posts/2026-11-20-ae-a2a-task-protocol.md)
- [Agent 生态选型：SDK、检索管道和低代码编排分别适合什么](../_posts/2026-11-20-ae-agent-ecosystem.md)
- [AutoGen AgentChat：消息、发言人选择与团队终止](../_posts/2026-11-20-ae-autogen-collaboration.md)
- [CrewAI：用 Agent、Task、Crew 和 Flow 描述协作](../_posts/2026-11-20-ae-crewai-process.md)
- [LangChain v1 Agent：工具循环、中间件与 LangGraph 的边界](../_posts/2026-11-20-ae-langchain-agent-runtime.md)
- [LangChain 组件组合：Runnable、LCEL 与可观测的检索链](../_posts/2026-11-20-ae-langchain-composition.md)
- [LangGraph 并行与子图：superstep、Send、Command 和合流](../_posts/2026-11-20-ae-langgraph-parallel.md)
- [LlamaIndex 数据链路：Document、Node、索引与答案合成](../_posts/2026-11-20-ae-llamaindex-data-flow.md)
- [MCP 2026-07-28：无状态请求、能力协商与旧版兼容](../_posts/2026-11-20-ae-mcp-stateless.md)
- [Semantic Kernel：把业务服务暴露为可信的 Plugin 和 Function](../_posts/2026-11-20-ae-semantic-kernel.md)

**深化**

- [LangGraph 持久化：Checkpoint、Interrupt 与恢复执行](../_posts/2026-11-20-ae-langgraph-recovery.md)
- [LangGraph 图编排：State、Node、Edge 和 Reducer 怎样协作](../_posts/2026-11-20-ae-langgraph-state.md)
- [MCP 能力模型：Tools、Resources、Prompts、Roots 与 Sampling](../_posts/2026-11-20-ae-mcp-capabilities.md)
- [MCP 旧版通信：Host、Client、Server 与 2025-11-25 握手](../_posts/2026-11-20-ae-mcp-lifecycle.md)

### 工程化与生产实践

**新增**

- [Agent 项目分层：把业务规则、编排和外部适配器拆开](../_posts/2026-11-20-ae-agent-project-structure.md)
- [异步与并发：从 asyncio 背压到 Worker 重投](../_posts/2026-11-20-ae-asynchronous-agent-runtime.md)
- [部署与回滚：镜像、工作流状态和数据版本怎样一起演进](../_posts/2026-11-20-ae-deployment-and-rollbacks.md)
- [企业级 Agent 平台：工具治理、租户调度与审计](../_posts/2026-11-20-ae-governed-agent-platform.md)
- [性能与成本：用关键路径、Token 预算和模型路由定位瓶颈](../_posts/2026-11-20-ae-latency-and-cost.md)
- [状态与会话：分清 Session、Thread、Run 和 Checkpoint](../_posts/2026-11-20-ae-session-state.md)
- [Agent 数据持久化：谁持有事实、谁服务查询](../_posts/2026-11-20-ae-storage-for-agents.md)
- [流式 Agent API：让任务、事件和业务回执各有入口](../_posts/2026-11-20-ae-streaming-agent-api.md)

**深化**

- [生产可靠性：从超时到幂等回执，怎样恢复一次外部写入](../_posts/2026-11-20-ae-recoverable-writes.md)

### 评估、安全与可观测性

**新增**

- [Agent 可观测性：用 Trace、指标和日志解释真实运行](../_posts/2026-11-20-ae-agent-observability.md)
- [Agent 安全边界：从外部内容到工具授权与审计](../_posts/2026-11-20-ae-agent-trust-boundaries.md)
- [Agent 评估与观测工具：从数据采集到排查、回归与告警](../_posts/2026-11-20-ae-observability-tools.md)
- [Agent 测试体系：从可控回执到长任务故障演练](../_posts/2026-11-20-ae-testing-agent-systems.md)

**深化**

- [Agent 评估：从任务成功率追到工具选择和行为边界](../_posts/2026-11-20-ae-agent-evaluation.md)

### 项目实战与案例拆解

**新增**

- [数据分析助手实战：从指标口径到只读 SQL 和可复算交付](../_posts/2026-11-20-ae-data-analysis-assistant.md)
- [开发 Agent 团队实战：从任务交接到可验证变更](../_posts/2026-11-20-ae-development-agent-team.md)
- [企业业务工作流实战：从采购草稿到批准、提交和补偿](../_posts/2026-11-20-ae-enterprise-workflows.md)
- [记忆助手实战：一条偏好怎样写入、读取和撤回](../_posts/2026-11-20-ae-memory-assistant.md)
- [研究助手实战：从问题拆解到可核查报告](../_posts/2026-11-20-ae-research-assistant.md)
- [客服 Agent 实战：政策证据、订单状态与人工接管](../_posts/2026-11-20-ae-support-agent.md)

**深化**

- [案例：设计一个可核查的企业政策问答 Agent](../_posts/2026-11-20-ae-kb-question-answering.md)

### 前沿技术与发展趋势

**新增**

- [记忆演进与自我改进：从反馈到可回滚的版本](../_posts/2026-11-20-ae-agent-adaptation.md)
- [Agent 互操作：工具、任务、身份与证据如何跨边界](../_posts/2026-11-20-ae-agent-interoperability.md)
- [Agent Runtime 与 Agent OS：从执行循环到资源及状态管理](../_posts/2026-11-20-ae-agent-runtime-evolution.md)
- [Agentic Workflow：从固定步骤到受控自治](../_posts/2026-11-20-ae-agentic-workflow.md)
- [自主 Agent：目标、反馈与终止的工程边界](../_posts/2026-11-20-ae-autonomous-agents.md)
- [Browser Agent 与 Computer Use：从观察界面到核查结果](../_posts/2026-11-20-ae-browser-and-computer-use.md)
- [Coding Agent：从仓库理解到候选补丁与独立验证](../_posts/2026-11-20-ae-coding-agent.md)
- [Deep Research：规划、证据覆盖与可追溯综合](../_posts/2026-11-20-ae-deep-research.md)
- [具身智能与 Physical AI：感知、决策和控制怎样闭环](../_posts/2026-11-20-ae-physical-agents.md)
- [多模态实时 Agent：语音打断、事件对齐与延迟预算](../_posts/2026-11-20-ae-realtime-multimodal.md)

**深化**

- [长时运行 Agent：任务怎样跨会话继续推进](../_posts/2026-11-20-ae-long-running-agents.md)

## 待补范围

57 个已配置专题均已链接可阅读的正文。64 篇历史博客沿用原结构，目前未迁移至课程的折叠问答组件，逐篇清单见 [内容审查表](content-audit.md)。草稿合并后的线上版本与正式域名仍有待发布验证。
