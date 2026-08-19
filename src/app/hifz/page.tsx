import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getSurahs } from '@/lib/data';
import { getRiwayaFromCookie } from '@/lib/riwaya';
import HifzDashboard from '@/components/hifz/HifzDashboard';
import HifzReminder from '@/components/hifz/HifzReminder';
import PageHeader from '@/components/layout/PageHeader';
import { OrnamentDivider } from '@/components/layout/Ornament';

export const metadata: Metadata = {
    title: 'رحلة الحفظ - إحصائياتك',
    description: 'تتبّع تقدمك في حفظ القرآن الكريم: الإنجازات اليومية، سلسلة المواظبة، إتقان السور، والمراجعات المستحقة.',
    alternates: { canonical: '/hifz' },
};

export default async function HifzPage() {
    const riwaya = getRiwayaFromCookie((await cookies()).toString());
    const surahs = await getSurahs(riwaya);

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    titleKey="hifz.title"
                    subtitleKey="hifz.subtitle"
                    titleClassName="text-emerald-800 dark:text-emerald-400"
                />

                <div className="max-w-2xl mx-auto mb-8 rounded-2xl bg-gradient-to-br from-gold-500/10 via-transparent to-emerald-500/10 border border-gold-500/30 dark:border-gold-500/20 px-6 py-5 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Prophet Muhammad ﷺ — Sahih al-Bukhari 5027
                    </p>
                    <div className="mt-4 max-w-xs mx-auto">
                        <OrnamentDivider />
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mb-8">
                    <HifzReminder />
                </div>

                <HifzDashboard surahs={surahs} />
            </div>
        </div>
    );
}