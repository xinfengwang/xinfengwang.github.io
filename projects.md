---
layout: default
title: ��Ŀ
permalink: /projects/
description: "Wang Xinfeng �Ĺ�����Ŀ��AI Agent ���̡����й���̨���Լ� SoraMart ��ά�����봴����ʵ�顣"
---
<div class="wide-page projects-page">
  <div class="projects-intro">
    <p class="eyebrow">PROJECTS / ��Ŀ����</p>
    <h1>��Ŀ����Ʒ</h1>
    <p class="lead">��Щ��ĿΧ����������չ����Agent ��λ�ÿ���֪ʶ����ΰѼƻ������Լ����ִ�У��Լ������֤�������Ŀҳ�����⡢����ʵ�ֺ͹���������֯��Ҳ������ά���������ڲ�Ʒ̽����</p>
  </div>

  <p class="project-reading-note">�Ķ����飺���˽�����Դ���� ReproLab�����˽�� Agent ���ţ������ܼҾӣ����˽����֪ʶ��ָ������� GUI ֪ʶ�⡣�������������<a class="text-link" href="{{ '/agent-engineering/' | relative_url }}">Agent ���̸��� ��</a></p>

  <section class="project-directory" aria-label="������Ŀ����">
    {% for project in site.data.projects %}
    <article class="project-directory-row">
      <div><span class="project-kicker">{{ project.group }} �� {{ project.status }}</span><h2>{% if project.featured %}<a href="#{{ project.id }}">{{ project.name }} ��</a>{% else %}<a href="https://github.com/telawang91-dotcom/{{ project.repo }}" target="_blank" rel="noreferrer">{{ project.name }} �J</a>{% endif %}</h2><p>{{ project.summary }}</p><small>{{ project.note }}</small></div>
      <div class="project-directory-links"><a href="https://github.com/telawang91-dotcom/{{ project.repo }}" target="_blank" rel="noreferrer">�ֿ� �J</a>{% if project.article %}<a href="{{ project.article | relative_url }}">��Ŀ��� ��</a>{% endif %}</div>
    </article>
    {% endfor %}
  </section>
  <div class="section-heading"><span>��Ŀ���</span><span class="rule"></span></div>

  <article class="project-showcase" id="reprolab">
    <div class="project-copy">
      <div class="project-kicker">���� Agent �� ������ִ������Դ</div>
      <h2>ReproLab</h2>
      <p class="project-slogan">�ӱ����еĽ�����һ����ݡ����������м�¼��</p>
      <p>�������ȵĿ��� AI ����̨���������ϼ���������ִ�С������ɹ��ͱ���У�顣�ɹ���¼�����������ݡ����������л��������ṩ���ܺͲ����顣��ǰ�ʺϱ����о�����ʾ���ڲ����á�</p>

      <div class="project-metrics"><span>Planner / Executor / Critic</span><span>Hybrid RAG</span><span>Provenance</span><span>Reproduction</span><span>Next.js + FastAPI</span></div>

      <div class="mini-arch"><span>Document / Dataset</span><b>��</b><span>Hybrid RAG</span><b>��</b><span>Agent</span><b>��</b><span>Run</span><b>��</b><span>Artifact</span><b>��</b><span>Claim</span></div>

      <div class="project-facts">
        <div><strong>��Դ��·</strong><span>Dataset �� Run �� Artifact �� Claim</span></div>
        <div><strong>���ϼ���</strong><span>BM25 + pgvector + RRF + reranker</span></div>
        <div><strong>������</strong><span>Re-run �� drift detection �� validation</span></div>
      </div>

      <div class="project-design-note"><h3>Ϊʲôͬʱ��¼���롢����ͻ�����</h3><p>ͬһ�δ��������ݻ������仯����ܵõ���ͬ������ֿ��еĹ�ϣʵ�ְ����߹�ͬ����ִ�����ݣ�����ģ���Ⱥ˶Ի�����������ִ�У������������͡��������ݲ�ƥ�����������򲶻�˳��ͬ����Ư�ơ�</p><p><a href="https://github.com/telawang91-dotcom/reprolab/blob/main/backend/app/services/lineage/hashing.py" target="_blank" rel="noreferrer">��ϣʵ�� �J</a> �� <a href="https://github.com/telawang91-dotcom/reprolab/blob/main/backend/app/services/lineage/reproduce.py" target="_blank" rel="noreferrer">����ʵ�� �J</a></p></div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">�鿴 GitHub �ֿ� �J</a>
        <a class="button" href="https://github.com/telawang91-dotcom/reprolab/blob/main/README.md" target="_blank" rel="noreferrer">�ܹ��������ĵ� �J</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/workbench-home.png" alt="ReproLab ���й���̨����" loading="lazy">
      </a>
      <p class="project-caption">ReproLab �� research workbench</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/knowledge-space.png" alt="ReproLab ֪ʶ�ռ�" loading="lazy">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/getting-started.png" alt="ReproLab �״�ʹ������" loading="lazy">
      </div>
    </div>
  </article>

  <article class="project-showcase reverse" id="smart-home">
    <div class="project-copy">
      <div class="project-kicker">�� Agent �� ״̬�������豸����</div>
      <h2>Smart Home Multi-Agent</h2>
      <p class="project-slogan">�û������ݾ���Ԥ�⡢������У�飬�ٽ����豸���ơ�</p>
      <p>����Ӽ��ջ��Ķ� Agent ԭ�ͣ��� LangGraph ��֯��֪��Ԥ�⡢��������֤���ṩ���泡�������ƽ���� Home Assistant �ӿڡ���ʵ�豸����������ʵ����ƾ�ݣ���ʵ LLM ���ɲ��������ڲֿ�����С�</p>

      <div class="mini-arch"><span>Perception</span><b>��</b><span>Prediction</span><b>��</b><span>Decision</span><b>��</b><span>Validation</span><b>��</b><span>Execution</span></div>
      <div class="project-metrics"><span>LangGraph</span><span>FastAPI</span><span>WebSocket</span><span>Home Assistant</span><span>�������豸�ӿ�</span></div>

      <div class="project-facts">
        <div><strong>�������</strong><span>Supervisor + Worker Agents</span></div>
        <div><strong>����Ԥ��</strong><span>Holt-Winters / Holt / Newton Cooling</span></div>
        <div><strong>ִ��ǰ���</strong><span>Multi-sensor fusion + validation before action</span></div>
      </div>

      <div class="project-design-note"><h3>Ϊʲô������״̬��ʽ���棿</h3><p>��֪��Ԥ�⡢���ߺ�У��ֱ�д�ؽṹ��״̬��Supervisor ����У���������Դ��������Ƿ��ع滮��������ʱҪ���������Ѿ������뷽���Ѿ�ͨ�����ﵽ��������Ҳ���ܽ������̣��豸ִ�������鷽���Ƿ���׼��</p><p><a href="https://github.com/telawang91-dotcom/smart-home-multi-agent/blob/main/agent_engine/agents/supervisor.py" target="_blank" rel="noreferrer">״̬��·��ʵ�� �J</a></p></div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">�鿴 GitHub �ֿ� �J</a>
        <a class="button" href="https://github.com/telawang91-dotcom/smart-home-multi-agent/blob/main/docs/architecture.svg" target="_blank" rel="noreferrer">ϵͳ�ܹ� �J</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-hero.png" alt="Smart Home Multi-Agent ǰ��չʾ" loading="lazy">
      </a>
      <p class="project-caption">Smart Home Multi-Agent �� desktop dashboard</p>
      <img class="project-demo" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-demo.gif" alt="Smart Home Multi-Agent Demo" loading="lazy">
    </div>
  </article>

  <article class="project-showcase compact-project" id="elderly-health">
    <div class="project-copy">
      <div class="project-kicker">LOCAL LLM �� PRODUCT PROTOTYPE</div>
      <h2>Elderly Health Management</h2>
      <p class="project-slogan">��������¼�������뱾��ģ���ʴ����ͬһ�����档</p>
      <p>���� Flask��Ollama������ģ������ӻ�����������ǻ����Ͻ�������ԭ�ͣ�ǿ���������ȡ������Ѻý����ͽ������ݱջ���</p>
      <div class="project-metrics"><span>Flask</span><span>Ollama</span><span>Local LLM</span><span>Health Visualization</span></div>
      <div class="repo-actions"><a class="button" href="https://github.com/telawang91-dotcom/elderly-health-management" target="_blank" rel="noreferrer">�鿴 GitHub �ֿ� �J</a></div>
    </div>
    <div class="project-note">
      <span>PROJECT NOTE</span>
      <p>�����Ŀ�������Ҵӡ�AI ���ܡ�����Agent ���̡������ڲ�Ʒ˼·��ģ���������뱻�Ž�������ҵ��״̬�����ݺͽ����ջ��С�</p>
    </div>
  </article>

  <article class="project-showcase compact-project" id="gui-knowledge">
    <div class="project-copy">
      <div class="project-kicker">GUI Agent �� ����֪ʶ��ָ����ǿ</div>
      <h2>GUI ����֪ʶ����ָ��� Agent</h2>
      <p class="project-slogan">���������·��ת��Ϊ�ɼ���������֪ʶ�������ָ�</p>
      <p>ͨ���ֻ���ͼ����ģ̬�������������̽������ GUI ���������ٽ��ڵ㡢����������·��תΪ������¼��������ǿ����ͼ����������ָ������������û�������Ӧ�ù��ܣ�ҳ�浼�������⽻�������˹�������</p>
      <div class="project-metrics"><span>ADB</span><span>Multimodal LLM</span><span>GUI Tree</span><span>BM25</span><span>Instruction Augmentation</span></div>
      <div class="repo-actions"><a class="button primary" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent" target="_blank" rel="noreferrer">�鿴 GitHub �ֿ� �J</a><a class="button" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent/tree/main/docs" target="_blank" rel="noreferrer">����ĵ� �J</a></div>
    </div>
    <div class="project-note"><span>����ĵ��뽻��չʾ</span><p>չʾ���ռ�¼ 47 ��Ӧ�á�5,285 �������ڵ㡢321 ����ͼ����� 37,166 ������ָ���ʾ֪ʶ�ռ��봦����ģ���ֿ��ṩ����ĵ��Ϳɽ������գ�δ���������ɼ�Դ����ԭʼ���ݣ�ָ�����ɹ�ģ���Զ�ִ�гɹ��ʷֱ������</p></div>
  </article>

  <article class="project-showcase reverse" id="soramart">
    <div class="project-copy">
      <div class="project-kicker">������ �� ��ά����ԭ��</div>
      <h2>��ҹ������ �� SoraMart</h2>
      <p class="project-slogan">����ֽǣ������껹���ŵơ��߽�ȥ����һ�ݽ����ı㵱��</p>
      <p>һ����������΢����ά������Ʒ���ڵ�����ת�۲���ҹ�ֽǣ�����������ߡ��鿴��Ʒ��װ�����빺�������ٵ�����̨ģ����ˡ���һ�������Ĺ������飬�ѳ�����Χ��С��Ϸ������������</p>
      <div class="project-metrics"><span>Three.js</span><span>WebGL</span><span>�������</span><span>��ƷԤ��</span><span>������</span></div>
      <div class="mini-arch"><span>�ֽǹ۲�</span><b>��</b><span>��������</span><b>��</b><span>��ѡ��Ʒ</span><b>��</b><span>ģ�����</span><b>��</b><span>���</span></div>
      <div class="project-facts">
        <div><strong>��������</strong><span>��ҹ�־���ů���������ɡ����������ӽ��л�</span></div>
        <div><strong>��������</strong><span>�ƿ��������ߡ���ת��Ʒ���������������ɹ���СƱ</span></div>
        <div><strong>���з�ʽ</strong><span>��̬��ҳ�뱾���زģ���ͨ������ HTTP ��������</span></div>
      </div>
      <div class="repo-actions">
        <a class="button primary" href="https://ame-mart-rain-corner.sunnybrioche.chatgpt.site/" target="_blank" rel="noreferrer">�������߳��� �J</a>
        <a class="button" href="https://github.com/telawang91-dotcom/soramart-rainy-night" target="_blank" rel="noreferrer">�鿴 GitHub �ֿ� �J</a>
        <a class="button" href="{{ '/2026/11/12/soramart-creative-coding/' | relative_url }}">��Ŀ��� ��</a>
      </div>
      <p>��Ϊ Vibe Coding / �����̷�������鰸����չʾ��ά�����뽻���ջ�����ǰ��λΪС��Ϸԭ�͡����߷��ʷ�Χ���йܶ˿��ƣ�Ҳ�ɴӲֿ��������С�</p>
    </div>
    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/media/SoraMart-showcase.mp4" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/street-corner.jpg" alt="SoraMart ��ҹ������΢���ֽǣ�ů��������ɡ����" loading="lazy" width="960" height="540">
      </a>
      <p class="project-caption">SoraMart �� ���ȫ��ͼ�ۿ� 72 ��չʾ��Ƶ</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/choose-products.jpg" alt="SoraMart ��ɫ�ڻ���ǰ�鿴�㵱��װ��۸�" loading="lazy" width="960" height="540">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/checkout.jpg" alt="SoraMart ����̨ģ������빺��СƱ" loading="lazy" width="960" height="540">
      </div>
    </div>
  </article>

  <section class="project-footer-note">
    <p>�з� Agent Harness �Ĺ��̾��������� <a class="text-link" href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">�淶������������֤�ջ�</a>������Ϊͨ�ü������̣���������ҵ��ĿԴ�롣</p>
    <p>���������ʵ����Ŀ�� <a class="text-link" href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">github.com/telawang91-dotcom �J</a></p>
  </section>
</div>
