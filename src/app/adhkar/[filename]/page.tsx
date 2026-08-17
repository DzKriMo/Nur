import { getAdhkar } from '@/lib/data';
import AdhkarCard from '@/components/adhkar/AdhkarCard';
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
        <div className="min-h-screen bg-rose-50 dark:bg-slate-950 pb-20">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/adhkar"
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Categories</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white">{category.title}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{category.content.length} Adhkar</p>
                    </div>
                    <div className="w-24" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {category.content.map((item, index) => (
                    <AdhkarCard key={index} item={item} />
                ))}
            </main>
        </div>
    );
}
