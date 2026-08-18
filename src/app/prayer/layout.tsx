import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'أوقات الصلاة',
    description: 'اعرف مواقيت الصلاة اليومية: الفجر، الشروق، الظهر، العصر، المغرب، والعشاء حسب موقعك مع عدّاد للصلاة القادمة.',
    alternates: { canonical: '/prayer' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}