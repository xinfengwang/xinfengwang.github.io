(() => {
  const bank = document.querySelector('[data-interview-bank]');
  if (!bank) return;

  const filter = bank.querySelector('.interview-filter');
  const search = bank.querySelector('#interview-search');
  const status = bank.querySelector('.interview-status');
  const normalize = (value) => value.normalize('NFKC').toLowerCase();
  const sections = Array.from(bank.querySelectorAll('.interview-section'), (section) => ({
    section,
    questions: Array.from(section.querySelectorAll('.interview-question'), (item) => ({
      item,
      text: normalize(`${item.querySelector('h3').textContent} ${item.dataset.keywords || ''}`),
    })),
  }));

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
  }

  bank.querySelector('.interview-index').addEventListener('click', (event) => {
    if (!search.value || !event.target.closest('a')) return;
    search.value = '';
    updateResults();
  });
  search.addEventListener('input', updateResults);
  updateResults();
  filter.hidden = false;
})();
