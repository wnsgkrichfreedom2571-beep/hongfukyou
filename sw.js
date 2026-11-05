// 오프라인 대비 캐시: 항상 최신 파일을 먼저 받고, 인터넷이 끊기면 저장된 파일을 씁니다.
const CACHE = "hfy-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./icon.png", "./manifest.webmanifest"]).catch(() => {}))); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.includes("firestore.googleapis.com") || url.hostname.includes("identitytoolkit") || url.hostname.includes("securetoken")) return;
  e.respondWith(fetch(req).then(res => {
    if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
});
