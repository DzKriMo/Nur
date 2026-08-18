import { getHadithBooks } from '@/lib/data';
import BookList from '@/components/hadith/BookList';
import GlobalHadithSearch from '@/components/hadith/GlobalHadithSearch';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeading from '@/components/layout/SectionHeading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'كتب الحديث الشريف',
    description: 'تصفح كتب الحديث التسعة (صحيح البخاري، صحيح مسلم) والأربعين النووية وغيرها مع الترجمة العربية والإنجليزية.',
    alternates: { canonical: '/hadith' },
};

export default async function HadithPage() {
    const [majorBooks, fortyBooks, otherBooks] = await Promise.all([
        getHadithBooks('major'),
        getHadithBooks('forty'),
        getHadithBooks('other'),
    ]);

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    titleKey="hadith.title"
                    subtitleKey="hadith.subtitle"
                    titleClassName="text-amber-800 dark:text-amber-500"
                />

                <GlobalHadithSearch />

                <div className="space-y-12">
                    <section>
                        <SectionHeading titleKey="hadith.major_books" />
                        <BookList books={majorBooks} />
                    </section>
                    <section>
                        <SectionHeading titleKey="hadith.forty_books" />
                        <BookList books={fortyBooks} />
                    </section>
                    <section>
                        <SectionHeading titleKey="hadith.other_books" />
                        <BookList books={otherBooks} />
                    </section>
                </div>
            </div>
        </div>
    );
}