const CACHE = "backstory-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/", "/manifest.webmanifest", "/icon.svg"])));
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isLargeMedia = event.request.destination === "video" || event.request.headers.has("range");
  if (event.request.method !== "GET" || url.origin !== self.location.origin || isLargeMedia) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
