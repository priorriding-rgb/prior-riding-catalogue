// PRIOR RIDING native/web cache reset service worker v4
const CACHE = "pwabuilder-page-v4";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
      await caches.open(CACHE);
    } finally {
      self.skipWaiting();
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate") return;
  event.respondWith((async () => {
    try {
      return await fetch(event.request, { cache: "no-store" });
    } catch (e) {
      const cache = await caches.open(CACHE);
      return cache.match("index.html");
    }
  })());
});
