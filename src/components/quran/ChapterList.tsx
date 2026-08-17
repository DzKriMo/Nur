'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurahMeta } from '@/types';
import { Search } from 'lucide-react';

interface ChapterListProps {
    surahs: SurahMeta[];
}

export default function ChapterList({ surahs }: ChapterListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSurahs = surahs.filter((surah) => {
        const query = searchQuery.toLowerCase();
        return (
            surah.title.toLowerCase().includes(query) ||
            surah.titleAr.includes(query) ||
            surah.index.toString().includes(query)
        );
    });

    return (
        <div className="space-y-8">
            <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search Surah (e.g., Al-Fatiha, 1, الفاتحة)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurahs.map((surah) => (
                    <Link
                        href={`/quran/${surah.index}`}
                        key={surah.index}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-serif text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {parseInt(surah.index)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {surah.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {surah.titleAr}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">
                                    {surah.type}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {surah.count} Verses
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredSurahs.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-12">
                    No surahs found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
}
