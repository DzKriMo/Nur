import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'نور - القرآن والحديث والأذكار',
        short_name: 'نور',
        description: 'Your companion for Quran, Hadith, and Adhkar — القراءة والاستماع والأذكار',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#059669',
        dir: 'rtl',
        lang: 'ar',
        categories: ['books', 'education', 'lifestyle'],
        icons: [
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
    };
}