'use client';

import Link from 'next/link';
import { BookOpen, Baby } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LearnPage() {
    const { t } = useLanguage();

    const modes = [
        {
            href: '/learn/new-muslim',
            icon: BookOpen,
            title: t('learn.new_convert'),
            desc: t('learn.new_convert_desc'),
            color: 'emerald'
        },
        {
            href: '/learn/kids',
            icon: Baby,
            title: t('learn.kids_mode'),
            desc: t('learn.kids_mode_desc'),
            color: 'violet'
        }
    ];

    const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
        violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('learn.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {t('learn.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {modes.map((mode) => {
                        const colors = colorMap[mode.color];
                        const Icon = mode.icon;
                        return (
                            <Link
                                key={mode.href}
                                href={mode.href}
                                className={`bg-white dark:bg-slate-900 p-8 rounded-2xl border ${colors.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center`}
                            >
                                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.icon} mx-auto mb-4`}>
                                    <Icon size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{mode.title}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{mode.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
