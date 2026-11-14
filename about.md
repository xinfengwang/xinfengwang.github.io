---
layout: default
title: 关于我
description: 王新峰，深圳大学电子信息工程硕士在读，求职方向为 AI Agent 与大模型应用研发。介绍实习经验、代表项目、技术能力与教育背景。
permalink: /about/
---
<div class="narrow-page">
  <p class="eyebrow">ABOUT</p>
  <h1>王新峰 · Wang Xinfeng</h1>
  <p class="lead">我是王新峰，深圳大学电子信息工程硕士在读，求职方向为 AI Agent / 大模型应用研发。曾在华为、道通科技和 vivo 参与 Agent 系统研发，实践覆盖知识构建、检索增强、任务规划、工具执行与自动化评测。</p>

  <div class="quote-block">我的工程主线是让 Agent 的执行过程有状态、结果有依据、失败可定位：用结构化计划连接模型与工具，用工作流管理任务推进，用 Trace 和回归任务检验每次改动。</div>

  <h2 id="capabilities">技术能力与代表实践</h2>
  <p>我的实践主要集中在四个方向。每个方向都附有案例或技术复盘，可以继续查看设计细节与公开资料。</p>
  <div class="capability-list">
    <article><h3>检索与上下文</h3><p>在 GUI Agent 与规划任务中实践操作知识结构化、关键词与向量双路召回、RRF 融合和 Few-shot 检索，围绕失败样本定位证据丢失的环节。</p><p><a href="{{ '/2026/09/15/gui-agent-function-tree/' | relative_url }}">GUI 知识构建案例 →</a> · <a href="{{ '/2026/09/15/rag-badcase-debugging/' | relative_url }}">RAG 排查方法 →</a></p></article>
    <article><h3>编排与执行边界</h3><p>参与 Planner + Executor 执行架构与结构化计划设计；在智能家居原型中，用 LangGraph 组织感知、预测、决策和验证，明确各阶段的输入、输出与重规划条件。</p><p><a href="{{ '/2026/09/09/smart-home-agent-loop/' | relative_url }}">智能家居工作流 →</a> · <a href="{{ '/2026/11/05/agent-checkpoint-idempotency/' | relative_url }}">检查点与幂等设计 →</a></p></article>
    <article><h3>结果验证与可追溯性</h3><p>在实习中实践 Agent Trace、AST / 断言比对与 Benchmark 回归；在 ReproLab 中，通过数据、运行记录、产物与结论的关联，支持结果追溯、重跑和漂移比较。</p><p><a href="{{ '/2026/09/15/reprolab-provenance/' | relative_url }}">ReproLab 溯源设计 →</a> · <a href="{{ '/2026/09/11/agent-tracing/' | relative_url }}">Trace 分层定位 →</a></p></article>
    <article><h3>研发 Agent 工程</h3><p>实践产物驱动的研发工作流、Workspace / Codebase 分层上下文与阶段校验，将需求、设计、实现和验证串成可检查、可交接的任务流程。</p><p><a href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">Harness 方法复盘 →</a> · <a href="{{ '/experience/' | relative_url }}">实习职责与经历 →</a></p></article>
  </div>
  <p class="muted">项目页标明公开资料与当前边界；方法文章用于说明设计思路，具体实现范围以仓库资料为准。</p>

  <h2>这个博客记录什么</h2>
  <p>项目页展示具体作品与可公开的资料；文章分为项目拆解、工程方法和学习笔记。想先了解我的实践，可以从 ReproLab 和智能家居项目开始；想系统阅读，可以按学习路线选择主题。</p>
  <p><a class="text-link" href="{{ '/projects/' | relative_url }}">浏览项目与作品 →</a> · <a class="text-link" href="{{ '/learning-map/' | relative_url }}">选择学习路线 →</a> · <a class="text-link" href="{{ '/experience/' | relative_url }}">完整实习经历 →</a></p>
  <h2>实习与工程经历</h2>
  <div class="timeline">
    <div class="timeline-item"><div class="timeline-date">2026.07 — 2026.10</div><div><h3>华为 · AI 应用开发实习生</h3><p>参与 Agent Harness 的工作流编排、状态管理、上下文工程与评测体系建设。关注状态机、Manager Agent、工具约束、验证闭环与 Benchmark 驱动迭代。</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2026.05 — 2026.07</div><div><h3>道通科技 · AI Agent 平台实习生</h3><p>围绕 Planner + Executor、结构化执行计划、Agent Trace、确定性评测，以及面向规划的混合检索 RAG 开展工程实践。</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2026.02 — 2026.05</div><div><h3>vivo · GUI Agent 开发实习生</h3><p>围绕手机 GUI Agent 的功能树构建、混合检索、路径召回、Agent Planning、Function Calling 与 Badcase 分层优化开展工作。</p></div></div>
  </div>

  <p><a class="button" href="{{ '/experience/' | relative_url }}">个人经历 · 查看完整实习经历与记录 →</a></p>

  <h2>教育背景</h2>
  <div class="timeline">
    <div class="timeline-item"><div class="timeline-date">2024 — 2027</div><div><h3>深圳大学</h3><p>电子信息工程 · 硕士 · 2024.09—2027.06 · 专业排名 5/56（前 10%）</p></div></div>
    <div class="timeline-item"><div class="timeline-date">2020 — 2024</div><div><h3>河南科技大学</h3><p>机械电子工程（新工科）· 本科 · 2020.09—2024.06 · 专业排名 8/129（前 7%）</p></div></div>
  </div>

  <h2>竞赛与荣誉</h2>
  <p>数学建模经历训练了我把实际问题转化为模型、实验和验证依据的能力，也影响了我对 Agent 评测与结果可信性的关注。</p>
  <ul class="resume-awards">
    <li>华为杯数学建模大赛国家三等奖、数维杯国际大学生数学建模国际一等奖、MathorCup 大数据国家二等奖。</li>
    <li>“互联网＋”创新创业大赛省一等奖、二等奖。</li>
    <li>全国大学生数学竞赛省三等奖、全国大学生英语竞赛省三等奖、外研社全国大学生英语写作大赛省二等奖。</li>
    <li>省优秀团员、一等奖学金；通过 CET-6。</li>
  </ul>

  <h2>常用技术</h2>
  <div class="skill-grid">
    <div><strong>Agent / LLM</strong><span>Planning · Multi-Agent · Harness · RAG · Function Calling · MCP · LangGraph · Context Engineering · Tracing / Eval</span></div>
    <div><strong>Engineering</strong><span>Python · FastAPI · REST API · React / Node.js · WebSocket · SQLite / PostgreSQL · Docker · Git / Linux</span></div>
  </div>

  <h2>公开项目与写作</h2>
  <p>公开项目集中在 <a href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">GitHub ↗</a>。实习相关内容只讨论公开、通用的工程方法，不包含内部代码、数据或敏感实现。</p>
  <section class="contact-panel" id="contact">
    <h2>岗位交流与技术讨论</h2>
    <p>欢迎交流 AI Agent / 大模型应用研发岗位，以及检索增强、工作流编排、工具执行与评测相关的工程问题。岗位沟通可以附上职责范围与技术方向，技术讨论可以附上场景和具体问题。</p>
    <p><a class="button primary" href="mailto:1822527080@qq.com">邮件联系</a> <a class="button" href="{{ site.profile.github }}" target="_blank" rel="noreferrer">查看 GitHub ↗</a> <a class="button" href="{{ '/experience/' | relative_url }}">查看工程经历 →</a></p>
    <p class="muted">联系邮箱：<a href="mailto:1822527080@qq.com">1822527080@qq.com</a>。项目问题也欢迎在对应仓库交流。</p>
  </section>
</div>
