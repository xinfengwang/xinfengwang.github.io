(() => {
  'use strict';
  const key='wx-excerpts-v1';let entries=[];
  const catalogNode=document.getElementById('reading-catalog');if(!catalogNode)return;
  let catalog;try{catalog=JSON.parse(catalogNode.textContent);}catch(_){return;}
  const byPath=new Map(catalog.map(item=>[item.url,item]));
  const valid=item=>item&&typeof item.quote==='string'&&typeof item.note==='string'&&typeof item.id==='string'&&byPath.has(item.path)&&typeof item.anchor==='string'&&/^[\w\-\u0080-\uffff]*$/.test(item.anchor);
  try{const stored=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(stored))entries=stored.filter(valid).slice(0,300);}catch(_){}
  function persist(){try{localStorage.setItem(key,JSON.stringify(entries));return true;}catch(_){const status=document.getElementById('library-status');if(status)status.textContent='浏览器无法保存摘录；请先导出或复制笔记留存。';return false;}}
  function link(item){const url=new URL(item.path,location.origin);url.hash=item.anchor;if(item.quote)url.searchParams.set('quote',item.quote.slice(0,500));return url.href;}
  document.addEventListener('blog:save-excerpt',event=>{
    const data=event.detail;let url;try{url=new URL(data.url,location.origin);}catch(_){return;}
    if(url.origin!==location.origin||!byPath.has(url.pathname)||typeof data.quote!=='string'||!data.quote.trim())return;
    const quote=(data.copyText||data.quote).trim().slice(0,4000),anchor=typeof data.id==='string'?data.id:'';
    const existing=entries.find(item=>item.path===url.pathname&&item.quote===quote);
    if(existing){data.saved=true;return;}
    if(entries.length>=300){data.saved=false;return;}
    const item={id:'excerpt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),path:url.pathname,anchor,quote,note:'',heading:data.heading||'',updated:Date.now()};
    if(!valid(item))return;
    entries.unshift(item);if(!persist()){entries.shift();data.saved=false;}else data.saved=true;
  });
  const container=document.getElementById('excerpt-items');
  function render(){
    if(!container)return;container.replaceChildren();
    const status=document.getElementById('library-status');status.textContent=entries.length?`${entries.length} 条摘录；笔记修改后保存于当前浏览器。`:'还没有摘录。选中文章正文，点击“收藏摘录”即可加入。';
    for(const item of entries){
      const article=document.createElement('article');article.className='excerpt-item';
      const h=document.createElement('h2'),a=document.createElement('a');a.href=link(item);a.textContent=byPath.get(item.path).title;h.append(a);
      const quote=document.createElement('blockquote');quote.textContent=item.quote;
      const label=document.createElement('label');label.htmlFor=item.id;label.textContent='我的笔记';
      const note=document.createElement('textarea');note.id=item.id;note.rows=3;note.maxLength=4000;note.value=item.note;note.placeholder='记下你的理解、疑问或使用场景…';
      // Persist on each input so closing a page immediately cannot lose the last edit.
      note.addEventListener('input',()=>{item.note=note.value;item.updated=Date.now();persist();});
      const remove=document.createElement('button');remove.type='button';remove.textContent='删除摘录';remove.addEventListener('click',()=>{const old=entries;entries=entries.filter(other=>other.id!==item.id);if(!persist()){entries=old;return;}render();document.querySelector('[data-library-filter="excerpts"]')?.focus();});
      article.append(h,quote,label,note,remove);container.append(article);
    }
  }
  document.addEventListener('blog:library-excerpts',render);
  document.addEventListener('blog:export-excerpts',event=>{
    const lines=event.detail.lines;if(!Array.isArray(lines)||!entries.length)return;
    lines.push('','## 摘录与笔记','');
    for(const item of entries){lines.push(`### ${byPath.get(item.path).title}`,link(item),'',...item.quote.split('\n').map(line=>'> '+line),'',item.note?'我的笔记：\n'+item.note:'（尚未添加笔记）','');}
  });
})();
