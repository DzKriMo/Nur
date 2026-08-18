import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'عن تطبيق نور',
    description: 'تطبيق نور: صدقة جارية لخدمة القرآن الكريم والحديث الشريف والأذكار، مبني بحب للأمة الإسلامية.',
    alternates: { canonical: '/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}