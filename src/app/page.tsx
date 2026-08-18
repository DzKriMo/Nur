'use client';

import Link from 'next/link';
import { Book, Heart, MessageCircle, ArrowRight, Clock, Scroll, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import HomeDashboard from '@/components/home/HomeDashboard';

export default function Home() {
    const { t, dir } = useLanguage();

    const features = [
        { href: '/quran', icon: Book, color: 'emerald', title: t('nav.quran'), desc: t('home.features.quran') },
        { href: '/hadith', icon: MessageCircle, color: 'amber', title: t('nav.hadith'), desc: t('home.features.hadith') },
        { href: '/adhkar', icon: Heart, color: 'rose', title: t('nav.adhkar'), desc: t('home.features.adhkar') },
        { href: '/stories', icon: Scroll, color: 'violet', title: t('nav.stories'), desc: t('stories.subtitle') },
        { href: '/learn', icon: GraduationCap, color: 'sky', title: t('nav.learn'), desc: t('learn.subtitle') },
        { href: '/chat', icon: MessageCircle, color: 'emerald', title: t('nav.chat'), desc: t('home.features.chat') },
        { href: '/prayer', icon: Clock, color: 'amber', title: t('nav.prayer'), desc: t('home.features.prayer') },
    ];

    const colorMap: Record<string, { bg: string; icon: string; hover: string }> = {
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', hover: 'group-hover:bg-emerald-600 group-hover:text-white' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-500', hover: 'group-hover:bg-amber-600 group-hover:text-white' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', icon: 'text-rose-600 dark:text-rose-400', hover: 'group-hover:bg-rose-600 group-hover:text-white' },
        violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', icon: 'text-violet-600 dark:text-violet-400', hover: 'group-hover:bg-violet-600 group-hover:text-white' },
        sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', icon: 'text-sky-600 dark:text-sky-400', hover: 'group-hover:bg-sky-600 group-hover:text-white' },
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 md:pt-24 pb-16 md:pb-32 px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-0 islamic-star-bg" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-2xl -z-10" />
                <div className="absolute top-40 left-1/4 w-48 h-48 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-2xl -z-10" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-6 md:mb-8">
                        <span className="inline-block px-4 py-1.5 bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-medium rounded-full border border-emerald-200 dark:border-emerald-800 mb-4 md:mb-6">
                            {t('home.badge')}
                        </span>
                        <div>
                            <span className="font-arabic text-5xl md:text-8xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                نور
                            </span>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                        {t('home.hero.title')}
                    </h1>
                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4" dir="ltr">
                        <Link
                            href="/quran"
                            className="w-full sm:w-auto px-6 md:px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            {t('home.hero.read_quran')} <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        </Link>
                        <Link
                            href="/chat"
                            className="w-full sm:w-auto px-6 md:px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            {t('home.hero.ai_chat')}
                        </Link>
                    </div>
                </div>
            </section>

            <HomeDashboard />

            {/* Features Grid */}
            <section className="px-4 md:px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">{t('home.features.title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('home.features.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const colors = colorMap[feature.color];
                        const Icon = feature.icon;
                        return (
                            <Link key={feature.href} href={feature.href} className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.icon} mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </Link>
                        );
                    })}
                    </div>
                </div>
            </section>
        </div>
    );
}
