import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'قصص الأنبياء وقصص القرآن',
    description: 'قصص الأنبياء عليهم السلام وقصص القرآن الكريم مع الأدلة من القرآن الكريم وصحيح البخاري.',
    alternates: { canonical: '/stories' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}