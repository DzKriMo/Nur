import type { Metadata } from 'next';
import { quranStories } from '@/data/stories/quran';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ storyId: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { storyId } = await params;
    const story = quranStories.find(s => s.id === storyId);
    if (!story) return {};
    return {
        title: `قصة ${story.titleAr}`,
        description: `قصة ${story.titleAr} من القرآن الكريم (${story.surahAr}) مع الأدلة والعبر المستفادة.`,
        alternates: { canonical: `/stories/quran/${storyId}` },
    };
}

export default function Layout({ children }: LayoutProps) {
    return <>{children}</>;
}