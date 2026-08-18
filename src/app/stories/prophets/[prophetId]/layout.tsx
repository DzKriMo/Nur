import type { Metadata } from 'next';
import { prophetsStories } from '@/data/stories/prophets';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ prophetId: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { prophetId } = await params;
    const prophet = prophetsStories.find(p => p.id === prophetId);
    if (!prophet) return {};
    return {
        title: `قصة ${prophet.nameAr} ${prophet.titleAr}`,
        description: `قصة ${prophet.nameAr} (${prophet.titleAr}) مع الأدلة من القرآن الكريم وصحيح البخاري والعبر والدروس المستفادة.`,
        alternates: { canonical: `/stories/prophets/${prophetId}` },
    };
}

export default function Layout({ children }: LayoutProps) {
    return <>{children}</>;
}