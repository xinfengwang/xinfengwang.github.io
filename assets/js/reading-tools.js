(() => {
  'use strict';
  const key = 'wx-reading-v1';
  const catalogNode = document.getElementById('reading-catalog');
  if (!catalogNode) return;
  let catalog;
  try { catalog = JSON.parse(catalogNode.textContent); } catch (_) { return; }
  const byPath = new Map(catalog.map(post => [post.url, post]));
  let records = {}, settings = {}, storageOK = true;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    if (stored && typeof stored === 'object') {
      if (stored.records && typeof stored.records === 'object') {
        // Trust only paths in the current server-rendered article catalog.
        for (const [path, record] of Object.entries(stored.records)) {
          if (!byPath.has(path) || !record || typeof record !== 'object') continue;
          records[path] = {
            percent: Math.min(100, Math.max(0, Number(record.percent) || 0)),
            read: record.read === true, saved: record.saved === true,
            updated: Number(record.updated) || 0,
            heading: typeof record.heading === 'string' ? record.heading : ''
          };
        }
      }
      if (stored.settings && typeof stored.settings === 'object') settings = stored.settings;
    }
    localStorage.setItem(key, JSON.stringify({ records, settings }));
  } catch (_) { storageOK = false; }
  const announce = message => {
    const status = document.getElementById('reader-status') || document.getElementById('library-status');
    if (status) status.textContent = message;
  };
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ records, settings })); return true; }
    catch (_) { storageOK = false; announce('浏览器无法保存阅读记录；本次更改仅在当前页面有效。'); return false; }
  }
  if (!storageOK) announce('浏览器无法保存阅读记录；收藏、进度与设置仅在当前页面有效。');
  function applySettings() {
    for (const [name, allowed] of Object.entries({size:['normal','large','larger'],font:['sans','serif'],width:['normal','wide']})) {
      const value = allowed.includes(settings[name]) ? settings[name] : allowed[0];
      document.documentElement.dataset[`reader${name[0].toUpperCase()}${name.slice(1)}`] = value;
      const input = document.getElementById(`reader-${name}`);
      if (input) input.value = value;
    }
  }
  applySettings();
  for (const name of ['size','font','width']) {
    document.getElementById(`reader-${name}`)?.addEventListener('change', event => {
      settings[name] = event.target.value; applySettings(); persist();
    });
  }
  function updateBadges() {
    document.querySelectorAll('.chapter-row.published, .series-directory a, .post-card h2 a').forEach(link => {
      const record = records[new URL(link.href, location.href).pathname];
      link.querySelector('.reading-badge')?.remove();
      if (!record || (!record.read && record.percent < 2)) return;
      const badge = document.createElement('span'); badge.className = 'reading-badge';
      badge.textContent = record.read ? '已读' : `读至 ${Math.round(record.percent)}%`;
      (link.querySelector('.chapter-title') || link).append(badge);
    });
    document.querySelectorAll('[data-series-progress]').forEach(el => {
      const posts = catalog.filter(post => post.series === el.dataset.seriesProgress);
      const count = posts.filter(post => records[post.url]?.read).length;
      el.textContent = `本机阅读进度：${count} / ${posts.length} 篇已读 · 阅读记录仅保存在此浏览器`;
    });
  }
  updateBadges();
  const recent = Object.entries(records).filter(([,r]) => !r.read && r.percent >= 2)
    .sort((a,b) => b[1].updated - a[1].updated);
  document.querySelectorAll('[data-reading-return]').forEach(el => {
    const series = document.querySelector('[data-series-progress]')?.dataset.seriesProgress;
    const entry = recent.find(([path]) => !series || byPath.get(path).series === series);
    if (!entry) return;
    const [path, record] = entry;
    const prefix = document.createElement('span'); prefix.textContent = '接着上次读';
    const link = document.createElement('a'); link.href = path; link.textContent = byPath.get(path).title;
    const detail = document.createElement('span'); detail.textContent = `读至 ${Math.round(record.percent)}% →`;
    el.append(prefix,link,detail); el.hidden = false;
  });
  const post = byPath.get(location.pathname);
  const body = document.querySelector('.article-body');
  if (post && body) {
    const record = records[post.url] ||= {percent:0,read:false,saved:false,updated:0,heading:''};
    const previous = {...record};
    const save = document.getElementById('reader-save');
    const read = document.getElementById('reader-read');
    function updateButtons() {
      save.textContent = record.saved ? '已收藏 · 取消' : '收藏文章';
      save.setAttribute('aria-pressed', String(record.saved));
      read.textContent = record.read ? '已读 · 取消标记' : '标记已读';
      read.setAttribute('aria-pressed', String(record.read));
    }
    updateButtons();
    save.addEventListener('click', () => {
      record.saved = !record.saved; record.updated = Date.now();
      updateButtons(); if (persist()) announce(record.saved ? '已加入我的书架。' : '已取消收藏。');
    });
    read.addEventListener('click', () => {
      record.read = !record.read; record.updated = Date.now();
      updateButtons(); updateBadges(); if (persist()) announce(record.read ? '已标记读完，可继续阅读下一篇。' : '已取消已读标记。');
    });
    const focus = document.getElementById('reader-focus');
    function setFocus(active) {
      document.body.classList.toggle('reader-focus',active);
      focus.setAttribute('aria-pressed', String(active));
      focus.textContent = active ? '退出专注 · Esc' : '专注阅读';
    }
    focus.addEventListener('click', () => setFocus(!document.body.classList.contains('reader-focus')));
    document.addEventListener('keydown', event => { if(event.key === 'Escape') setFocus(false); });
    const resume = document.getElementById('reader-resume');
    if (!location.hash && !previous.read && previous.percent >= 2) {
      const text = document.createElement('p'); text.textContent = `上次读至 ${Math.round(previous.percent)}%${previous.heading ? ' · ' + previous.heading : ''}`;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = '继续上次阅读 →';
      button.addEventListener('click', () => {
        const section = [...body.querySelectorAll('h2,h3')].find(h => h.textContent === previous.heading);
        if (section) { section.scrollIntoView(); section.tabIndex = -1; section.focus({preventScroll:true}); }
        else { const top = window.scrollY + body.getBoundingClientRect().top; window.scrollTo({top: top + Math.max(0,body.offsetHeight-window.innerHeight)*previous.percent/100}); }
        resume.hidden = true;
      });
      resume.append(text,button); resume.hidden = false;
    }
    let changed = false, timer;
    function capture() {
      if (!changed) return;
      const top = window.scrollY + body.getBoundingClientRect().top;
      if (window.scrollY + window.innerHeight < top) return;
      const percent = Math.min(100,Math.max(0,(window.scrollY-top)/Math.max(1,body.offsetHeight-window.innerHeight)*100));
      // Returning to the title should not erase a useful saved position.
      if (percent < 2) return;
      record.percent = percent; record.updated = Date.now();
      record.heading = [...body.querySelectorAll('h2,h3')].filter(h=>h.getBoundingClientRect().top <= 160).at(-1)?.textContent || '';
      persist(); changed = false;
    }
    window.addEventListener('scroll', () => { changed = true; clearTimeout(timer); timer = setTimeout(capture,500); },{passive:true});
    window.addEventListener('pagehide',capture);
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) capture(); });
  }
  const list = document.getElementById('library-items');
  if (list) {
    let selected = 'saved';
    function render() {
      list.replaceChildren();
      const items = Object.entries(records).filter(([,r]) => selected === 'saved' ? r.saved : selected === 'read' ? r.read : r.updated > 0)
        .sort((a,b)=>b[1].updated-a[1].updated);
      const status = document.getElementById('library-status');
      status.textContent = (storageOK ? '' : '浏览器无法保存阅读记录。') + (items.length ? `${items.length} 篇文章` : '这里还没有文章。到学习地图选一篇开始阅读，或在文章顶部点收藏。');
      for (const [path,record] of items) {
        const item = document.createElement('article'); item.className = 'library-item';
        const h = document.createElement('h2'), link = document.createElement('a');
        link.href = path; link.textContent = byPath.get(path).title; h.append(link);
        const note = document.createElement('p'); note.textContent = `${record.read ? '已读' : '读至 '+Math.round(record.percent)+'%'} · ${new Date(record.updated).toLocaleDateString('zh-CN')}${record.saved ? ' · 已收藏' : ''}`;
        item.append(h,note);
        if (record.saved) {
          const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '取消收藏';
          remove.setAttribute('aria-label',`取消收藏：${byPath.get(path).title}`);
          remove.addEventListener('click',()=>{record.saved=false;persist();render();document.querySelector('[data-library-filter="'+selected+'"]').focus();}); item.append(remove);
        }
        list.append(item);
      }
    }
    document.querySelectorAll('[data-library-filter]').forEach(button => button.addEventListener('click',()=>{
      selected = button.dataset.libraryFilter;
      list.hidden=selected==='excerpts';
      document.getElementById('excerpt-items')?.toggleAttribute('hidden',selected!=='excerpts');
      document.querySelectorAll('[data-library-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      if(selected==='excerpts'){document.dispatchEvent(new CustomEvent('blog:library-excerpts'));}else render();
    }));
    document.getElementById('library-export').addEventListener('click',()=>{
      const lines = ['# 我的博客阅读清单','', '导出的清单用于留存链接，不会自动恢复浏览器阅读记录。',''];
      for (const [path,r] of Object.entries(records).filter(([,r])=>r.saved||r.read||r.updated).sort((a,b)=>b[1].updated-a[1].updated)) {
        const title = byPath.get(path).title.replace(/[\[\]\\]/g,'\\$&');
        lines.push(`- [${r.read ? 'x' : ' '}] [${title}](${new URL(path,location.origin).href})${r.saved ? ' · 收藏' : ''} · 读至 ${Math.round(r.percent)}%`);
      }
      document.dispatchEvent(new CustomEvent('blog:export-excerpts',{detail:{lines}}));
      const url = URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}));
      const a = document.createElement('a'); a.href=url; a.download='wx-reading-list.md'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    render();
  }
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    if (((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k') || (event.key==='/'&&!event.ctrlKey&&!event.metaKey)) {
      const search = document.querySelector('.search-link'); if (search) { event.preventDefault(); location.assign(search.href); }
    }
  });
})();
