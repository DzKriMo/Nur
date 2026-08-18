import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'محفوظاتك',
    description: 'آيات القرآن والأحاديث المحفوظة في حسابك.',
    alternates: { canonical: '/saved' },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
    return children;
}