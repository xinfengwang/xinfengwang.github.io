---
layout: default
title: 关于我
permalink: /about/
---
<div class="narrow-page">
  <p class="eyebrow">ABOUT</p>
  <h1>王新峰 · Wang Xinfeng</h1>
  <p class="lead">我是王新峰，深圳大学电子信息工程硕士在读。关注 AI Agent 工程，尤其是检索与上下文、任务编排、工具执行和结果验证。</p>

  <div class="quote-block">我更关注 Agent 的工程可靠性：任务如何被拆解、上下文如何被管理、工具如何被约束、失败如何被识别，以及系统如何通过评测和 Badcase 持续进化。</div>

  <h2 id="capabilities">能力与作品：可以从哪里了解我</h2>
  <p>我的职业方向是 AI Agent / 大模型应用研发。比起罗列框架名称，我希望通过下面的设计问题，展示自己对系统边界、失败处理和验证方式的思考。</p>
  <div class="capability-list">
    <article><h3>检索与上下文</h3><p>关注资料如何转成可检索的记录，以及召回、排序、组装分别如何影响结果。</p><p><a href="{{ '/2026/09/15/gui-agent-function-tree/' | relative_url }}">GUI 知识构建案例 →</a> · <a href="{{ '/2026/09/15/rag-badcase-debugging/' | relative_url }}">RAG 排查方法 →</a></p></article>
    <article><h3>编排与执行边界</h3><p>关注状态流转、工具约束、执行前检查和失败恢复，区分模型建议与系统实际动作。</p><p><a href="{{ '/2026/09/09/smart-home-agent-loop/' | relative_url }}">智能家居工作流 →</a> · <a href="{{ '/2026/11/05/agent-checkpoint-idempotency/' | relative_url }}">检查点与幂等设计 →</a></p></article>
    <article><h3>结果验证与可追溯性</h3><p>关注结论能否追溯到输入和执行记录，以及一次失败如何成为后续回归依据。</p><p><a href="{{ '/2026/09/15/reprolab-provenance/' | relative_url }}">ReproLab 溯源设计 →</a> · <a href="{{ '/2026/09/11/agent-tracing/' | relative_url }}">Trace 分层定位 →</a></p></article>
    <article><h3>研发 Agent 工程</h3><p>关注规格、上下文、阶段产物与校验如何衔接。通用方法复盘与实习职责分别呈现。</p><p><a href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">Harness 方法复盘 →</a> · <a href="{{ '/experience/' | relative_url }}">实习职责与经历 →</a></p></article>
  </div>
  <p class="muted">项目页标明公开资料与当前边界；方法文章用于说明设计思路，具体实现范围以仓库资料为准。</p>

  <h2>这个博客记录什么</h2>
  <p>项目页展示具体作品与可公开的资料；文章分为项目拆解、工程方法和学习笔记。想先了解我的实践，可以从 ReproLab 和智能家居项目开始；想系统阅读，可以按学习路线选择主题。</p>
  <p><a class="text-link" href="{{ '/projects/' | relative_url }}">浏览项目与作品 →</a> · <a class="text-link" href="{{ '/learning-map/' | relative_url }}">选择学习路线 →</a> · <a class="text-link" href="{{ '/experience/' | relative_url }}">完整实习经历 →</a></p>
  <h2>实习与工程经历</h2>
  <div class="timeline">
    <div class="timeline-item"><div class="timeline-date">2026.07 — Now</div><div><h3>Huawei · AI Application Development Intern</h3><p>参与 Agent Harness 的工作流编排、状态管理、上下文工程与评测体系建设。关注状态机、Manager Agent、工具约束、验证闭环与 Benchmark 驱动迭代。</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2026.05 — 2026.07</div><div><h3>Autel Robotics · AI Agent Platform Intern</h3><p>围绕 Planner + Executor、结构化执行计划、Agent Trace、确定性评测，以及面向规划的混合检索 RAG 开展工程实践。</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2026.02 — 2026.05</div><div><h3>vivo · GUI Agent Development Intern</h3><p>围绕手机 GUI Agent 的功能树构建、混合检索、路径召回、Agent Planning、Function Calling 与 Badcase 分层优化开展工作。</p></div></div>
  </div>

  <p><a class="button" href="{{ '/experience/' | relative_url }}">个人经历 · 查看完整实习经历与记录 →</a></p>

  <h2>教育背景</h2>
  <div class="timeline">
    <div class="timeline-item"><div class="timeline-date">2024 — 2027</div><div><h3>深圳大学</h3><p>电子信息工程 · 硕士 · 专业前 10%</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2020 — 2024</div><div><h3>河南科技大学</h3><p>机械电子工程（新工科）· 本科 · 专业前 7%</p></div></div>
  </div>

  <h2>常用技术</h2>
  <div class="skill-grid">
    <div><strong>Agent / LLM</strong><span>Planning · Multi-Agent · Harness · RAG · Function Calling · MCP · LangGraph · Context Engineering · Tracing / Eval</span></div>
    <div><strong>Engineering</strong><span>Python · FastAPI · REST API · React / Node.js · WebSocket · SQLite / PostgreSQL · Docker · Git / Linux</span></div>
  </div>

  <h2>公开项目与写作</h2>
  <p>公开项目集中在 <a href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">GitHub ↗</a>。实习相关内容只讨论公开、通用的工程方法，不包含内部代码、数据或敏感实现。</p>
  <section class="contact-panel" id="contact">
    <h2>岗位交流与技术讨论</h2>
    <p>如果你正在寻找 AI Agent / 大模型应用研发方向的候选人，可以结合项目、技术文章与实习经历了解我。交流时附上岗位方向或具体技术问题，会更容易展开讨论。</p>
    <p><a class="button primary" href="{{ site.profile.github }}" target="_blank" rel="noreferrer">前往我的 GitHub ↗</a> <a class="button" href="{{ '/experience/' | relative_url }}">查看工程经历 →</a></p>
    <p class="muted">目前公开入口为 GitHub 个人主页；项目相关问题可在对应仓库的讨论入口交流。</p>
  </section>
</div>
