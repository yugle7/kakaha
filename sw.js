const GHPATH = "/kakaha";
const APP_PREFIX = "kakaha_";
const VERSION = "1.0.14";

const URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/style.css`,
    `${GHPATH}/data.js`,
    `${GHPATH}/script.js`,
    `${GHPATH}/sprite.svg`,
    `${GHPATH}/icon.svg`,
    `${GHPATH}/favicon.svg`,

    `${GHPATH}/icons/icon-192.png`,
    `${GHPATH}/icons/icon-512.png`,
    `${GHPATH}/icons/icon-192-maskable.png`,
    `${GHPATH}/icons/icon-512-maskable.png`
];

const CACHE_NAME = APP_PREFIX + VERSION;

// Установка — кешируем файлы и активируемся сразу
self.addEventListener("install", (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(URLS);
            self.skipWaiting();
        })()
    );
});

// Перехват запросов — сначала кеш, потом сеть (с fallback)
self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;

    const url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(e.request);

            try {
                const response = await fetch(e.request);
                if (response.ok) {
                    await cache.put(e.request, response.clone());
                }
                return response;
            } catch {
                if (cached) return cached;
                throw new Error("Offline and no cache");
            }
        })(),
    );
});

self.addEventListener("message", (e) => {
    if (e.data === "skipWaiting") {
        self.skipWaiting();
    }
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter(key => key.startsWith(APP_PREFIX) && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
            await self.clients.claim();
        })()
    );
});
