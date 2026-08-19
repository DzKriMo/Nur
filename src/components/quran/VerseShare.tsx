'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Copy, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrnamentDivider, KhatamStar } from '@/components/layout/Ornament';

interface VerseShareProps {
    surahName: string;
    verseNum: string;
    text: string;
    translation: string;
    onClose: () => void;
}

export default function VerseShare({ surahName, verseNum, text, translation, onClose }: VerseShareProps) {
    const { t } = useLanguage();
    const cardRef = useRef<HTMLDivElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let cancelled = false;
        if (!cardRef.current) return;
        const node = cardRef.current;
        const id = window.setTimeout(() => {
            toPng(node, { pixelRatio: 2, backgroundColor: '#f5f0e4', cacheBust: true })
                .then((url) => {
                    if (!cancelled) setImageUrl(url);
                })
                .catch(() => {
                    if (!cancelled) setError(true);
                });
        }, 150);
        return () => {
            cancelled = true;
            window.clearTimeout(id);
        };
    }, []);

    const download = () => {
        if (!imageUrl) return;
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${surahName}-${verseNum}.png`;
        a.click();
    };

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(`${surahName} ${verseNum}: ${text}\n\n${translation}`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    const share = async () => {
        if (!imageUrl) return;
        try {
            const blob = await (await fetch(imageUrl)).blob();
            const file = new File([blob], `${surahName}-${verseNum}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: `${surahName} ${verseNum}` });
            } else {
                download();
            }
        } catch {
            // user cancelled or sharing unsupported
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-night-900 rounded-2xl shadow-2xl max-w-sm w-full p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('quran.share_image')}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={t('common.close')}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-night-800 min-h-[160px] flex items-center justify-center">
                    {imageUrl ? (
                        <img src={imageUrl} alt={`${surahName} ${verseNum}`} className="w-full" />
                    ) : error ? (
                        <p className="text-sm text-slate-400 px-6 text-center">
                            {t('quran.share_error')}
                        </p>
                    ) : (
                        <Loader2 size={24} className="animate-spin text-emerald-500" />
                    )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button
                        onClick={share}
                        disabled={!imageUrl}
                        className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Share2 size={16} />
                        {t('quran.share_now')}
                    </button>
                    <button
                        onClick={download}
                        disabled={!imageUrl}
                        className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Download size={16} />
                        {t('quran.download')}
                    </button>
                    <button
                        onClick={copyText}
                        className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        {copied ? t('common.copied') : t('quran.copy_text')}
                    </button>
                </div>
            </div>

            {/* Off-screen source node used to rasterize the share image. */}
            <div className="fixed -left-[9999px] top-0" aria-hidden>
                <div
                    ref={cardRef}
                    className="w-[600px] p-8 bg-gradient-to-br from-emerald-50 via-parchment-50 to-parchment-100 border-4 border-gold-500/70 rounded-3xl"
                >
                    <p className="text-center font-arabic text-lg text-emerald-800 leading-relaxed mb-3">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <div className="max-w-xs mx-auto mb-5">
                        <OrnamentDivider />
                    </div>
                    <p className="text-center font-arabic text-[28px] leading-[2.1] text-slate-800">
                        {text}
                    </p>
                    <div className="mt-5 max-w-xs mx-auto">
                        <OrnamentDivider />
                    </div>
                    <p className="mt-4 text-center font-arabic text-lg text-gold-700">
                        {surahName} — الآية {verseNum}
                    </p>
                    {translation && (
                        <p className="mt-3 text-center text-sm text-slate-500 italic leading-relaxed px-6">
                            {translation}
                        </p>
                    )}
                    <div className="mt-6 pt-4 border-t border-gold-500/30 flex items-center justify-center gap-2">
                        <KhatamStar size={14} className="text-gold-500" />
                        <span className="font-display font-bold text-xl text-gold-gradient">نور</span>
                        <span className="text-xs uppercase tracking-widest text-slate-400">Nur · Qur&apos;an</span>
                        <KhatamStar size={14} className="text-gold-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}