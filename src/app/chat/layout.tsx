import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'المساعد الإسلامي الذكي',
    description: 'اسأل المساعد الإسلامي الذكي عن أي سؤال في الدين: الفقه، التفسير، السيرة، وأحكام العبادات.',
    alternates: { canonical: '/chat' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}