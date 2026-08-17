'use client';

import Link from 'next/link';
import { Book, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 font-serif tracking-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quran"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              {t('common.read')} {t('nav.quran')} <ArrowRight size={20} />
            </Link>
            <Link
              href="/chat"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {t('nav.chat')}
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/quran" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Book size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('nav.quran')}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.features.quran')}
            </p>
          </Link>

          <Link href="/hadith" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-500 mb-6 group-hover:scale-110 transition-transform">
              <Book size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('nav.hadith')}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.features.hadith')}
            </p>
          </Link>

          <Link href="/adhkar" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-110 transition-transform">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('nav.adhkar')}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.features.adhkar')}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
