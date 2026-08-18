import { getSurahs } from '@/lib/data';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import LocalizedText from '@/components/layout/LocalizedText';

interface JuzInfo {
    index: string;
    surahs: { index: string; title: string; titleAr: string; verseStart: string; verseEnd: string }[];
}

export default async function JuzListPage() {
    const surahs = await getSurahs();

    // Group surahs by juz
    const juzMap = new Map<string, JuzInfo>();
    for (let i = 1; i <= 30; i++) {
        juzMap.set(i.toString().padStart(2, '0'), { index: i.toString().padStart(2, '0'), surahs: [] });
    }

    for (const surah of surahs) {
        for (const juz of surah.juz) {
            const juzInfo = juzMap.get(juz.index);
            if (juzInfo) {
                juzInfo.surahs.push({
                    index: surah.index,
                    title: surah.title,
                    titleAr: surah.titleAr,
                    verseStart: juz.verse.start,
                    verseEnd: juz.verse.end,
                });
            }
        }
    }

    const juzList = Array.from(juzMap.values()).filter(j => j.surahs.length > 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center">
                    <Link
                        href="/quran"
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span><LocalizedText en="Back to Surahs" ar="رجوع للسور" /></span>
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-8 text-center font-arabic">
                    <LocalizedText en="Juz' Index" ar="الأجزاء" />
                </h1>

                <div className="space-y-4">
                    {juzList.map((juz) => (
                        <div key={juz.index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-serif text-lg">
                                    {parseInt(juz.index)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                                        <LocalizedText en={`Juz ${parseInt(juz.index)}`} ar={`الجزء ${parseInt(juz.index)}`} />
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        <LocalizedText en={`${juz.surahs.length} Surahs`} ar={`${juz.surahs.length} سور`} />
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {juz.surahs.map((surah) => (
                                    <Link
                                        href={`/quran/${surah.index}`}
                                        key={surah.index}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                {parseInt(surah.index)}.
                                            </span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {surah.title}
                                            </span>
                                            <span className="text-sm font-arabic text-slate-500 dark:text-slate-400">
                                                {surah.titleAr}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}