import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'للمسلمين الجدد',
    description: 'دروس أساسية للمسلمين الجدد: الشهادتان، الوضوء، الصلاة، الصيام، والإيمان بالله مع الأدلة من القرآن والسنة.',
    alternates: { canonical: '/learn/new-muslim' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}