import { getSurahs } from '@/lib/data';
import ChapterList from '@/components/quran/ChapterList';
import PageHeader from '@/components/layout/PageHeader';
import QuranViewToggle from '@/components/quran/QuranViewToggle';

export default async function QuranPage() {
    const surahs = await getSurahs();

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

                <ChapterList surahs={surahs} />
            </div>
        </div>
    );
}