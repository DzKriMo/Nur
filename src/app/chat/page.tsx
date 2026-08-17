'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <iframe
                src="https://chatilm.islamicity.org/en"
                className="flex-1 w-full border-0"
                title="ChatILM - Islamic AI Assistant"
                allow="clipboard-write"
            />
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-2 bg-slate-50 dark:bg-slate-950">
                {t('chat.powered_by')} <a href="https://chatilm.islamicity.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500 transition-colors">IslamiCity ChatILM</a>
            </p>
        </div>
    );
}
