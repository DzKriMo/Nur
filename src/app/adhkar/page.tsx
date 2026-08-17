import { getAdhkarCategories } from '@/lib/data';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const categoryIcons: Record<string, string> = {
    'azkar_sabah.json': '🌅',
    'azkar_massa.json': '🌙',
    'PostPrayer_azkar.json': '🕌',
};

export default async function AdhkarPage() {
    const categories = await getAdhkarCategories();

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center islamic-pattern rounded-3xl p-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-rose-800 dark:text-rose-400 mb-4 font-arabic">
                        الأذكار
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Remember Allah in the morning, evening, and throughout your day.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            href={`/adhkar/${category.filename}`}
                            key={category.filename}
                            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    {categoryIcons[category.filename] || '❤️'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors font-arabic">
                                        {category.titleAr}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        {category.titleEn}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {category.content.length} Adhkar
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
