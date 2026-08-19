import type { Metadata } from 'next';
import { getNames } from '@/lib/data';
import NamesGrid from '@/components/names/NamesGrid';
import PageHeader from '@/components/layout/PageHeader';
import { OrnamentDivider } from '@/components/layout/Ornament';

export const metadata: Metadata = {
    title: 'أسماء الله الحسنى - 99 اسماً',
    description: 'أسماء الله الحسنى التسعة والتسعون مع الترجمة والكتابة العربية، من أراد أن يحصيها دخل الجنة.',
    alternates: { canonical: '/names' },
};

export default async function NamesPage() {
    const names = await getNames();

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    titleKey="names.title"
                    subtitleKey="names.subtitle"
                    titleClassName="text-gold-700 dark:text-gold-400"
                />

                <div className="max-w-2xl mx-auto mb-10 rounded-2xl bg-gradient-to-br from-gold-500/10 via-transparent to-emerald-500/10 border border-gold-500/30 dark:border-gold-500/20 px-6 py-5 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        «إنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Prophet Muhammad ﷺ — Sahih al-Bukhari 2736
                    </p>
                    <div className="mt-4 max-w-xs mx-auto">
                        <OrnamentDivider />
                    </div>
                </div>

                <NamesGrid names={names} />
            </div>
        </div>
    );
}