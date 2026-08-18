const CACHE_NAME = 'nur-app-v2';

// Lightweight, essential content precached at install so it works offline by default:
// app shell + full Quran text (114 surah pages) + adhkar categories.
// Audios and hadith books are intentionally NOT precached — they are large and
// cached at runtime only as the user actually uses them.
const APP_SHELL = [
    '/',
    '/quran',
    '/quran/juz',
    '/quran/search',
    '/hadith',
    '/adhkar',
    '/prayer',
    '/stories',
    '/stories/prophets',
    '/stories/quran',
    '/learn',
    '/learn/kids',
    '/learn/new-muslim',
    '/chat',
    '/about',
    '/saved',
];

const QURAN_PAGES = Array.from({ length: 114 }, (_, i) => `/quran/${i + 1}`);
const ADHKAR_PAGES = [
    '/adhkar/azkar_sabah.json',
    '/adhkar/azkar_massa.json',
    '/adhkar/PostPrayer_azkar.json',
];

const PRECACHE = [...APP_SHELL, ...QURAN_PAGES, ...ADHKAR_PAGES];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Precache in small batches so one failure doesn't break the whole install.
            const BATCH = 10;
            for (let i = 0; i < PRECACHE.length; i += BATCH) {
                await Promise.all(
                    PRECACHE.slice(i, i + BATCH).map((url) =>
                        cache.add(url).catch(() => {})
                    )
                );
            }
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Never cache API calls or the chat endpoint
    if (url.pathname.startsWith('/api/')) return;

    // App navigation — network first, fallback to cached shell
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
        );
        return;
    }

    // Static assets (_next, images, audio) — cache first, then network
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/audio/') ||
        url.pathname.startsWith('/og.jpg') ||
        url.pathname.startsWith('/icon.svg')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Everything else — network with cache fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});