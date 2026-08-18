import { getAdhkarCategories } from '@/lib/data';
import PageHeader from '@/components/layout/PageHeader';
import AdhkarCategoryCard from '@/components/adhkar/AdhkarCategoryCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'الأذكار',
    description: 'أذكار الصباح والمساء وأذكار ما بعد الصلاة مع عدّاد تفاعلي وأدلة من القرآن والسنة.',
    alternates: { canonical: '/adhkar' },
};

export default async function AdhkarPage() {
    const categories = await getAdhkarCategories();

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    titleKey="adhkar.title"
                    subtitleKey="adhkar.subtitle"
                    titleClassName="text-rose-800 dark:text-rose-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <AdhkarCategoryCard key={category.filename} category={category} />
                    ))}
                </div>
            </div>
        </div>
    );
}