const CACHE_NAME = "michelin-next-gen-v3";
const PRECACHE_URLS = [
  "/",
  "/discover",
  "/map",
  "/offline",
  "/manifest.webmanifest",
  "/icons/pwa-192.png",
  "/icons/pwa-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/maskable-icon.svg",
  "/icons/Etoile_Michelin-1.png",
  "/splash/apple-splash-1170x2532.png",
  "/splash/apple-splash-1290x2796.png",
  "/splash/apple-splash-1536x2048.png"
];

async function putInCache(request, response) {
  if (!response || !response.ok) {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    return;
  }

  if (
    url.origin === self.location.origin &&
    ["/login", "/register", "/profile", "/social"].some(
      (pathname) => url.pathname === pathname || url.pathname.startsWith(`${pathname}/`)
    )
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => putInCache(request, response))
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match("/offline") || caches.match("/")
          )
        )
    );
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/image")) {
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkRequest = fetch(request)
          .then((response) => putInCache(request, response))
          .catch(() => cached);

        return cached || networkRequest;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => putInCache(request, response));
    })
  );
});
