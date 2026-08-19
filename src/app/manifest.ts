import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'نور - القرآن والحديث والأذكار',
        short_name: 'نور',
        description: 'Your companion for Quran, Hadith, and Adhkar — القراءة والاستماع والأذكار',
        id: '/',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        background_color: '#faf6ec',
        theme_color: '#059669',
        dir: 'rtl',
        lang: 'ar',
        categories: ['books', 'education', 'lifestyle'],
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
    };
}