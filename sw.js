/* Explicitly saved articles only. Network responses are never automatically cached. */
const PAGES='wx-offline-pages-v1',ASSETS='wx-offline-assets-v1';
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(PAGES);await cache.add('/offline/');await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

// Earlier saved snapshots had a placeholder that depended on the cached script.
async function savedArticle(response) {
  const html = await response.clone().text();
  const placeholder = /(<span id="reading-time">)约 -- 分钟(<\/span>)/;
  if (!placeholder.test(html)) return response;
  const article = html.split('<div class="article-body">', 2)[1] || '';
  const prose = article.split('<div id="passage-tools"', 1)[0]
    .replace(/<(pre|figure|script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>|&(?:#x?[0-9a-f]+|[a-z]+);/gi, ' ')
    .replace(/\s+/g, ' ').trim();
  const words = prose ? prose.split(' ').length : 0;
  const minutes = Math.max(1, Math.ceil(prose.length / 500), Math.ceil(words / 230));
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html.replace(placeholder, `$1约 ${minutes} 分钟$2`), { headers });
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),8000);
    try{return await fetch(event.request,{signal:abort.signal});}
    catch(error){
      const pages=await caches.open(PAGES),assets=await caches.open(ASSETS);
      if(event.request.mode==='navigate'){
        const url=new URL(event.request.url),saved=await pages.match(url.origin+url.pathname);
        if(saved)return savedArticle(saved);
        const fallback=await pages.match('/offline/');if(fallback)return fallback;
      }
      const cached=await assets.match(event.request);if(cached)return cached;
      throw error;
    }finally{clearTimeout(timer);}
  })());
});
