'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, BookMarked, RefreshCcw, Bot, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS: { en: string; ar: string }[] = [
    { en: 'How do I increase my patience (sabr)?', ar: 'كيف أزيد من صبري؟' },
    { en: 'What does the Quran say about kindness to parents?', ar: 'ماذا يقول القرآن عن بر الوالدين؟' },
    { en: 'Give me a hadith about honesty in trade.', ar: 'اذكر لي حديثاً عن الصدق في التجارة.' },
    { en: 'What is the ruling on wasting food?', ar: 'ما حكم إهدار الطعام؟' },
];

export default function ChatInterface() {
    const { t, language, dir } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const isAr = language === 'ar';
    const suggestions = SUGGESTIONS.map(s => (isAr ? s.ar : s.en));

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingText]);

    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);

    const sendMessage = async (text: string) => {
        const content = text.trim();
        if (!content || loading) return;

        const userMsg: ChatMessage = { role: 'user', content };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput('');
        setError(null);
        setLoading(true);
        setStreamingText('');

        try {
            const controller = new AbortController();
            abortRef.current = controller;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setError(data?.error ?? t('chat.error'));
                setLoading(false);
                return;
            }

            const reader = res.body?.getReader();
            if (!reader) {
                setError(t('chat.error'));
                setLoading(false);
                return;
            }

            const decoder = new TextDecoder();
            let buffer = '';
            let full = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data:')) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            full += delta;
                            setStreamingText(full);
                        }
                    } catch {
                        // partial JSON line — ignore
                    }
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: full || t('chat.error') }]);
        } catch (e) {
            if ((e as Error).name !== 'AbortError') {
                setError(t('chat.error'));
            }
        } finally {
            setLoading(false);
            setStreamingText('');
            abortRef.current = null;
        }
    };

    const resetChat = () => {
        abortRef.current?.abort();
        setMessages([]);
        setStreamingText('');
        setError(null);
        setInput('');
    };

    const allMessages: ChatMessage[] = streamingText
        ? [...messages, { role: 'assistant', content: streamingText }]
        : messages;

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <BookMarked size={16} className="text-emerald-500" />
                    <span>{t('chat.sources_hint')}</span>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={resetChat}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                        <RefreshCcw size={13} />
                        {t('chat.new_chat')}
                    </button>
                )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4" dir={dir}>
                {allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                            <Bot size={32} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('chat.empty_title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8">{t('chat.empty_desc')}</p>

                        <div className="space-y-2 w-full max-w-md">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{t('chat.suggestions')}</p>
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s)}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    allMessages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                                    msg.role === 'user'
                                        ? "bg-emerald-600 text-white rounded-br-md"
                                        : "bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                                )}
                            >
                                {msg.content}
                                {loading && msg.role === 'assistant' && i === allMessages.length - 1 && (
                                    <span className="inline-block w-1.5 h-4 bg-emerald-500 animate-pulse ml-1 align-middle" />
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    <User size={16} className="text-slate-500 dark:text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {error && (
                    <div className="text-center text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-night-900/80 backdrop-blur-xl">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mb-2">
                    {t('chat.verify')}
                </p>
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-night-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
                        title={t('chat.send')}
                    >
                        <Send size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
}