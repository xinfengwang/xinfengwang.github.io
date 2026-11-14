/* Explicitly saved articles only. Network responses are never automatically cached. */
const PAGES='wx-offline-pages-v1',ASSETS='wx-offline-assets-v1';
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(PAGES);await cache.add('/offline/');await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),8000);
    try{return await fetch(event.request,{signal:abort.signal});}
    catch(error){
      const pages=await caches.open(PAGES),assets=await caches.open(ASSETS);
      if(event.request.mode==='navigate'){
        const url=new URL(event.request.url),saved=await pages.match(url.origin+url.pathname);
        if(saved)return saved;
        const fallback=await pages.match('/offline/');if(fallback)return fallback;
      }
      const cached=await assets.match(event.request);if(cached)return cached;
      throw error;
    }finally{clearTimeout(timer);}
  })());
});
