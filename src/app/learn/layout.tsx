import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'تعلم الإسلام',
    description: 'تعلم أساسيات الإسلام بطريقة مبسطة للمسلمين الجدد وللأطفال مع الأدلة من القرآن الكريم وصحيح البخاري.',
    alternates: { canonical: '/learn' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}