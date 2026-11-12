---
layout: default
title: 项目
permalink: /projects/
description: "Wang Xinfeng 的公开项目：AI Agent 工程、科研工作台，以及 SoraMart 三维交互与创意编程实验。"
---
<div class="wide-page projects-page">
  <div class="projects-intro">
    <p class="eyebrow">PROJECTS / 项目索引</p>
    <h1>项目与作品</h1>
    <p class="lead">主要围绕 Agent 工程与知识构建展开，也保留创意编程和早期产品探索。先看每个项目解决什么问题，再按需查看源码、设计文档或项目拆解。</p>
  </div>

  <section class="project-directory" aria-label="公开项目总览">
    {% for project in site.data.projects %}
    <article class="project-directory-row">
      <div><span class="project-kicker">{{ project.group }} · {{ project.status }}</span><h2>{% if project.featured %}<a href="#{{ project.id }}">{{ project.name }} ↓</a>{% else %}<a href="https://github.com/telawang91-dotcom/{{ project.repo }}" target="_blank" rel="noreferrer">{{ project.name }} ↗</a>{% endif %}</h2><p>{{ project.summary }}</p><small>{{ project.note }}</small></div>
      <div class="project-directory-links"><a href="https://github.com/telawang91-dotcom/{{ project.repo }}" target="_blank" rel="noreferrer">仓库 ↗</a>{% if project.article %}<a href="{{ project.article | relative_url }}">项目拆解 →</a>{% endif %}</div>
    </article>
    {% endfor %}
  </section>
  <div class="section-heading"><span>项目详解</span><span class="rule"></span></div>

  <article class="project-showcase" id="reprolab">
    <div class="project-copy">
      <div class="project-kicker">FEATURED · AI RESEARCH AGENT</div>
      <h2>ReproLab</h2>
      <p class="project-slogan">从报告中的结果，找回数据、代码与运行记录。</p>
      <p>本地优先的科研 AI 工作台，连接资料检索、代码执行、分析成果和报告校验。成果记录关联输入数据、代码与运行环境，并提供重跑和差异检查。当前适合本地研究、演示与内部试用。</p>

      <div class="project-metrics"><span>Planner / Executor / Critic</span><span>Hybrid RAG</span><span>Provenance</span><span>Reproduction</span><span>Next.js + FastAPI</span></div>

      <div class="mini-arch"><span>Document / Dataset</span><b>→</b><span>Hybrid RAG</span><b>→</b><span>Agent</span><b>→</b><span>Run</span><b>→</b><span>Artifact</span><b>→</b><span>Claim</span></div>

      <div class="project-facts">
        <div><strong>溯源链路</strong><span>Dataset → Run → Artifact → Claim</span></div>
        <div><strong>资料检索</strong><span>BM25 + pgvector + RRF + reranker</span></div>
        <div><strong>结果检查</strong><span>Re-run · drift detection · validation</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a>
        <a class="button" href="https://github.com/telawang91-dotcom/reprolab/blob/main/README.md" target="_blank" rel="noreferrer">架构与运行文档 ↗</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/workbench-home.png" alt="ReproLab 科研工作台界面" loading="lazy">
      </a>
      <p class="project-caption">ReproLab · research workbench</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/knowledge-space.png" alt="ReproLab 知识空间" loading="lazy">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/getting-started.png" alt="ReproLab 首次使用引导" loading="lazy">
      </div>
    </div>
  </article>

  <article class="project-showcase reverse" id="smart-home">
    <div class="project-copy">
      <div class="project-kicker">MULTI-AGENT · SMART HOME</div>
      <h2>Smart Home Multi-Agent</h2>
      <p class="project-slogan">让环境数据经过预测、决策与校验，再进入设备控制。</p>
      <p>面向居家照护的多 Agent 原型，用 LangGraph 组织感知、预测、决策与验证，提供仿真场景、控制界面和 Home Assistant 接口。真实设备接入需配置实体与凭据；真实 LLM 集成测试仍列在仓库待办中。</p>

      <div class="mini-arch"><span>Perception</span><b>→</b><span>Prediction</span><b>→</b><span>Decision</span><b>→</b><span>Validation</span><b>→</b><span>Execution</span></div>
      <div class="project-metrics"><span>LangGraph</span><span>FastAPI</span><span>WebSocket</span><span>Home Assistant</span><span>仿真与设备接口</span></div>

      <div class="project-facts">
        <div><strong>任务编排</strong><span>Supervisor + Worker Agents</span></div>
        <div><strong>趋势预测</strong><span>Holt-Winters / Holt / Newton Cooling</span></div>
        <div><strong>执行前检查</strong><span>Multi-sensor fusion + validation before action</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a>
        <a class="button" href="https://github.com/telawang91-dotcom/smart-home-multi-agent/blob/main/docs/architecture.svg" target="_blank" rel="noreferrer">系统架构 ↗</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-hero.png" alt="Smart Home Multi-Agent 前端展示" loading="lazy">
      </a>
      <p class="project-caption">Smart Home Multi-Agent · desktop dashboard</p>
      <img class="project-demo" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-demo.gif" alt="Smart Home Multi-Agent Demo" loading="lazy">
    </div>
  </article>

  <article class="project-showcase compact-project" id="elderly-health">
    <div class="project-copy">
      <div class="project-kicker">LOCAL LLM · PRODUCT PROTOTYPE</div>
      <h2>Elderly Health Management</h2>
      <p class="project-slogan">将健康记录、提醒与本地模型问答放在同一个界面。</p>
      <p>基于 Flask、Ollama、本地模型与可视化组件构建的智慧养老健康管理原型，强调本地优先、老年友好交互和健康数据闭环。</p>
      <div class="project-metrics"><span>Flask</span><span>Ollama</span><span>Local LLM</span><span>Health Visualization</span></div>
      <div class="repo-actions"><a class="button" href="https://github.com/telawang91-dotcom/elderly-health-management" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a></div>
    </div>
    <div class="project-note">
      <span>PROJECT NOTE</span>
      <p>这个项目保留了我从“AI 功能”走向“Agent 工程”的早期产品思路：模型能力必须被放进完整的业务状态、数据和交互闭环中。</p>
    </div>
  </article>

  <article class="project-showcase compact-project" id="gui-knowledge">
    <div class="project-copy">
      <div class="project-kicker">GUI AGENT · KNOWLEDGE PIPELINE</div>
      <h2>GUI 操作知识库与指令泛化 Agent</h2>
      <p class="project-slogan">将界面操作路径转化为可检索的语义知识与多样化指令。</p>
      <p>结合手机截图、多模态解析与深度优先探索构建 GUI 交互树，再通过节点扁平化、语义增强、意图归类和六类指令泛化，连接界面理解与自然语言操作知识。</p>
      <div class="project-metrics"><span>ADB</span><span>Multimodal LLM</span><span>GUI Tree</span><span>BM25</span><span>Instruction Augmentation</span></div>
      <div class="repo-actions"><a class="button primary" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a><a class="button" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent/tree/main/docs" target="_blank" rel="noreferrer">设计文档 ↗</a></div>
    </div>
    <div class="project-note"><span>设计文档与交互展示</span><p>仓库提供设计文档和内置处理后数据的交互展示页，可查看应用、操作节点与泛化指令；不包含完整采集源码和原始数据。跨应用指令属于生成数据类型，不代表已验证的自动执行能力。</p></div>
  </article>

  <article class="project-showcase reverse" id="soramart">
    <div class="project-copy">
      <div class="project-kicker">CREATIVE CODING · 3D GAME PROTOTYPE</div>
      <h2>雨夜便利店 · SoraMart</h2>
      <p class="project-slogan">雨落街角，便利店还亮着灯。走进去，挑一份今晚的便当。</p>
      <p>一个浏览器里的微缩三维交互作品：在店外旋转观察雨夜街角，进店后点击行走、查看商品包装、加入购物篮，再到收银台模拟结账。用一段完整的购物体验，把场景氛围与小游戏交互连起来。</p>
      <div class="project-metrics"><span>Three.js</span><span>WebGL</span><span>点击行走</span><span>商品预览</span><span>创意编程</span></div>
      <div class="mini-arch"><span>街角观察</span><b>→</b><span>进店行走</span><b>→</b><span>挑选商品</span><b>→</b><span>模拟结账</span><b>→</b><span>离店</span></div>
      <div class="project-facts">
        <div><strong>场景体验</strong><span>雨夜街景、暖光橱窗、撑伞行人与店内视角切换</span></div>
        <div><strong>交互过程</strong><span>绕开货架行走、旋转商品、调整数量与生成购物小票</span></div>
        <div><strong>运行方式</strong><span>静态网页与本地素材，可通过本地 HTTP 服务运行</span></div>
      </div>
      <div class="repo-actions">
        <a class="button primary" href="https://ame-mart-rain-corner.sunnybrioche.chatgpt.site/" target="_blank" rel="noreferrer">体验在线场景 ↗</a>
        <a class="button" href="https://github.com/telawang91-dotcom/soramart-rainy-night" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a>
        <a class="button" href="{{ '/2026/11/12/soramart-creative-coding/' | relative_url }}">项目拆解 →</a>
      </div>
      <p>作为 Vibe Coding / 创意编程方向的体验案例，展示三维场景与交互闭环；当前定位为小游戏原型。在线访问范围由托管端控制，也可从仓库下载运行。</p>
    </div>
    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/media/SoraMart-showcase.mp4" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/street-corner.jpg" alt="SoraMart 雨夜便利店微缩街角，暖光橱窗与撑伞行人" loading="lazy" width="960" height="540">
      </a>
      <p class="project-caption">SoraMart · 点击全景图观看 72 秒展示视频</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/choose-products.jpg" alt="SoraMart 角色在货架前查看便当包装与价格" loading="lazy" width="960" height="540">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/checkout.jpg" alt="SoraMart 收银台模拟结账与购物小票" loading="lazy" width="960" height="540">
      </div>
    </div>
  </article>

  <section class="project-footer-note">
    <p>研发 Agent Harness 的工程经验整理在 <a class="text-link" href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">规范、上下文与验证闭环</a>，内容为通用技术复盘，不包含企业项目源码。</p>
    <p>更多代码与实验项目见 <a class="text-link" href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">github.com/telawang91-dotcom ↗</a></p>
  </section>
</div>
