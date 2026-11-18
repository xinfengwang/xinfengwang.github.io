(() => {
  'use strict';
  const body=document.querySelector('.article-body');if(!body)return;
  const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
  const button=(text,fn)=>{const node=element('button','button',text);node.type='button';node.addEventListener('click',fn);return node;};
  function showDialog(dialog){if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog){if(dialog.close)dialog.close();else dialog.removeAttribute('open');}
  async function copy(text,control){
    try{await navigator.clipboard.writeText(text);const old=control.textContent;control.textContent='已复制';setTimeout(()=>control.textContent=old,1400);}
    catch(_){const modal=element('dialog','copy-table-dialog'),title=element('h2','','请手动复制表格'),area=element('textarea');area.readOnly=true;area.value=text;area.rows=10;modal.append(title,area,button('关闭',()=>{closeDialog(modal);modal.remove();control.focus();}));document.body.append(modal);showDialog(modal);area.focus();area.select();}
  }
  // Definitions are reader controls, kept out of code, links and headings.
  let glossary=[];try{glossary=JSON.parse(document.getElementById('article-glossary')?.textContent || '[]');}catch(_){}
  if(glossary.length){
    const pop=element('aside','glossary-popover');pop.id='glossary-detail';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-label','术语解释');
    const name=element('strong'),definition=element('p'),read=element('a','text-link','深入阅读 →');let active=null,hideTimer,suppressFocus=false;
    function focusBack(source){suppressFocus=true;source?.focus();suppressFocus=false;}
    function hide(){pop.hidden=true;active?.setAttribute('aria-expanded','false');active=null;}
    pop.append(name,definition,read,button('关闭',()=>{const source=active;hide();focusBack(source);}));document.body.append(pop);
    function show(source,item){clearTimeout(hideTimer);active?.setAttribute('aria-expanded','false');active=source;source.setAttribute('aria-expanded','true');name.textContent=source.textContent;definition.textContent=item.definition;read.href=item.url;pop.hidden=false;const rect=source.getBoundingClientRect(),width=Math.min(340,window.innerWidth-32);pop.style.width=width+'px';pop.style.left=Math.max(16,Math.min(rect.left,window.innerWidth-width-16))+'px';const available=window.innerHeight-rect.bottom;pop.style.top=(available>pop.offsetHeight+20?rect.bottom+8:Math.max(12,rect.top-pop.offsetHeight-8))+'px';}
    pop.addEventListener('pointerenter',()=>clearTimeout(hideTimer));pop.addEventListener('pointerleave',()=>{hideTimer=setTimeout(hide,160);});
    document.addEventListener('pointerdown',event=>{if(!pop.contains(event.target)&&event.target!==active)hide();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!pop.hidden){const source=active;hide();focusBack(source);}});
    window.addEventListener('scroll',()=>{if(!pop.hidden)hide();},{passive:true});
    const aliases=glossary.flatMap(item=>item.aliases.map(alias=>({alias,item}))).sort((a,b)=>b.alias.length-a.alias.length);
    const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const pattern=new RegExp(aliases.map(x=>escape(x.alias)).join('|'),'gi'),used=new Set();
    const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement.closest('a,pre,code,button,mark,h1,h2,h3,h4,script,style,.passage-block-controls')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    const texts=[];let node;while((node=walker.nextNode()))texts.push(node);
    for(const text of texts){
      const fragment=document.createDocumentFragment();let index=0,matched=false;
      for(const match of text.textContent.matchAll(pattern)){
        const entry=aliases.find(x=>x.alias.toLowerCase()===match[0].toLowerCase());
        if(!entry||used.has(entry.item.id))continue;
        if(/^[\x00-\x7F]/.test(match[0])&&(/[\w]/.test(text.textContent[match.index-1]||'')||/[\w]/.test(text.textContent[match.index+match[0].length]||'')))continue;
        fragment.append(document.createTextNode(text.textContent.slice(index,match.index)));
        const control=button(match[0],()=>show(control,entry.item));control.className='glossary-term';control.setAttribute('aria-expanded','false');control.setAttribute('aria-controls',pop.id);control.setAttribute('aria-label',match[0]+'：查看解释');
        control.addEventListener('focus',()=>{if(!suppressFocus)show(control,entry.item);});
        control.addEventListener('blur',()=>{setTimeout(()=>{if(!pop.contains(document.activeElement)&&document.activeElement!==active)hide();},0);});
        control.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')show(control,entry.item);});control.addEventListener('pointerleave',()=>{hideTimer=setTimeout(hide,200);});
        fragment.append(control);index=match.index+match[0].length;used.add(entry.item.id);matched=true;
      }
      if(matched){fragment.append(document.createTextNode(text.textContent.slice(index)));text.replaceWith(fragment);}
    }
  }
  // One viewer for raster figures and rendered Mermaid SVGs.
  const viewer=element('dialog','figure-viewer');viewer.setAttribute('aria-label','放大查看图片');
  const bar=element('div','figure-viewer-tools'),caption=element('p','figure-caption'),stage=element('div','figure-stage'),image=element('img');stage.append(image);
  let scale=1,x=0,y=0,drag=null,trigger=null,blobURL=null;
  const transform=()=>image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;
  function reset(){scale=1;x=0;y=0;transform();}
  function close(){closeDialog(viewer);if(blobURL){URL.revokeObjectURL(blobURL);blobURL=null;}trigger?.focus({preventScroll:true});}
  bar.append(button('放大 +',()=>{scale=Math.min(5,scale*1.25);transform();}),button('缩小 −',()=>{scale=Math.max(.5,scale/1.25);transform();}),button('适应窗口',reset),button('关闭 · Esc',close));viewer.append(bar,stage,caption);document.body.append(viewer);
  viewer.addEventListener('cancel',()=>{if(blobURL){URL.revokeObjectURL(blobURL);blobURL=null;}trigger?.focus({preventScroll:true});});
  stage.addEventListener('wheel',event=>{event.preventDefault();scale=Math.max(.5,Math.min(5,scale*(event.deltaY<0?1.15:1/1.15)));transform();},{passive:false});
  stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={startX:event.clientX,startY:event.clientY,x,y};stage.setPointerCapture?.(event.pointerId);event.preventDefault();});
  stage.addEventListener('pointermove',event=>{if(!drag)return;x=drag.x+event.clientX-drag.startX;y=drag.y+event.clientY-drag.startY;transform();});
  for(const type of ['pointerup','pointercancel'])stage.addEventListener(type,()=>drag=null);
  const figures=new WeakSet();
  function enhanceFigures(){
    body.querySelectorAll('img,.mermaid svg').forEach(figure=>{
      if(figures.has(figure))return;figures.add(figure);
      const label=figure.getAttribute('alt')||figure.querySelector('title')?.textContent||figure.closest('figure')?.querySelector('figcaption')?.textContent||'文章示意图';
      const expand=button('放大查看 ↗',()=>{
        trigger=expand;reset();caption.textContent=label;image.alt=label;
        if(figure.tagName.toLowerCase()==='svg'){blobURL=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(figure)],{type:'image/svg+xml'}));image.src=blobURL;}else image.src=figure.currentSrc||figure.src;
        showDialog(viewer);
      });expand.className='figure-expand';expand.setAttribute('aria-label','放大查看：'+label);figure.after(expand);
    });
  }
  enhanceFigures();document.addEventListener('blog:diagrams-ready',enhanceFigures);
  function tableGrid(table){
    const grid=[];const rows=[...table.rows];
    rows.forEach((row,r)=>{grid[r] ||= [];let col=0;for(const cell of row.cells){while(grid[r][col]!==undefined)col++;const value=cell.textContent.replace(/\s+/g,' ').trim(),height=cell.rowSpan||rows.length-r;for(let dr=0;dr<height;dr++){grid[r+dr] ||= [];for(let dc=0;dc<cell.colSpan;dc++)grid[r+dr][col+dc]=dr===0&&dc===0?value:'';}col+=cell.colSpan;}});
    const width=Math.max(0,...grid.map(row=>row.length));return grid.map(row=>Array.from({length:width},(_,col)=>row[col]||''));
  }
  body.querySelectorAll('table').forEach(table=>{
    const controls=element('div','table-reading-tools');controls.setAttribute('aria-label','表格复制工具');
    controls.append(button('复制到表格',event=>copy(tableGrid(table).map(row=>row.join('\t')).join('\n'),event.currentTarget)),button('复制 Markdown',event=>{const rows=tableGrid(table);if(!rows.length)return;const row=value=>'| '+value.map(text=>text.replace(/\\/g,'\\\\').replace(/\|/g,'\\|')).join(' | ')+' |';copy([row(rows[0]),row(rows[0].map(()=>'---')),...rows.slice(1).map(row)].join('\n'),event.currentTarget);}));
    const wrap=table.closest('.article-table-scroll')||table;wrap.before(controls);
  });
  // Loading is explicit; a closed Issue is not automatically a verified correction.
  const feedback=document.querySelector('[data-feedback-path]'),refresh=document.getElementById('feedback-refresh');
  if(feedback&&refresh){
    const status=document.getElementById('feedback-record-status'),list=document.getElementById('feedback-record-list');
    refresh.addEventListener('click',async()=>{
      refresh.disabled=true;status.textContent='正在查询公开反馈…';list.replaceChildren();const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);
      try{
        let issues=[],limited=false;
        for(let page=1;page<=3;page++){
          const response=await fetch(`https://api.github.com/repos/xinfengwang/xinfengwang.github.io/issues?state=all&per_page=100&page=${page}`,{headers:{Accept:'application/vnd.github+json'},signal:abort.signal});if(!response.ok)throw Error('GitHub unavailable');const batch=await response.json();if(!Array.isArray(batch))throw Error('Invalid response');issues.push(...batch);if(batch.length<100)break;if(page===3)limited=true;
        }
        const related=issues.filter(issue=>!issue.pull_request&&Number.isInteger(issue.number)&&typeof issue.body==='string'&&issue.body.includes(feedback.dataset.feedbackPath));
        for(const issue of related){
          const labels=(issue.labels||[]).map(value=>typeof value==='string'?value:value.name);
          const fixed=issue.state==='closed'&&labels.some(label=>['fixed','已修订','已修复'].includes(label));
          const state=fixed?'已修订':issue.state==='closed'?'已关闭':'待处理';
          const item=element('li'),badge=element('span','feedback-state',state),link=element('a');link.href=`https://github.com/xinfengwang/xinfengwang.github.io/issues/${issue.number}`;link.target='_blank';link.rel='noreferrer';link.textContent=`#${issue.number} ${issue.title}`;item.append(badge,link);list.append(item);
        }
        status.textContent=related.length?`${related.length} 条关联反馈${limited?'（仅检查最近 300 条 Issue）':''}。状态来自 GitHub。`:(limited?'最近 300 条 Issue 中未找到关联反馈，可到 GitHub 完整搜索。':'当前没有找到关联本文的公开反馈。');
      }catch(_){status.textContent='暂时无法加载反馈，可点击“到 GitHub 查看”继续核对。';}
      finally{clearTimeout(timer);refresh.disabled=false;}
    });
  }
})();
