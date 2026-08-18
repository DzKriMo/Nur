'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
            <iframe
                src="https://chatilm.islamicity.org/en"
                className="flex-1 w-full border-0 min-h-0"
                style={{ height: 'calc(100vh - 4rem - 2rem)' }}
                title="ChatILM - Islamic AI Assistant"
                allow="clipboard-write; popups"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
            />
            <div className="flex-shrink-0 text-center text-xs text-slate-400 dark:text-slate-500 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                {t('chat.powered_by')} <a href="https://chatilm.islamicity.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500 transition-colors">IslamiCity ChatILM</a>
            </div>
        </div>
    );
}
