(() => {
  const input = document.getElementById('site-search');
  const results = document.getElementById('search-results');
  if (!input || !results || !window.SEARCH_INDEX) return;
  const status = document.getElementById('search-status');
  input.value = new URLSearchParams(location.search).get('q') || '';
  const render = () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!q) { status.textContent = '输入关键词；多个词以空格分隔，例如 Agent 评测。'; return; }
    const terms = q.split(/\s+/);
    const hits = window.SEARCH_INDEX.filter(item => terms.every(t => `${item.title} ${item.excerpt} ${item.content || ''} ${item.tags}`.toLowerCase().includes(t)))
      .map(item => ({...item, score: terms.reduce((n, t) => n + (item.title.toLowerCase().includes(t) ? 3 : 0) + (item.tags.toLowerCase().includes(t) ? 1 : 0), 0)}))
      .sort((a, b) => b.score - a.score);
    status.textContent = hits.length ? `找到 ${hits.length} 条结果，标题匹配优先。` : '没有匹配内容。试试更短的关键词，或前往文章索引按主题浏览。';
    hits.forEach(item => {
      const el = document.createElement('article');
      el.className = 'search-hit';
      const label = document.createElement('span'); label.className = 'content-kind'; label.textContent = item.kind;
      const h = document.createElement('h2');
      const link = document.createElement('a'); link.href = item.url; link.textContent = item.title; h.append(link);
      const p = document.createElement('p'); p.textContent = item.excerpt.slice(0, 180);
      el.append(label, h, p);
      results.appendChild(el);
    });
  };
  input.addEventListener('input', render);
  render();
})();
