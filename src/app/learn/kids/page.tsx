'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { kidsLessons } from '@/data/learn/kids';

export default function KidsPage() {
    const { t, dir, language } = useLanguage();
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const isAr = language === 'ar';
    const lesson = kidsLessons.find(l => l.id === selectedLesson);
    const step = lesson?.steps[currentStep];

    if (lesson && step) {
        const stepTitle = isAr ? step.titleAr : step.title;
        const stepContent = isAr ? step.contentAr : step.content;
        const funFact = isAr ? step.funFactAr : step.funFact;
        const lessonTitle = isAr ? lesson.titleAr : lesson.title;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 md:pt-24 px-4 pb-16">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => { setSelectedLesson(null); setCurrentStep(0); }}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors"
                    >
                        {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        {t('learn.back_to_topics')}
                    </button>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800" style={{ backgroundColor: `${lesson.color}15` }}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium" style={{ color: lesson.color }}>
                                    {t('learn.step')} {currentStep + 1} {t('learn.of')} {lesson.steps.length}
                                </span>
                                <span className="text-3xl">{lesson.icon}</span>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-arabic">{stepTitle}</h2>
                            <div className={`text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-arabic ${isAr ? 'text-right' : ''}`}>
                                {stepContent}
                            </div>

                            {funFact && (
                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <p className="text-amber-800 dark:text-amber-200 text-sm font-arabic">
                                        ✨ <strong>{funFact}</strong>
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">{t('learn.references')}</h3>
                                <ul className="space-y-1">
                                    {(isAr ? lesson.referencesAr : lesson.references).map((ref, i) => (
                                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 font-arabic">• {ref}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                            <button
                                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            >
                                {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                {t('learn.prev')}
                            </button>
                            {currentStep < lesson.steps.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                                >
                                    {t('learn.next')}
                                    {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setSelectedLesson(null); setCurrentStep(0); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                                >
                                    <Check size={18} />
                                    {t('learn.back_to_topics')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 md:pt-24 px-4 pb-16">
            <div className="max-w-3xl mx-auto">
                <Link href="/learn" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors">
                    {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {t('learn.back_to_topics')}
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('learn.kids_mode')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {t('learn.kids_mode_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {kidsLessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 text-left"
                            style={{ borderColor: `${lesson.color}30` }}
                        >
                            <div className="text-4xl mb-3">{lesson.icon}</div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 font-arabic">{isAr ? lesson.titleAr : lesson.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{lesson.steps.length} {t('learn.step')}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
