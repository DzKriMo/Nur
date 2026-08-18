import { getSurahs } from '@/lib/data';
import QuranList from '@/components/quran/QuranList';
import PageHeader from '@/components/layout/PageHeader';
import QuranViewToggle from '@/components/quran/QuranViewToggle';
import LocalizedText from '@/components/layout/LocalizedText';
import Link from 'next/link';
import { Search, BookMarked } from 'lucide-react';
import { cookies } from 'next/headers';
import { getRiwayaFromCookie } from '@/lib/riwaya';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'القرآن الكريم - اقرأ واستمع',
    description: 'اقرأ واستمع للقرآن الكريم كاملاً مع الترجمة الإنجليزية والتفسير، مصحف مجوّد بصوت مشاهير القراء.',
    alternates: { canonical: '/quran' },
};

export default async function QuranPage() {
    const riwaya = getRiwayaFromCookie((await cookies()).toString());
    const surahs = await getSurahs(riwaya);

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    titleKey="quran.title"
                    subtitleKey="quran.subtitle"
                    titleClassName="text-emerald-800 dark:text-emerald-400"
                >
                    <QuranViewToggle />
                </PageHeader>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <Link
                        href="/quran/search"
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                        <Search size={15} />
                        <LocalizedText en="Search Verses" ar="بحث في الآيات" />
                    </Link>
                    <Link
                        href="/saved"
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                        <BookMarked size={15} />
                        <LocalizedText en="Saved Verses" ar="الآيات المحفوظة" />
                    </Link>
                </div>

                <QuranList surahs={surahs} />
            </div>
        </div>
    );
}