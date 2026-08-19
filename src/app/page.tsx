'use client';

import Link from 'next/link';
import { Book, BookOpenText, Heart, MessageCircle, ArrowRight, Clock, Scroll, GraduationCap, Sparkles, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import HomeDashboard from '@/components/home/HomeDashboard';
import { Crescent, KhatamStar, OrnamentDivider } from '@/components/layout/Ornament';
import { cn } from '@/lib/utils';

export default function Home() {
    const { t, dir } = useLanguage();

    const features = [
        { href: '/quran', icon: Book, color: 'emerald', title: t('nav.quran'), desc: t('home.features.quran') },
        { href: '/hifz', icon: BookOpenText, color: 'gold', title: t('nav.hifz'), desc: t('home.features.hifz') },
        { href: '/quiz', icon: Brain, color: 'emerald', title: t('nav.quiz'), desc: t('home.features.quiz') },
        { href: '/hadith', icon: MessageCircle, color: 'amber', title: t('nav.hadith'), desc: t('home.features.hadith') },
        { href: '/adhkar', icon: Heart, color: 'rose', title: t('nav.adhkar'), desc: t('home.features.adhkar') },
        { href: '/names', icon: Sparkles, color: 'gold', title: t('nav.names'), desc: t('home.features.names') },
        { href: '/stories', icon: Scroll, color: 'violet', title: t('nav.stories'), desc: t('stories.subtitle') },
        { href: '/learn', icon: GraduationCap, color: 'sky', title: t('nav.learn'), desc: t('learn.subtitle') },
        { href: '/chat', icon: MessageCircle, color: 'emerald', title: t('nav.chat'), desc: t('home.features.chat') },
        { href: '/prayer', icon: Clock, color: 'amber', title: t('nav.prayer'), desc: t('home.features.prayer') },
    ];

    const colorMap: Record<string, { bg: string; icon: string; hover: string }> = {
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-700 dark:text-emerald-400', hover: 'group-hover:bg-emerald-700 group-hover:text-gold-200' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-700 dark:text-amber-500', hover: 'group-hover:bg-amber-600 group-hover:text-white' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', icon: 'text-rose-700 dark:text-rose-400', hover: 'group-hover:bg-rose-600 group-hover:text-white' },
        violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', icon: 'text-violet-700 dark:text-violet-400', hover: 'group-hover:bg-violet-600 group-hover:text-white' },
        sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', icon: 'text-sky-700 dark:text-sky-400', hover: 'group-hover:bg-sky-600 group-hover:text-white' },
        gold: { bg: 'bg-gold-500/15 dark:bg-gold-500/10', icon: 'text-gold-600 dark:text-gold-300', hover: 'group-hover:bg-gold-500 group-hover:text-white' },
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 md:pt-24 pb-16 md:pb-32 px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-0 pattern-khatam" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-24 right-1/4 w-64 h-64 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-2xl -z-10" />
                <div className="absolute top-40 left-1/4 w-48 h-48 gold-glow -z-10" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-6 md:mb-8 flex flex-col items-center">
                        {/* Mihrab arch brand emblem */}
                        <div className="relative mb-8 md:mb-10">
                            <div className="arch relative w-36 h-40 md:w-44 md:h-48 border-2 border-gold-500/60 bg-gradient-to-b from-parchment-100 via-white to-parchment-100 dark:from-night-800 dark:via-night-900 dark:to-night-800 shadow-xl shadow-gold-500/10 flex items-center justify-center">
                                <span className="absolute inset-1.5 arch border border-gold-500/40" />
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-gold-500 drop-shadow-md">
                                    <Crescent size={52} />
                                </span>
                                <span className="relative font-arabic text-5xl md:text-6xl font-bold text-gold-gradient">
                                    نور
                                </span>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gold-500/80">
                                    <KhatamStar size={14} />
                                </span>
                            </div>
                        </div>

                        <span className="inline-block px-4 py-1.5 bg-gold-500/10 text-gold-700 dark:text-gold-300 text-xs md:text-sm font-medium rounded-full border border-gold-500/40 mb-4 md:mb-6">
                            {t('home.badge')}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display tracking-wide">
                        {t('home.hero.title')}
                    </h1>
                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>

                    <OrnamentDivider className="max-w-sm mx-auto mb-8 md:mb-10" />

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4" dir="ltr">
                        <Link
                            href="/quran"
                            className="gold-shimmer w-full sm:w-auto px-6 md:px-8 py-4 text-white rounded-full font-medium transition-all hover:shadow-xl hover:shadow-gold-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            {t('home.hero.read_quran')} <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        </Link>
                        <Link
                            href="/chat"
                            className="w-full sm:w-auto px-6 md:px-8 py-4 bg-white dark:bg-night-900 text-slate-900 dark:text-white border border-slate-200 dark:border-gold-500/30 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-gold-500/10 hover:-translate-y-1"
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
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 font-display tracking-wide">{t('home.features.title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-5">{t('home.features.subtitle')}</p>
                        <OrnamentDivider className="max-w-[220px] mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const colors = colorMap[feature.color];
                        const Icon = feature.icon;
                        return (
                            <Link key={feature.href} href={feature.href} className="group relative bg-white dark:bg-night-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={cn(
                                    "absolute top-4 right-4 text-gold-500/0 group-hover:text-gold-500/70 transition-colors",
                                    dir === 'rtl' ? 'rotate-0' : ''
                                )}>
                                    <KhatamStar size={14} />
                                </span>
                                <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.icon} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
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