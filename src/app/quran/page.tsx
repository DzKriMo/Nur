import { getSurahs } from '@/lib/data';
import ChapterList from '@/components/quran/ChapterList';

export default async function QuranPage() {
    const surahs = await getSurahs();

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-400 mb-4 font-serif">
                        The Noble Quran
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Read, listen, and reflect upon the words of Allah.
                    </p>
                </header>

                <ChapterList surahs={surahs} />
            </div>
        </div>
    );
}
