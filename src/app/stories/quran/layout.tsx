import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'قصص القرآن الكريم',
    description: 'قصص وردت في القرآن الكريم مع الأدلة والتفسير: أصحاب الكهف، ذو القرنين، لقمان، مريم، وغيرها.',
    alternates: { canonical: '/stories/quran' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}