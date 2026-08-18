import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'قصص الأنبياء',
    description: 'قصص الأنبياء عليهم السلام من آدم إلى محمد ﷺ مع الأدلة من القرآن الكريم وصحيح البخاري.',
    alternates: { canonical: '/stories/prophets' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}