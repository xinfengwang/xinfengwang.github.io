(() => {
  const form = document.getElementById('article-filters');
  if (!form) return;
  const query = document.getElementById('archive-query');
  const kind = document.getElementById('archive-kind');
  const series = document.getElementById('archive-series');
  const entries = [...document.querySelectorAll('.archive-entry')];
  const index = entries.map(el => ({el, text: el.textContent.toLowerCase()}));
  const params = new URLSearchParams(location.search);
  query.value = params.get('q') || '';
  kind.value = params.get('kind') || '';
  series.value = params.get('series') || '';
  const filter = () => {
    const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    index.forEach(({el, text}) => {
      el.hidden = !(terms.every(t => text.includes(t)) && (!kind.value || kind.value === el.dataset.kind) && (!series.value || series.value === el.dataset.series));
      if (!el.hidden) count++;
    });
    document.getElementById('archive-count').textContent = `找到 ${count} / ${entries.length} 篇文章，按发布时间排序。`;
    document.getElementById('archive-empty').hidden = count > 0;
    const next = new URL(location.href);
    [['q', query.value.trim()], ['kind', kind.value], ['series', series.value]].forEach(([key, value]) => value ? next.searchParams.set(key, value) : next.searchParams.delete(key));
    history.replaceState(null, '', next);
  };
  form.hidden = false;
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', filter);
  form.addEventListener('change', filter);
  form.addEventListener('reset', () => { query.value = ''; kind.value = ''; series.value = ''; setTimeout(filter, 0); });
  filter();
})();
