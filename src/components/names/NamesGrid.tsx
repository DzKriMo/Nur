'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { NameOfAllah } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrnamentDivider } from '@/components/layout/Ornament';

export default function NamesGrid({ names }: { names: NameOfAllah[] }) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return names;
        return names.filter(
            (n) =>
                n.arabic.includes(q) ||
                n.transliteration.toLowerCase().includes(q) ||
                n.meaning.toLowerCase().includes(q) ||
                String(n.number) === q
        );
    }, [names, query]);

    return (
        <div>
            <div className="max-w-md mx-auto mb-8">
                <label className="relative block">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('names.search')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </label>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t('names.showing')}: {filtered.length} / {names.length}
            </p>

            {filtered.length === 0 ? (
                <p className="text-center text-slate-400 py-10">{t('names.no_results')}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((name) => (
                        <div
                            key={name.number}
                            className="relative bg-white dark:bg-night-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-gold-500/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-300 font-medium text-xs">
                                    {name.number}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-300 dark:text-slate-600 group-hover:text-gold-500/70 transition-colors">
                                    {name.transliteration}
                                </span>
                            </div>
                            <p className="text-2xl text-emerald-800 dark:text-emerald-300 font-arabic text-center leading-relaxed mb-3">
                                {name.arabic}
                            </p>
                            <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <OrnamentDivider />
                            </div>
                            <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300 leading-snug">
                                {name.meaning}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}