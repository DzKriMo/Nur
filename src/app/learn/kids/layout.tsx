import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'تعليم الأطفال',
    description: 'دروس تعليمية مبسطة للأطفال عن الإسلام مع الأدلة من القرآن الكريم وصحيح البخاري.',
    alternates: { canonical: '/learn/kids' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}