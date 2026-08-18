import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'بحث في القرآن الكريم',
    description: 'ابحث في جميع آيات القرآن الكريم بالعربية والإنجليزية.',
    alternates: { canonical: '/quran/search' },
};

export default function QuranSearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
