# Agent Engineering 内容路线

目标读者从第一次认识 Agent 开始，逐步学会解释模型如何生成、运行时如何执行动作、系统如何恢复，以及如何验收真实项目。保留 [课程首页](https://xinfengwang.github.io/agent-engineering/)、八大板块与既有路由。每个知识点都有主讲位置，其他文章引用它并聚焦自己的问题。

[内容审查](content-audit.md) 固定在 35 篇课程正文的基线。课程实际可阅读内容由 [专题配置](../_data/agent_engineering.yml) 和发布的文章正文计算。以下专题以课程中的教学顺序组织，跨板块的前置关系单独列出。

## 八大板块

| 板块 | 基线正文 | 专题与独立讲解范围 |
| --- | ---: | --- |
| 基础理论与核心原理 | 5 | 技术演进 → Agent 定义与控制权 → 模型、状态、工具和环境的职责 → 执行循环与停止 → 设计范式选型 |
| 核心技术与能力体系 | 21 | LLM 的分词、嵌入、注意力、RoPE、训练、推理、采样与选型。Prompt 的指令、示例、上下文和结构契约。Tool Use 的 Schema、注册、选择、执行、回填、并发和授权。RAG 的入库、检索、重排、组装、生成与评估。Memory 的表示、生命周期与检索。Planning 的拆解、依赖和动态重规划。Reasoning 的外部可验证推理、动作和搜索。Multi-Agent 的角色、通信和协作。Environment 的观察、动作、外部接口与副作用 |
| 架构设计与设计模式 | 1 | 控制流、数据流和状态所有权 → 单 Agent 架构 → 顺序、分支、并行、循环与人工节点 → ReAct、Plan-and-Execute、Reflection、Router、Map-Reduce、Evaluator-Optimizer、Supervisor、Hierarchical、Human-in-the-Loop → 多 Agent 拓扑 → 多租户企业架构 |
| 开发框架与技术生态 | 4 | LangChain 组合与执行 → LangGraph 图、状态、并行、持久化和恢复 → LlamaIndex 数据链路 → AutoGen、CrewAI 与 Semantic Kernel → MCP 生命周期、能力、传输与权限 → A2A 发现、任务、消息、制品 → Agents SDK、ADK、Pydantic AI、Haystack、Dify 与 n8n 的适用面 |
| 工程化与生产实践 | 1 | 项目分层 → 会话、线程及 Checkpoint → PostgreSQL、Redis、向量与对象存储 → 异步、队列、Worker、流式 → 超时、退避、熔断、降级、幂等与补偿 → FastAPI、SSE、WebSocket、认证和限流 → 部署、环境隔离与回滚 → 延迟和成本 → 统一平台治理 |
| 评估、安全与可观测性 | 1 | Agent 任务评估 → RAG 分层评估（与核心技术共用正文）→ 单元、集成、端到端、对抗及长任务回归 → 注入、数据泄露、工具授权、沙箱、审批和审计的防御 → 日志、Trace、指标与 OpenTelemetry → 评测和观测工具对比 |
| 项目实战与案例拆解 | 1 | 对话、工具、RAG 与 Memory Agent → 研究、浏览、SQL、文档和数据分析 → 多 Agent 协作 → 企业知识库、客服和流程自动化。每篇交付需求、架构、执行追踪、验收与设计权衡 |
| 前沿技术与发展趋势 | 1 | Agentic Workflow → Deep Research 和 Coding Agent → 浏览和桌面操作 → 长时和自治任务 → 多模态、语音和实时 → 记忆演进 → MCP/A2A 互操作 → Physical AI 与具身 → Runtime 与操作系统研究。逐篇标注成熟度与证据 |

## 阅读依赖

| 前置知识 | 后续正文 | 主讲边界 |
| --- | --- | --- |
| Agent 定义、核心架构 | Transformer、执行循环、控制流与数据流 | 基础先建立模型、环境、状态和控制权概念 |
| Transformer | 模型推理、Prompt、上下文组装 | 模型篇处理计算与窗口，Prompt 处理运行时消息和上下文选择 |
| Prompt 与结构契约 | Function Calling、工具运行时、MCP | Schema 定义数据，宿主管执行资格，MCP 管连接和能力协议 |
| Tool Use、状态 | Environment、Workflow、人机接管 | 环境定义观察与回执，Workflow 定义迁移和恢复 |
| RAG 基础、分块、Embedding | 向量索引、稀疏召回、融合、重排 | 离线产物和线上召回的故障分开定位 |
| 混合检索、重排 | Context Assembly、RAG Evaluation、生产 RAG | 召回负责找到候选，组装负责可用证据，评估衡量各层 |
| Agent 架构、RAG | 记忆模型、记忆生命周期、记忆助手 | 以资料证据、过往经历和任务状态的寿命和权限辨别来源 |
| Agent 执行循环 | Planning、Reasoning、ReAct、Plan-and-Execute | Planning 管任务依赖和交付，Reasoning 管证据和候选推断，模式篇管组织方式 |
| Multi-Agent 能力、Workflow | 多 Agent 拓扑、LangGraph、A2A | 角色与交接、系统结构、框架机制、跨服务协议各有主篇 |
| 工具运行时、状态持久化 | 安全治理、评估、可观测性 | 授权与验证位于执行边界，评测和 Trace 用于发现并复现问题 |
| 质量与生产实践 | 企业实战、长时任务、互操作 | 用端到端案例和故障验证已有机制的适用范围 |

## 分轮交付

1. **审查基线。** 对已发布的课程与历史正文逐篇记录 A/B/C/D 评级，并核对在线路由、RAG 现状和问答渲染。产出本文件与审查表。
2. **核心技术。** 深化 Transformer、模型推理、Prompt、Function Calling、Memory、Planning、Reasoning、Multi-Agent 和 Environment。已有 RAG 正文按审查结果定点补充。优先解释一个可追踪的数据例和失败路径。
3. **架构与模式。** 先做状态所有权和 Workflow，再围绕独立设计问题逐篇完成模式，最后做多 Agent 拓扑和企业架构。
4. **框架与协议。** 先核对官方版本，再扩充 LangChain、LangGraph、MCP、A2A 与其他框架。对协议或 API 的版本敏感行为标注来源。
5. **生产工程。** 先持久状态和故障恢复，再处理并发、流式服务、部署、性能及治理。
6. **评估与安全。** 建立真实任务集、阶段指标、Trace 对照和独立权限判定，验证正常、失败与拒绝路径。
7. **案例与前沿。** 从现有知识库案例出发，补全可核查的端到端案例。前沿文章给出处、成熟度、当前适用条件和待验证问题。
8. **全站验收。** 核对 99 篇基线文章与各轮新增内容的路由、引用、状态和移动端。逐页核对正文、图表、公式、图片、目录、前后导航及问答可操作性。交付保留、重写、新增、待补清单及八大板块进度。

每一轮在真实构建出的页面上验收后再进入下一轮。每篇课程正文至少包含可理解的背景、内部机制、架构或流程、关键权衡、适用场景和可追溯来源。问答用共享组件呈现 5～10 个问题和解释性答案。A 类文章继续发布，B 类补足缺口，D 类在保留路由的前提下重组阅读入口。专题有未完成正文或待补的必要章节时保持建设中。


## 前两轮进展

第一轮已完成。审查 99 篇基线正文，并核对 109 个线上入口，包括首页、八个板块和 RAG 专栏。桌面和手机窄屏均检查了课文图表、公式、导航和可交互问答。

第二轮新增 8 篇课程正文，每篇都有独立技术图和 5～6 道折叠题。

| 新增专题 | 文章 |
| --- | --- |
| Prompt | [结构化输出与输出契约](https://xinfengwang.github.io/agent-engineering/capabilities/output-contracts/) |
| Tool Use | [工具运行时](https://xinfengwang.github.io/agent-engineering/capabilities/tool-runtime/) |
| Memory | [记忆生命周期](https://xinfengwang.github.io/agent-engineering/capabilities/memory-lifecycle/) |
| Reasoning | [Agent 推理与搜索](https://xinfengwang.github.io/agent-engineering/capabilities/reasoning-and-search/) |
| Multi-Agent | [多 Agent 协作](https://xinfengwang.github.io/agent-engineering/capabilities/multi-agent-collaboration/) |
| Environment | [Agent 与外部环境](https://xinfengwang.github.io/agent-engineering/capabilities/environment-interaction/) |
| RAG | [上下文组装](https://xinfengwang.github.io/agent-engineering/rag/context-assembly/) · [生产 RAG 架构](https://xinfengwang.github.io/agent-engineering/rag/rag-production/) |

已深化 Transformer、模型推理、Prompt、Function Calling、Memory 表示、任务规划，以及 RAG 的文档解析、分块、向量索引、GraphRAG、多模态和评估，共 12 篇。全部 35 篇基线课程和历史文章保留原路由，其余 23 篇课程正文保持原稿。本批没有整篇重写。课程共 43 篇、216 组折叠问答，RAG 17 篇。仍待补充的内容详见分轮交付，历史博客的问答迁移另行逐篇处理。

| 板块 | 独立正文 | 当前专题正文齐备 | 下一批重点 |
| --- | ---: | ---: | --- |
| 基础理论与核心原理 | 5 | 5 / 5 | 继续以原入口引导读者进入架构模式 |
| 核心技术与能力体系 | 29 | 9 / 9 | 用案例与架构文章承接核心机制 |
| 架构设计与设计模式 | 1 | 1 / 6 | 单 Agent、Workflow、独立模式和系统拓扑 |
| 开发框架与技术生态 | 4 | 2 / 9 | LangChain、LangGraph、MCP、A2A 和其余框架 |
| 工程化与生产实践 | 1 | 1 / 9 | 项目、持久状态、并发、服务和演进 |
| 评估、安全与可观测性 | 1 | 2 / 6 | 测试、权限治理、Trace 和观测工具 |
| 项目实战与案例拆解 | 1 | 0 / 4 | 从工具与记忆开始的完整案例 |
| 前沿技术与发展趋势 | 1 | 0 / 9 | 自治任务、研究、Coding 与互操作 |

正文按归属只计一次。RAG 评估也出现在质量板块，因此独立正文与专题齐备数不直接对应。尚缺正文的专题继续显示建设中。

## 第三轮进展

架构设计与设计模式已有 14 篇正文，六个专题均已具备正文。基础篇补充了状态写入所有权、版本冲突和业务回执恢复示例。下列 13 篇为本轮新增。

| 专题 | 新增正文 |
| --- | --- |
| 单 Agent 架构 | [单 Agent 架构](https://xinfengwang.github.io/agent-engineering/architecture/single-agent-architectures/) |
| Workflow | [有状态 Workflow](https://xinfengwang.github.io/agent-engineering/architecture/stateful-workflows/) |
| Agent 设计模式 | [ReAct](https://xinfengwang.github.io/agent-engineering/architecture/react/) · [Plan-and-Execute](https://xinfengwang.github.io/agent-engineering/architecture/plan-and-execute/) · [Reflection](https://xinfengwang.github.io/agent-engineering/architecture/reflection/) · [Router](https://xinfengwang.github.io/agent-engineering/architecture/router/) · [Map-Reduce](https://xinfengwang.github.io/agent-engineering/architecture/map-reduce/) · [Evaluator–Optimizer](https://xinfengwang.github.io/agent-engineering/architecture/evaluator-optimizer/) · [Human-in-the-Loop](https://xinfengwang.github.io/agent-engineering/architecture/human-in-the-loop/) · [Supervisor](https://xinfengwang.github.io/agent-engineering/architecture/supervisor/) · [Hierarchical](https://xinfengwang.github.io/agent-engineering/architecture/hierarchical/) |
| 多 Agent 架构 | [多 Agent 拓扑](https://xinfengwang.github.io/agent-engineering/architecture/multi-agent-topologies/) |
| 企业级架构 | [企业级 Agent 架构](https://xinfengwang.github.io/agent-engineering/architecture/enterprise-agent-architecture/) |

架构板块共 70 组折叠问答。课程共有 56 篇、281 组问答。原有课程路由、专题锚点及历史跳转全部延用。下一轮以状态、并行、持久化、生命周期与协议消息为主线，建设框架与生态专题。

## 第四轮进展

开发框架与技术生态现有 14 篇正文，九个专题均具备正文。新增 10 篇并更新 4 篇已有文章。课程合计 66 篇，331 组折叠问答。

| 专题 | 本轮覆盖 |
| --- | --- |
| LangChain | [Runnable 与 LCEL](https://xinfengwang.github.io/agent-engineering/frameworks/langchain-composition/) · [Agent 循环和中间件](https://xinfengwang.github.io/agent-engineering/frameworks/langchain-agent-runtime/) |
| LangGraph | 补充状态写入、合流与故障恢复，新增 [superstep、Send、Command 与子图](https://xinfengwang.github.io/agent-engineering/frameworks/langgraph-parallel/) |
| MCP | 新增 [2026-07-28 无状态协议与迁移](https://xinfengwang.github.io/agent-engineering/frameworks/mcp-stateless/)，保留 2025-11-25 握手与能力模型并标出版本 |
| A2A | [v1.0 Agent Card、Task、Message 和 Artifact](https://xinfengwang.github.io/agent-engineering/frameworks/a2a-task-protocol/) |
| 其他框架 | [LlamaIndex](https://xinfengwang.github.io/agent-engineering/frameworks/llamaindex-data-flow/) · [AutoGen](https://xinfengwang.github.io/agent-engineering/frameworks/autogen-collaboration/) · [CrewAI](https://xinfengwang.github.io/agent-engineering/frameworks/crewai-process/) · [Semantic Kernel](https://xinfengwang.github.io/agent-engineering/frameworks/semantic-kernel/) · [生态选型](https://xinfengwang.github.io/agent-engineering/frameworks/agent-ecosystem/) |

框架文章按可核查的官方版本说明语义，MCP 与 A2A 使用明确协议修订。下一轮继续工程化与生产实践，优先补齐项目分层、会话与持久化、并发、流式服务和部署。

## 第五轮进展

工程化与生产实践补齐九个专题，新写八篇并深化可靠性篇。课程合计 74 篇、371 组折叠问答。生产板块有九篇、45 组问答。

| 专题 | 正文 |
| --- | --- |
| 项目架构 | [Agent 项目分层](https://xinfengwang.github.io/agent-engineering/production/agent-project-structure/) |
| 会话与持久化 | [状态与会话](https://xinfengwang.github.io/agent-engineering/production/session-state/) · [数据持久化](https://xinfengwang.github.io/agent-engineering/production/storage-for-agents/) |
| 并发与服务 | [异步与并发](https://xinfengwang.github.io/agent-engineering/production/asynchronous-agent-runtime/) · [流式 Agent API](https://xinfengwang.github.io/agent-engineering/production/streaming-agent-api/) |
| 可靠性 | [生产可靠性](https://xinfengwang.github.io/agent-engineering/production/recoverable-writes/)补充重试放大、熔断、降级和恢复演练 |
| 部署、成本与平台 | [部署与回滚](https://xinfengwang.github.io/agent-engineering/production/deployment-and-rollbacks/) · [性能与成本](https://xinfengwang.github.io/agent-engineering/production/latency-and-cost/) · [企业级 Agent 平台](https://xinfengwang.github.io/agent-engineering/production/governed-agent-platform/) |

下一轮是评估、安全与可观测性，重点覆盖测试分层、失败数据、权限边界、Tracing 和观测工具。

## 第六轮进展

评估、安全与可观测性的六个专题均已有正文。新增四篇，并深化 Agent 评估和 RAG 评估。课程共 78 篇、391 组折叠问答。RAG 评估沿用 RAG 专栏中的同一篇正文。

| 专题 | 正文与补充内容 |
| --- | --- |
| Agent Evaluation | [Agent 评估](https://xinfengwang.github.io/agent-engineering/quality/agent-evaluation/)补充指标分母、配对发布对照与关键失败 |
| RAG Evaluation | [RAG 分层评估](https://xinfengwang.github.io/agent-engineering/rag/rag-evaluation/)补充对覆盖、支持和引用准确性的同案例比较 |
| 测试与安全 | [Agent 测试体系](https://xinfengwang.github.io/agent-engineering/quality/testing-agent-systems/) · [Agent 安全边界](https://xinfengwang.github.io/agent-engineering/quality/agent-trust-boundaries/) |
| 可观测性与工具 | [Agent 可观测性](https://xinfengwang.github.io/agent-engineering/quality/agent-observability/) · [评估与监控工具](https://xinfengwang.github.io/agent-engineering/quality/observability-tools/) |

下一轮继续项目实战与前沿专题，以可验证案例和技术成熟度为组织主线。

## 第七轮进展

项目实战与案例拆解的四个专题及前沿技术与发展趋势的九个专题均已有正文。本轮新增 16 篇、深化 2 篇。课程共 94 篇、471 组折叠问答。案例使用虚构或受控场景说明数据、流程与验收，前沿文章用公开来源区分已有实现和待验证能力。

| 板块 | 新增与深化 |
| --- | --- |
| 项目实战 | 补充记忆助手、研究助手、数据分析助手、开发 Agent 团队、客服 Agent 和企业工作流，深化知识库问答的故障诊断 |
| 前沿 | 补充 Agentic Workflow、Deep Research、Coding Agent、Browser 与 Computer Use、自主 Agent、实时多模态、记忆演进、互操作、具身智能及 Agent Runtime，深化长时任务恢复 |

第八轮进行全站验收，覆盖课程入口、历史路由、正文覆盖、状态标注、图表、引用和触控交互。
