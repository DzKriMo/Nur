import { getAdhkar } from '@/lib/data';
import AdhkarCard from '@/components/adhkar/AdhkarCard';
import AdhkarProgress from '@/components/adhkar/AdhkarProgress';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{
        filename: string;
    }>;
}

export default async function AdhkarCategoryPage({ params }: PageProps) {
    const { filename } = await params;
    const category = await getAdhkar(filename);

    return (
        <div className="min-h-screen bg-rose-50/50 dark:bg-slate-950 pb-20">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                    <Link
                        href="/adhkar"
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span className="hidden sm:inline">Back to Categories</span>
                    </Link>
                    <div className="text-center min-w-0 flex-1 mx-4">
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white font-arabic truncate">{category.titleAr}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{category.content.length} Adhkar</p>
                    </div>
                    <div className="w-20" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
                <AdhkarProgress totalItems={category.content.length} categoryFilename={filename} />

                {category.content.map((item, index) => (
                    <AdhkarCard
                        key={index}
                        item={item}
                        index={index}
                        categoryFilename={filename}
                        totalItems={category.content.length}
                    />
                ))}
            </main>
        </div>
    );
}
