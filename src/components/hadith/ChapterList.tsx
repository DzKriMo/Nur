'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { HadithChapter } from '@/types';

interface ChapterListProps {
    bookId: string;
    chapters: HadithChapter[];
}

export default function ChapterList({ bookId, chapters }: ChapterListProps) {
    const [query, setQuery] = useState('');
    const { t } = useLanguage();

    const filteredChapters = chapters.filter((chapter) =>
        chapter.english.toLowerCase().includes(query.toLowerCase()) ||
        chapter.arabic.includes(query)
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('hadith.search_hadiths')} // Reusing hadith search placeholder or general search
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                />
            </div>

            <div className="grid gap-4">
                {filteredChapters.length > 0 ? (
                    filteredChapters.map((chapter) => (
                        <Link
                            href={`/hadith/${bookId}/${chapter.id}`}
                            key={chapter.id}
                            className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800 hover:border-amber-200 dark:hover:border-amber-800 transition-all hover:shadow-md group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                                        {chapter.english}
                                    </h3>
                                    <p className="text-lg font-arabic text-stone-600 dark:text-stone-400 mt-1 text-right" dir="rtl">
                                        {chapter.arabic}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 text-stone-500 dark:text-stone-400">
                        No chapters found.
                    </div>
                )}
            </div>
        </div>
    );
}
