'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BookmarksProvider } from '@/contexts/BookmarksContext';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <BookmarksProvider>
                    {children}
                </BookmarksProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
