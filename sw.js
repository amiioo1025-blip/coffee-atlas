/* 커피 품종 도감 — 오프라인 담당 (make-webapp.py 가 만든다. 직접 고치지 말 것)
   본문(index.html)은 인터넷이 되면 새 판을 먼저, 안 되면 담아 둔 판을.
   글꼴 · 아이콘은 담아 둔 것을 바로. 다른 사이트(소식 사진 등)는 건드리지 않는다. */
var CACHE = "coffee-atlas-79aca55cf2";
var FILES = ["./", "fonts/DMSansopszwght.woff2", "fonts/Newsreader-Italicopszwght.woff2", "fonts/Newsreaderopszwght.woff2", "fonts/NotoSansKRwght.woff2", "fonts/NotoSerifKRwght.woff2", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("coffee-atlas-") === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put("./", copy); });
      return res;
    }).catch(function () { return caches.match("./"); }));
    return;
  }
  e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r); }));
});
