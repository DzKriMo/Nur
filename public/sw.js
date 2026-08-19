const CACHE_NAME = 'nur-app-v6';

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
    '/names',
    '/prayer',
    '/hifz',
    '/quiz',
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

// The app links to chapters with zero-padded ids (surah.index = "001"), so we
// precache the padded form. The SW match helper also normalizes unpadded urls
// (used by prev/next links) so both resolve offline.
const QURAN_PAGES = Array.from({ length: 114 }, (_, i) => `/quran/${String(i + 1).padStart(3, '0')}`);
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

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    if (client.url !== url) client.navigate(url);
                    return;
                }
            }
            return self.clients.openWindow(url);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Try to match a request against the cache, normalizing quran chapter urls
// (e.g. /quran/2 vs /quran/002 both resolve to whichever form is cached).
async function matchCached(request, url) {
    let hit = await caches.match(request);
    if (hit) return hit;

    const m = url.pathname.match(/^\/quran\/(\d+)$/);
    if (m) {
        const num = parseInt(m[1], 10);
        const candidates = [`/quran/${String(num).padStart(3, '0')}`, `/quran/${num}`];
        for (const candidate of candidates) {
            hit = await caches.match(candidate);
            if (hit) return hit;
        }
    }
    return undefined;
}

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
                .catch(() => matchCached(request, url).then((cached) => cached || caches.match('/')))
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

    // RSC payload requests for client-side navigation — network only.
    // Offline they fail, and Next.js falls back to a full page load which
    // the navigate handler resolves from the cache.
    if (url.searchParams.has('_rsc') || request.headers.get('RSC')) {
        event.respondWith(fetch(request));
        return;
    }

    // Everything else — network with cache fallback
    event.respondWith(
        fetch(request).catch(() => matchCached(request, url))
    );
});