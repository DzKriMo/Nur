'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Scroll } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StoriesPage() {
    const { t, dir } = useLanguage();

    const categories = [
        {
            href: '/stories/prophets',
            icon: Scroll,
            title: t('stories.prophets'),
            desc: t('stories.prophets_desc'),
            color: 'emerald',
            count: '25+'
        },
        {
            href: '/stories/quran',
            icon: BookOpen,
            title: t('stories.quran_stories'),
            desc: t('stories.quran_stories_desc'),
            color: 'violet',
            count: '9+'
        }
    ];

    const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
        violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
    };

    return (
        <div className="min-h-screen bg-parchment-50 dark:bg-night-950 pt-20 md:pt-24 px-4 pb-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('stories.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {t('stories.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {categories.map((cat) => {
                        const colors = colorMap[cat.color];
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className={`bg-white dark:bg-night-900 p-8 rounded-2xl border ${colors.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group`}
                            >
                                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.icon} mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-3">{cat.desc}</p>
                                <span className={`inline-flex items-center gap-1 text-xs font-medium ${colors.icon}`}>
                                    {cat.count} {t('stories.read_more')}
                                    {dir === 'rtl' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
