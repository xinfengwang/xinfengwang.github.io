---
layout: default
title: AI Agent 开发学习路线
description: 从需求与第一个工具调用开始，逐步完成检索、状态管理、结果验证、回归评测和上线准备。每一步都有文章和练习。
permalink: /learning-map/
---
{% assign series = site.data.series %}
{% assign total_featured = 0 %}
{% for item in series %}
  {% assign published = item.chapters | where: 'status', 'published' %}
  {% assign featured = published | where: 'featured', true %}
  {% assign total_featured = total_featured | plus: featured.size %}
{% endfor %}

<div class="wide-page roadmap">
  <header class="roadmap-hero">
    <h1>AI Agent 开发学习路线</h1>
    <p class="roadmap-intro">每学一段就给同一个小项目加一项能力。先让它查文档，再让它保存进度，最后用一批固定任务检查改动有没有带来新的错误。</p>
    <div class="roadmap-actions">
      <a class="button primary" href="#full-path">按开发顺序学 ↓</a>
      <a class="button" href="#series-map">查看全部系列 ↓</a>
    </div>
    <section class="reading-return" data-reading-return hidden aria-label="继续阅读"></section>
    <p class="roadmap-stats">{{ series.size }} 个系列 <span aria-hidden="true">·</span> {{ total_featured }} 篇主线文章</p>
  </header>

  <section id="full-path" class="roadmap-section" aria-labelledby="full-path-title">
    <h2 id="full-path-title">从第一个工具到上线检查</h2>
    <p class="roadmap-hint">先跟着<a class="text-link" href="{{ '/agent-engineering/#practice' | relative_url }}">文档 Agent 实战三篇</a>跑一遍。用 Node.js 24 可以观察工具调用、重现一次丢回执、比较两版检索。再用下面的清单对照自己的项目。</p>
    <ol class="roadmap-build">
      <li><a href="{{ '/agent-engineering/#scope' | relative_url }}">需求与验收</a><span>写一页任务说明，列出要交付什么、哪些信息缺失时要追问，以及三条验收用例。</span></li>
      <li><a href="{{ '/2026/11/18/build-a-document-agent/' | relative_url }}">模型和工具</a><span>接通一个只读工具，检查模型提出的调用与回填的工具结果是否用了同一个编号。</span></li>
      <li><a href="{{ '/series/rag-context/' | relative_url }}">检索与上下文</a><span>给文档片段保留版本和出处，拿几条实际问法检查正确段落能否进到模型输入。</span></li>
      <li><a href="{{ '/2026/11/18/document-agent-durable-write/' | relative_url }}">工作流和恢复</a><span>在目标提交后让进程退出。恢复时分别检查任务状态、操作回执和外部版本。</span></li>
      <li><a href="{{ '/2026/11/18/document-agent-regression/' | relative_url }}">验收和回归</a><span>针对同一批用例跑基线和候选版，列出哪些改好了、哪些退步了，再决定能否发布。</span></li>
      <li><a href="{{ '/agent-engineering/#release' | relative_url }}">上线和维护</a><span>给一组用户试用，记录版本、成功率、耗时和失败原因，演练一次如何暂停或切回旧配置。</span></li>
    </ol>
  </section>

  <section id="reading-paths" class="roadmap-section" aria-labelledby="paths-title">
    <h2 id="paths-title">已经在做项目？从手上的问题开始</h2>
    <div class="roadmap-paths">
      <article>
        <h3>知识库里有答案，Agent 却答错</h3>
        <p>把一次回答拆开，看看资料在哪一步丢了，或者有没有被用错。</p>
        <ol>
          <li><a href="{{ '/2026/09/15/rag-badcase-debugging/' | relative_url }}">从召回和排序开始查</a></li>
          <li><a href="{{ '/2026/09/15/permission-aware-rag/' | relative_url }}">确认结果是否落在用户权限内</a></li>
          <li><a href="{{ '/agent-engineering/#verification' | relative_url }}">检查引用和答案是否对应</a></li>
        </ol>
      </article>
      <article>
        <h3>任务一中断，就得全部重跑</h3>
        <p>用一次写入超时检查状态、回执和恢复路径。</p>
        <ol>
          <li><a href="{{ '/2026/11/05/agent-checkpoint-idempotency/' | relative_url }}">记录状态与恢复路径</a></li>
          <li><a href="{{ '/2026/09/11/agent-tracing/' | relative_url }}">用 Trace 和评测定位问题</a></li>
          <li><a href="{{ '/2026/09/09/smart-home-agent-loop/' | relative_url }}">对照项目原型检查设计</a></li>
        </ol>
      </article>
      <article>
        <h3>构建 Coding Agent</h3>
        <p>适合关注代码库上下文、工具权限和自动验证，想跑通一次代码交付的读者。</p>
        <ol>
          <li><a href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">串起规格、代码修改与验证</a></li>
          <li><a href="{{ '/2026/09/15/agent-benchmark/' | relative_url }}">建立可重复运行的评测</a></li>
          <li><a href="{{ '/2026/09/15/reprolab-agent-boundaries/' | relative_url }}">看 ReproLab 如何划分规划、执行和验证</a></li>
        </ol>
      </article>
    </div>
  </section>

  <section id="series-map" class="roadmap-section" aria-labelledby="series-title">
    <h2 id="series-title">按主题深入</h2>
    <p class="roadmap-hint">每个系列只推荐几篇主线文章。术语、实现细节和延伸阅读放在各自的系列页。</p>
    <nav class="roadmap-jump" aria-label="系列导航">
      {% for item in series %}
        <a href="#{{ item.id }}">{{ item.short_title | escape }}</a>
      {% endfor %}
    </nav>

    {% for item in series %}
      {% assign published = item.chapters | where: 'status', 'published' %}
      {% assign featured = published | where: 'featured', true %}
      {% assign overview = published | where: 'no', '00' | first %}
      {% assign series_url = '/series/' | append: item.id | append: '/' %}
      <article class="roadmap-series" id="{{ item.id }}">
        <span class="roadmap-number" aria-hidden="true">{{ item.accent }}</span>
        <div>
          <p class="roadmap-meta">{{ item.category | escape }} <span aria-hidden="true">·</span> {{ featured.size }} 篇主线</p>
          <h3>{{ item.title | escape }}</h3>
          <p>{{ item.description | escape }}</p>
          <p class="roadmap-check"><strong>读完试着回答</strong> {{ item.roadmap_check | escape }}</p>
          <div class="roadmap-actions">
            {% if overview %}<a class="text-link" href="{{ overview.url | relative_url }}">阅读总纲 →</a>{% endif %}
            <a href="{{ series_url | relative_url }}">系列页与补充笔记 →</a>
          </div>
          <details>
            <summary>查看主线文章</summary>
            <ul class="roadmap-chapters">
              {% for chapter in featured %}
                <li><a href="{{ chapter.url | relative_url }}"><span aria-hidden="true">{{ chapter.no }}</span>{{ chapter.title | escape }}</a></li>
              {% endfor %}
            </ul>
          </details>
        </div>
      </article>
    {% endfor %}
  </section>

  <aside class="roadmap-note" aria-label="创意编程延伸阅读">
    <strong>独立方向 · 三维交互与创意编程</strong>
    <p>SoraMart 是浏览器交互作品，可作为场景设计与产品体验案例单独阅读。</p>
    <a class="text-link" href="{{ '/2026/11/12/soramart-creative-coding/' | relative_url }}">阅读雨夜便利店项目拆解 →</a>
  </aside>

  <aside class="roadmap-note" aria-label="模型推理服务延伸阅读">
    <strong>延伸阅读 · 模型推理服务</strong>
    <p>如果 Agent 慢在模型调用，先从 KV Cache、请求调度和首 token 延迟入手。</p>
    <a class="text-link" href="{{ '/2026/11/05/vllm-serving-notes/' | relative_url }}">vLLM 学习笔记 →</a>
  </aside>

</div>
