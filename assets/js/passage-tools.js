(() => {
  'use strict';
  const root = document.getElementById('passage-tools');
  const body = document.querySelector('.article-body');
  if (!root || !body) return;
  const repo = 'https://github.com/xinfengwang/xinfengwang.github.io';
  const title = root.dataset.articleTitle;
  const source = root.dataset.sourcePath.split('/').map(encodeURIComponent).join('/');
  const canonical = new URL(root.dataset.articleUrl);
  const dialog = document.getElementById('passage-dialog');
  const toolbar = document.getElementById('selection-toolbar');
  const quoteNode = document.getElementById('passage-quote');
  const comment = document.getElementById('passage-comment');
  const status = document.getElementById('passage-status');
  let context = null, selectionContext = null, opener = null, cardURL = null, selectionTimer, issueBody = '';
  function textOf(el) {
    const copy = el.cloneNode(true);
    copy.querySelectorAll('button,.passage-block-controls,.copy-code,.reading-badge').forEach(node => node.remove());
    return copy.textContent.trim();
  }
  function hash(text) {
    let value = 2166136261;
    for (const char of text) { value ^= char.codePointAt(0); value = Math.imul(value,16777619); }
    return (value >>> 0).toString(36);
  }
  const blocks = [...body.querySelectorAll('p,li,pre,table,blockquote,h2,h3')];
  const used = new Set([...document.querySelectorAll('[id]')].map(el => el.id));
  blocks.forEach(block => {
    if (block.id) return;
    const base = 'passage-' + hash(textOf(block).replace(/\s+/g,' '));
    let id = base, index = 1; while (used.has(id)) id = base + '-' + index++;
    block.id = id; used.add(id);
  });
  function headingOf(block) {
    let heading = '';
    for (const h of body.querySelectorAll('h2,h3')) {
      if (h === block || h.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING) heading = textOf(h);
      else break;
    }
    return heading;
  }
  function makeContext(block, quote = '') {
    return {id:block?.id || '',heading:block ? headingOf(block) : '',quote:quote.trim().slice(0,800)};
  }
  function anchorLink(ctx, includeQuote = true) {
    const url = new URL(canonical.href);
    url.hash = ctx.id;
    if (includeQuote && ctx.quote) url.searchParams.set('quote',ctx.quote.slice(0,500));
    return url.href;
  }
  function updateIssue() {
    if (!context) return;
    const url = new URL(repo + '/issues/new');
    url.searchParams.set('title',`文章反馈：${title}${context.heading ? ' / '+context.heading : ''}`.slice(0,160));
    const quote = context.quote ? context.quote.split('\n').map(line => '> '+line).join('\n') : '（针对整篇文章）';
    const content = `## 文章\n[${title}](${anchorLink(context)})\n\n小节：${context.heading || '整篇文章'}\n原文文件：${repo}/blob/main/${source}\n\n## 引用原文\n${quote}\n\n## 问题 / 建议\n${comment.value.trim().slice(0,1200) || '请补充问题、依据或复现步骤。'}\n`;
    issueBody = content;
    url.searchParams.set('body',content);
    if (url.href.length > 7500) {
      url.searchParams.set('body',`文章：${title}\n定位：${anchorLink(context,false)}\n小节：${context.heading || '整篇文章'}\n\n引用摘录：${context.quote.slice(0,150)}\n\n反馈较长，请回到博客点击“复制反馈全文”，粘贴到此处后提交。`);
      status.textContent='反馈较长，请先复制反馈全文，再粘贴到 GitHub 输入框中提交。';
    } else status.textContent='';
    document.getElementById('passage-issue').href = url.href;
  }
  function resetCard() {
    if (cardURL) { URL.revokeObjectURL(cardURL); cardURL = null; }
    document.getElementById('passage-card-preview').hidden = true;
    document.getElementById('passage-card-download').removeAttribute('href');
  }
  function open(mode, ctx, trigger) {
    context = {...ctx}; opener = trigger || document.activeElement;
    toolbar.hidden = true; status.textContent = ''; comment.value = ''; resetCard();
    document.getElementById('passage-manual-copy').hidden=true;
    document.getElementById('passage-manual-label').hidden=true;
    quoteNode.textContent = context.quote || '针对整篇文章';
    document.getElementById('passage-context').textContent = `${title}${context.heading ? ' · '+context.heading : ''}`;
    document.getElementById('passage-dialog-title').textContent = mode === 'share' ? '把这段分享出去' : '针对原文提出反馈';
    document.getElementById('passage-feedback-panel').hidden = mode !== 'feedback';
    document.getElementById('passage-share-panel').hidden = mode !== 'share';
    document.getElementById('passage-link').value = anchorLink(context);
    document.querySelector('label[for="passage-link"]').textContent='定位到原文的分享链接';
    document.getElementById('passage-edit').href = `${repo}/edit/main/${source}`;
    const search = new URL(repo+'/issues'); search.searchParams.set('q',`is:issue "${canonical.pathname}"`);
    document.getElementById('passage-existing').href = search.href;
    document.getElementById('passage-native-share').hidden = !navigator.share;
    updateIssue();
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
    (mode === 'feedback' ? comment : document.getElementById('passage-copy-link')).focus();
  }
  function close() {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
    toolbar.hidden = true;
    if (opener && document.contains(opener) && !toolbar.contains(opener)) opener.focus({preventScroll:true});
    else if (context?.id) {const block=document.getElementById(context.id);if(block){block.tabIndex=-1;block.focus({preventScroll:true});}}
  }
  document.getElementById('passage-close').addEventListener('click',close);
  dialog.addEventListener('close',()=>{ toolbar.hidden = true; });
  document.addEventListener('keydown',event=>{
    if (event.key === 'Escape') { toolbar.hidden = true; if (dialog.open) close(); }
  });
  comment.addEventListener('input',updateIssue);
  function observeSelection() {
    if (dialog.open) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) { toolbar.hidden = true; return; }
    const range = selection.getRangeAt(0);
    if (!body.contains(range.startContainer) || !body.contains(range.endContainer)) { toolbar.hidden = true; return; }
    const start = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentElement;
    if (start.closest('button:not(.glossary-term),.passage-block-controls')) { toolbar.hidden=true; return; }
    const block = start.closest('p,li,pre,table,blockquote,h2,h3');
    const quote = selection.toString().trim();
    if (!block || quote.length < 2) { toolbar.hidden=true; return; }
    selectionContext = makeContext(block,quote); selectionContext.copyText=quote; toolbar.hidden=false;
  }
  document.addEventListener('selectionchange',()=>{clearTimeout(selectionTimer);selectionTimer=setTimeout(observeSelection,120);});
  toolbar.addEventListener('pointerdown',event=>{ if(event.pointerType !== 'touch') event.preventDefault(); });
  toolbar.querySelectorAll('[data-passage-action]').forEach(button=>button.addEventListener('click',async()=>{
    if (!selectionContext) return;
    if (button.dataset.passageAction === 'save') {
      const detail={...selectionContext,url:canonical.href,title};
      document.dispatchEvent(new CustomEvent('blog:save-excerpt',{detail}));
      const old=button.textContent;button.textContent=detail.saved ? '已加入书架' : '无法保存';setTimeout(()=>button.textContent=old,1500);return;
    }
    if (button.dataset.passageAction === 'copy') { await copy(selectionContext.copyText,button); return; }
    open(button.dataset.passageAction,selectionContext,button);
  }));
  document.getElementById('selection-close').addEventListener('click',()=>{toolbar.hidden=true;window.getSelection()?.removeAllRanges();});
  // Per-section controls also work for touch and keyboard readers without text selection.
  const sections = [...body.querySelectorAll('h2,h3')];
  sections.forEach((heading,index)=>{
    const next = sections[index+1];
    const control = document.createElement('div'); control.className='passage-block-controls';
    const first = blocks.find(block => !block.matches('h2,h3') && heading.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING && (!next || block.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING));
    const ctx = makeContext(heading,first ? textOf(first) : textOf(heading));
    for (const [mode,label] of [['feedback','反馈这一节'],['share','分享这一节']]) {
      const button=document.createElement('button'); button.type='button'; button.textContent=label;
      button.setAttribute('aria-label',`${label}：${textOf(heading)}`);
      button.addEventListener('click',()=>open(mode,ctx,button)); control.append(button);
    }
    heading.after(control);
  });
  document.querySelector('[data-whole-feedback]')?.addEventListener('click',event=>{event.preventDefault();open('feedback',makeContext(null),event.currentTarget);});
  document.getElementById('share-article')?.addEventListener('click',event=>open('share',makeContext(null),event.currentTarget));
  async function copy(text,button) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      const old=button.textContent;button.textContent='已复制';setTimeout(()=>button.textContent=old,1200);
      status.textContent='已复制。';
    } catch (_) {
      if (!dialog.open) open('share',selectionContext || makeContext(null),button);
      status.textContent='浏览器未允许自动复制，请手动复制下方选中的内容。';
      document.getElementById('passage-manual-label').hidden=false;
      const input=document.getElementById('passage-manual-copy');input.hidden=false;input.value=text;input.focus();input.select();
    }
  }
  document.getElementById('passage-copy-link').addEventListener('click',event=>copy(anchorLink(context),event.currentTarget));
  document.getElementById('passage-copy-feedback').addEventListener('click',event=>copy(issueBody,event.currentTarget));
  document.getElementById('passage-native-share').addEventListener('click',async()=>{
    try { await navigator.share({title,text:context.quote,url:anchorLink(context)}); }
    catch(error) { if(error.name!=='AbortError') status.textContent='系统分享不可用，可以复制链接或下载图片。'; }
  });
  const escape = value => value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function wrap(text,width) {
    const lines=[];let line='',weight=0;
    for(const char of text) {
      const size=/[\x00-\x7F]/.test(char)?0.56:1;
      if(char==='\n'||weight+size>width){lines.push(line);line='';weight=0;if(char==='\n')continue;}
      line+=char;weight+=size;
    }
    if(line)lines.push(line);return lines;
  }
  function cardSVG(ctx) {
    const full=ctx.quote || root.dataset.articleTitle;
    const excerpt=Array.from(full).slice(0,280).join('')+(Array.from(full).length>280?'…':'');
    const wrapped=wrap(excerpt,21),lines=wrapped.slice(0,16),titles=wrap(title,29).slice(0,3);
    if(wrapped.length>16)lines[15]+='…';
    const start=170+titles.length*44,height=Math.max(720,start+lines.length*62+280);
    const qr=qrcode(0,'M');qr.addData(anchorLink(ctx,false));qr.make();
    const count=qr.getModuleCount(),size=176,cell=size/(count+8),qrX=1080-80-size,qrY=height-204;
    let squares='';for(let row=0;row<count;row++)for(let col=0;col<count;col++)if(qr.isDark(row,col))squares+=`<rect x="${qrX+(col+4)*cell}" y="${qrY+(row+4)*cell}" width="${cell}" height="${cell}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${height}" viewBox="0 0 1080 ${height}"><rect width="1080" height="${height}" fill="#fbfaf7"/><rect x="64" y="64" width="48" height="5" fill="#b94b34"/><g font-family="Arial,Microsoft YaHei,sans-serif"><text x="80" y="113" font-size="22" fill="#b94b34">WX. / 王新峰的技术博客</text>${titles.map((line,i)=>`<text x="80" y="${170+i*44}" font-size="32" font-weight="bold" fill="#24231f">${escape(line)}</text>`).join('')}${lines.map((line,i)=>`<text x="80" y="${start+54+i*62}" font-size="42" fill="#36322d">${escape(line)}</text>`).join('')}<path d="M80 ${height-230} H1000" stroke="#ddd8cf"/><text x="80" y="${height-165}" font-size="24" fill="#777168">阅读摘录 · 扫码查看原文</text><text x="80" y="${height-120}" font-size="24" fill="#b94b34">xinfengwang.github.io</text></g><rect x="${qrX}" y="${qrY}" width="${size}" height="${size}" fill="white"/><g fill="#24231f">${squares}</g></svg>`;
  }
  document.getElementById('passage-card').addEventListener('click',async event=>{
    const button=event.currentTarget;button.disabled=true;status.textContent='正在生成分享图片…';
    let svgURL;
    try {
      resetCard();
      svgURL=URL.createObjectURL(new Blob([cardSVG(context)],{type:'image/svg+xml;charset=utf-8'}));
      const image=new Image();image.src=svgURL;await image.decode();
      const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');ctx.drawImage(image,0,0);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG unavailable');
      cardURL=URL.createObjectURL(blob);
      document.getElementById('passage-card-image').src=cardURL;
      document.getElementById('passage-card-download').href=cardURL;
      document.getElementById('passage-card-preview').hidden=false;status.textContent='图片已生成，可下载后分享；二维码指向原文。';
    } catch (_) { status.textContent='图片生成失败，请复制定位链接分享。'; }
    finally {if(svgURL)URL.revokeObjectURL(svgURL);button.disabled=false;}
  });
  // Honor incoming excerpt links without trusting URL text as HTML.
  const incoming=new URL(location.href).searchParams.get('quote');
  let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch(_){}
  const target=id && document.getElementById(id);
  if (target && body.contains(target)) {
    if (incoming && incoming.length <= 500) {
      const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement.closest('button,.passage-block-controls') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
      const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
      const all=nodes.map(n=>n.textContent).join(''),start=all.indexOf(incoming);
      if(start>=0) {
        let offset=0;for(const n of nodes){const end=offset+n.length,left=Math.max(start,offset),right=Math.min(start+incoming.length,end);if(right>left){const range=document.createRange();range.setStart(n,left-offset);range.setEnd(n,right-offset);const mark=document.createElement('mark');mark.className='passage-highlight';range.surroundContents(mark);}offset=end;}
      }
    }
    requestAnimationFrame(()=>{target.scrollIntoView({block:'center'});target.tabIndex=-1;target.focus({preventScroll:true});});
  }
})();
