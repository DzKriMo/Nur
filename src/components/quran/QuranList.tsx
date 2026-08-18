'use client';

import { useBookmarks } from '@/contexts/BookmarksContext';
import ChapterList from '@/components/quran/ChapterList';
import { SurahMeta } from '@/types';

export default function QuranList({ surahs }: { surahs: SurahMeta[] }) {
    const { lastRead } = useBookmarks();
    return <ChapterList surahs={surahs} lastRead={lastRead} />;
}