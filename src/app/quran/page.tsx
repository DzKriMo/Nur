import { getSurahs } from '@/lib/data';
import ChapterList from '@/components/quran/ChapterList';
import Link from 'next/link';

export default async function QuranPage() {
    const surahs = await getSurahs();

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center islamic-pattern rounded-3xl p-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-400 mb-4 font-arabic">
                        القرآن الكريم
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                        Read, listen, and reflect upon the words of Allah.
                    </p>
                    <div className="flex justify-center gap-3">
                        <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
                            By Surah
                        </span>
                        <Link
                            href="/quran/juz"
                            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                        >
                            By Juz
                        </Link>
                    </div>
                </header>

                <ChapterList surahs={surahs} />
            </div>
        </div>
    );
}
