---
layout: default
title: AI Agent ����ѧϰ��ͼ
description: �ӹ��ߵ��á�RAG �� Agent ���ţ������⡢Coding Agent ����Ŀ���̡���ѧϰĿ��ѡ��·�ߣ�ֱ���Ķ�ϵ���ܸ����½ڡ�
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
    <p class="eyebrow">LEARNING MAP / AI AGENT ENGINEERING</p>
    <h1>AI Agent ����ѧϰ��ͼ</h1>
    <p class="roadmap-intro">�ӵ�һ�ι��ߵ��ã�����׷�١���֤�ͻָ��� Agent ϵͳ����ѧ���Դӻ���������������ĿҲ���԰���ǰ����ֱ���Ӧ�½ڡ�</p>
    <p class="roadmap-hint">���ﻹû���������ȶ�<a class="text-link" href="{{ '/agent-engineering/' | relative_url }}">һҳ Agent ���̸���</a>���ٰ�·�����롣</p>
    <div class="roadmap-actions">
      <a class="button primary" href="#reading-paths">ѡ��ѧϰ·�� ��</a>
      <a class="button" href="#series-map">�鿴ȫ��ϵ�� ��</a>
    </div>
    <p class="roadmap-stats">{{ series.size }} ��ϵ�� <span aria-hidden="true">��</span> {{ total_featured }} ƪ��������</p>
  </header>

  <section id="reading-paths" class="roadmap-section" aria-labelledby="paths-title">
    <p class="eyebrow">01 / START HERE</p>
    <h2 id="paths-title">��Ŀ��ѡһ��·��</h2>
    <p class="roadmap-hint">ÿһ��ֱ�����¡���һ������ѡһ�����ϵ�ǰĿ���·�ߣ��ӵ�һƪ��ʼ��</p>
    <div class="roadmap-paths">
      <article>
        <h3>������һ�� Agent</h3>
        <p>�ʺϻ����ģ�� API��������һ���ܲ����Ϻ͵��ù��ߵ�С��Ŀ�Ķ��ߡ�</p>
        <ol>
          <li><a href="{{ '/2026/09/15/agent-foundations-overview/' | relative_url }}">���⹤�ߵ�����Ȩ��</a></li>
          <li><a href="{{ '/2026/09/15/rag-context-overview/' | relative_url }}">���������������</a></li>
          <li><a href="{{ '/2026/09/12/why-agent-workflow-needs-state-machine/' | relative_url }}">�Ѳ�����֯�ɹ�����</a></li>
        </ol>
      </article>
      <article>
        <h3>������ Demo ���ɿ�</h3>
        <p>�ʺ��Ѿ���ͨԭ�ͣ����ڴ���ʧ�ָܻ�������λ�ͻع�����Ķ��ߡ�</p>
        <ol>
          <li><a href="{{ '/2026/11/05/agent-checkpoint-idempotency/' | relative_url }}">��¼״̬��ָ�·��</a></li>
          <li><a href="{{ '/2026/09/11/agent-tracing/' | relative_url }}">�� Trace �����ⶨλ����</a></li>
          <li><a href="{{ '/2026/09/09/smart-home-agent-loop/' | relative_url }}">������Ŀԭ�ͼ�����</a></li>
        </ol>
      </article>
      <article>
        <h3>���� Coding Agent</h3>
        <p>�ʺϹ�ע����������ġ�����Ȩ�޺��Զ���֤������ͨһ�δ��뽻���Ķ��ߡ�</p>
        <ol>
          <li><a href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">�����񡢴����޸�����֤</a></li>
          <li><a href="{{ '/2026/09/15/agent-benchmark/' | relative_url }}">�������ظ����е�����</a></li>
          <li><a href="{{ '/2026/09/15/reprolab-agent-boundaries/' | relative_url }}">�� ReproLab ��λ��ֹ滮��ִ�к���֤</a></li>
        </ol>
      </article>
    </div>
  </section>

  <section id="series-map" class="roadmap-section" aria-labelledby="series-title">
    <p class="eyebrow">02 / SERIES INDEX</p>
    <h2 id="series-title">�ӻ�������Ŀʵս</h2>
    <p class="roadmap-hint">ÿ��ϵ��ֻ�Ƽ���ƪ�������¡����ʵ��ϸ�ں������Ķ����ڸ��Ե�ϵ��ҳ��</p>
    <nav class="roadmap-jump" aria-label="ϵ�е���">
      {% for item in series %}
        <a href="#{{ item.id }}">{{ item.accent }} {{ item.short_title | escape }}</a>
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
          <p class="roadmap-meta">{{ item.category | escape }} <span aria-hidden="true">��</span> {{ featured.size }} ƪ����</p>
          <h3>{{ item.title | escape }}</h3>
          <p>{{ item.description | escape }}</p>
          <p class="roadmap-check"><strong>�������Żش�</strong> {{ item.roadmap_check | escape }}</p>
          <div class="roadmap-actions">
            {% if overview %}<a class="text-link" href="{{ overview.url | relative_url }}">�Ķ��ܸ� ��</a>{% endif %}
            <a href="{{ series_url | relative_url }}">ϵ��ҳ�벹��ʼ� ��</a>
          </div>
          <details>
            <summary>�鿴��������</summary>
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

  <aside class="roadmap-note" aria-label="�����������Ķ�">
    <strong>�������� �� ��ά�����봴����</strong>
    <p>SoraMart �������������Ʒ������Ϊ����������Ʒ���鰸�������Ķ���</p>
    <a class="text-link" href="{{ '/2026/11/12/soramart-creative-coding/' | relative_url }}">�Ķ���ҹ��������Ŀ��� ��</a>
  </aside>

  <aside class="roadmap-note" aria-label="ģ���������������Ķ�">
    <strong>�����Ķ� �� ģ����������</strong>
    <p>��� Agent ����ģ�͵��ã��ȴ� KV Cache��������Ⱥ��� token �ӳ����֡�</p>
    <a class="text-link" href="{{ '/2026/11/05/vllm-serving-notes/' | relative_url }}">vLLM ѧϰ�ʼ� ��</a>
  </aside>

  <aside class="roadmap-note" aria-label="�ᴩȫͼ�Ĺ���ԭ��">
    <strong>�ᴩȫͼ�Ĺ���ԭ��</strong>
    <p>ģ�͸������⡢���ɺ�������ߡ�����ϵͳ�����¼״̬������Ȩ�ޡ�ִ�в�������֤����ʹ���ʧ�ܡ�</p>
    <a class="text-link" href="{{ '/search/' | relative_url }}">�������� ��</a>
  </aside>
</div>
