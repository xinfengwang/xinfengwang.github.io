(() => {
  'use strict';
  const PAGES='wx-offline-pages-v1',ASSETS='wx-offline-assets-v1',INDEX='/wx-offline-index.json';
  const catalogNode=document.getElementById('reading-catalog');let catalog=[];
  try{catalog=JSON.parse(catalogNode?.textContent||'[]');}catch(_){}
  const byPath=new Map(catalog.map(post=>[post.url,post]));
  const list=document.getElementById('offline-list'),status=document.getElementById('offline-status'),save=document.getElementById('reader-offline');
  const saved=document.querySelector('meta[name="wx-offline-saved"]');
  if(saved){const banner=document.createElement('aside');banner.className='offline-version';banner.textContent='离线保存版本 · 保存于 '+new Date(saved.content).toLocaleString('zh-CN')+'。联网后重新打开可获取最新版。';document.querySelector('.article-header')?.after(banner);}
  const supported='serviceWorker' in navigator&&'caches' in window&&window.isSecureContext;
  if(!supported){if(save){save.disabled=true;save.title='当前浏览器不支持离线保存';}if(status)status.textContent='当前浏览器不支持离线保存。';return;}
  async function index(){const cache=await caches.open(PAGES),response=await cache.match(INDEX);if(!response)return {};const value=await response.json();return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
  async function writeIndex(value){const cache=await caches.open(PAGES);await cache.put(INDEX,new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}}));}
  async function render(){
    if(!list)return;
    try{
      const records=await index();list.replaceChildren();const valid=Object.entries(records).filter(([path,item])=>byPath.has(path)&&item&&typeof item.saved==='string');
      status.textContent=valid.length?`${valid.length} 篇手动保存的文章。`:'还没有保存文章。联网时进入文章页，点击“离线保存”。';
      for(const [path,item] of valid){
        const article=document.createElement('article');article.className='library-item';const h=document.createElement('h2'),link=document.createElement('a');link.href=path;link.textContent=byPath.get(path).title;h.append(link);
        const note=document.createElement('p');note.textContent='保存于 '+new Date(item.saved).toLocaleString('zh-CN')+(item.missing?' · 有素材未保存':'');
        const remove=document.createElement('button');remove.type='button';remove.textContent='删除离线副本';remove.addEventListener('click',async()=>{
          remove.disabled=true;try{const current=await index(),old=current[path];delete current[path];await writeIndex(current);const pages=await caches.open(PAGES);await pages.delete(new URL(path,location.origin).href);const used=new Set(Object.values(current).flatMap(record=>Array.isArray(record.assets)?record.assets:[]));const assets=await caches.open(ASSETS);for(const url of old?.assets||[])if(!used.has(url))await assets.delete(url);await render();}catch(_){status.textContent='删除失败，请重试。';remove.disabled=false;}
        });article.append(h,note,remove);list.append(article);
      }
    }catch(_){status.textContent='暂时无法读取本机离线记录。';}
  }
  render();
  if(!save||!byPath.has(location.pathname))return;
  save.addEventListener('click',async()=>{
    const note=document.getElementById('offline-save-status');save.disabled=true;note.textContent='正在保存正文和素材…';
    try{
      await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
      const canonical=new URL(location.pathname,location.origin).href,response=await fetch(canonical,{cache:'reload'});if(!response.ok)throw Error('Page unavailable');
      const doc=new DOMParser().parseFromString(await response.text(),'text/html');
      const rendered=[...document.querySelectorAll('.article-body .mermaid svg')];
      doc.querySelectorAll('pre code.language-mermaid').forEach((code,i)=>{if(!rendered[i])return;const wrap=doc.createElement('div');wrap.className='mermaid';wrap.append(doc.importNode(rendered[i],true));code.closest('pre').replaceWith(wrap);});
      // Rendered diagrams are saved as SVG; unresolved ones remain readable source code.
      doc.querySelectorAll('script[type="module"]').forEach(script=>script.remove());
      const time=new Date().toISOString(),meta=doc.createElement('meta');meta.name='wx-offline-saved';meta.content=time;doc.head.append(meta);
      const sources=new Set([...doc.querySelectorAll('link[rel="stylesheet"],script[src]')].map(node=>new URL(node.getAttribute('href')||node.getAttribute('src'),canonical).href));
      const images=[...doc.querySelectorAll('.article-body img')].map(img=>new URL(img.getAttribute('src'),canonical).href);images.forEach(url=>sources.add(url));
      const assets=await caches.open(ASSETS),savedAssets=[];let missing=0;
      const pending=[...sources];
      for(let i=0;i<pending.length;i++){
        const url=pending[i],same=new URL(url).origin===location.origin,abort=new AbortController(),timer=setTimeout(()=>abort.abort(),15000);
        if(!/^https?:/.test(url))continue;
        try{
          const result=await fetch(url,{cache:'reload',mode:same?'same-origin':'no-cors',signal:abort.signal});if(!result.ok&&result.type!=='opaque')throw Error('Asset unavailable');
          if(same&&url.split('?')[0].endsWith('.css')){
            const css=await result.clone().text();for(const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)){if(match[1].startsWith('data:'))continue;const child=new URL(match[1],url).href;if(!sources.has(child)){sources.add(child);pending.push(child);}}
          }
          await assets.put(url,result);savedAssets.push(url);
        }catch(error){if(same&&!images.includes(url))throw error;missing++;}
        finally{clearTimeout(timer);}
        note.textContent=`正在保存素材 ${i+1} / ${pending.length}…`;
      }
      const pages=await caches.open(PAGES);await pages.put(canonical,new Response('<!doctype html>\n'+doc.documentElement.outerHTML,{headers:{'Content-Type':'text/html;charset=utf-8'}}));
      const records=await index();records[location.pathname]={saved:time,assets:savedAssets,missing};await writeIndex(records);
      note.textContent=missing?`正文已保存，${missing} 个图片素材未能保存，离线时可能缺图。`:'已保存，可在“离线文章”中查看和删除。';save.textContent='更新离线副本';
    }catch(_){note.textContent='未能完整保存，请保持联网后重试，并到离线文章检查保存状态。';}
    finally{save.disabled=false;}
  });
})();
