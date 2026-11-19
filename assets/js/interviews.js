(() => {
  const bank = document.querySelector('[data-interview-bank]');
  if (!bank) return;

  const filter = bank.querySelector('.interview-filter');
  const search = bank.querySelector('#interview-search');
  const status = bank.querySelector('.interview-status');
  const outline = bank.querySelector('.interview-outline');
  const index = outline.querySelector('.interview-index');
  const outlineFilter = outline.querySelector('.interview-outline-filter');
  const outlineSearch = outline.querySelector('#interview-outline-search');
  const outlineEmpty = outline.querySelector('.interview-outline-empty');
  const compact = window.matchMedia('(max-width: 900px)');
  const normalize = (value) => value.normalize('NFKC').toLowerCase();
  const tracks = Array.from(index.querySelectorAll('.interview-index-group'), (group) => {
    const name = group.querySelector('.interview-index-title').textContent;
    const entries = Array.from(group.querySelectorAll('a'), (link) => {
      const section = document.getElementById(link.hash.slice(1));
      return {
        link,
        section,
        title: normalize(`${name} ${link.querySelector('span').textContent}`),
        questions: Array.from(section.querySelectorAll('.interview-question'), (item) => ({
          item,
          text: normalize(`${item.querySelector('h3').textContent} ${item.dataset.keywords || ''}`),
        })),
      };
    });
    return { group, entries };
  });
  const sections = tracks.flatMap(({ entries }) => entries);
  let current;
  let frame = 0;

  function revealCurrent() {
    if (!outline.open || !current || current.closest('[hidden]')) return;
    const bounds = index.getBoundingClientRect();
    const row = current.getBoundingClientRect();
    if (row.top < bounds.top) index.scrollTop += row.top - bounds.top - 2;
    if (row.bottom > bounds.bottom) index.scrollTop += row.bottom - bounds.bottom + 2;
  }

  function updateCurrent() {
    frame = 0;
    const readingTop = parseFloat(getComputedStyle(sections[0].section).scrollMarginTop) + 2;
    let next;
    for (const { section, link } of sections) {
      if (section.hidden) continue;
      if (next && section.getBoundingClientRect().top > readingTop) break;
      next = link;
    }
    if (next === current) return;
    current?.removeAttribute('aria-current');
    current = next;
    current?.setAttribute('aria-current', 'location');
    revealCurrent();
  }

  function scheduleCurrent() {
    if (!frame) frame = requestAnimationFrame(updateCurrent);
  }

  function filterOutline() {
    const terms = normalize(outlineSearch.value.trim()).split(/\s+/).filter(Boolean);
    let found = false;
    for (const { group, entries } of tracks) {
      for (const { link, title } of entries) {
        link.parentElement.hidden = !terms.every((term) => title.includes(term));
      }
      group.hidden = entries.every(({ link }) => link.parentElement.hidden);
      found ||= !group.hidden;
    }
    outlineEmpty.hidden = found;
    index.scrollTop = 0;
    if (!terms.length) revealCurrent();
  }

  function updateResults() {
    const query = normalize(search.value.trim());
    const terms = query ? query.split(/\s+/) : [];
    let total = 0;
    for (const { section, questions } of sections) {
      let matches = 0;
      for (const { item, text } of questions) {
        item.hidden = !terms.every((term) => text.includes(term));
        if (!item.hidden) matches++;
      }
      section.hidden = matches === 0;
      total += matches;
    }
    status.textContent = total ? `${query ? '找到' : '共'} ${total} 道题` : '没有找到匹配题目。';
    scheduleCurrent();
  }

  index.addEventListener('click', (event) => {
    if (!event.target.closest('a') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (search.value) {
      search.value = '';
      updateResults();
    }
    if (compact.matches) outline.open = false;
  });
  outline.addEventListener('toggle', revealCurrent);
  outlineSearch.addEventListener('input', filterOutline);
  compact.addEventListener('change', () => {
    outline.open = !compact.matches;
    scheduleCurrent();
  });
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const placeOutline = () => {
      bank.style.setProperty('--interview-sticky-top', `${Math.ceil(siteHeader.getBoundingClientRect().height) + 12}px`);
      scheduleCurrent();
    };
    new ResizeObserver(placeOutline).observe(siteHeader);
    placeOutline();
  }
  window.addEventListener('scroll', scheduleCurrent, { passive: true });
  window.addEventListener('resize', scheduleCurrent);
  bank.addEventListener('toggle', scheduleCurrent, true);
  search.addEventListener('input', updateResults);
  outline.open = !compact.matches;
  outlineFilter.hidden = false;
  filterOutline();
  updateResults();
  filter.hidden = false;
})();
