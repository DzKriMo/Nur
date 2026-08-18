'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { newConvertLessons } from '@/data/learn/newConvert';

export default function NewMuslimPage() {
    const { t, dir, language } = useLanguage();
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [quizAnswered, setQuizAnswered] = useState<Record<string, boolean>>({});
    const [quizCorrect, setQuizCorrect] = useState<Record<string, boolean>>({});

    const isAr = language === 'ar';
    const lesson = newConvertLessons.find(l => l.id === selectedLesson);
    const step = lesson?.steps[currentStep];

    const handleQuizAnswer = (lessonId: string, isCorrect: boolean) => {
        setQuizAnswered(prev => ({ ...prev, [lessonId]: true }));
        setQuizCorrect(prev => ({ ...prev, [lessonId]: isCorrect }));
    };

    if (lesson && step) {
        const stepTitle = isAr ? step.titleAr : step.title;
        const stepContent = isAr ? step.contentAr : step.content;
        const lessonTitle = isAr ? lesson.titleAr : lesson.title;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 md:pt-24 px-4 pb-16">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => { setSelectedLesson(null); setCurrentStep(0); setQuizAnswered({}); }}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
                    >
                        {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        {t('learn.back_to_topics')}
                    </button>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 border-b border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    {t('learn.step')} {currentStep + 1} {t('learn.of')} {lesson.steps.length}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-arabic">{lessonTitle}</span>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-arabic">{stepTitle}</h2>
                            <div className={`text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-arabic ${isAr ? 'text-right' : ''}`}>
                                {stepContent}
                            </div>

                            {step.quiz && (
                                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3">{t('learn.quiz')}</h3>
                                    <p className="text-amber-900 dark:text-amber-200 mb-3 font-arabic">{isAr ? step.quiz.questionAr : step.quiz.question}</p>
                                    <div className="space-y-2">
                                        {step.quiz.options.map((option, i) => {
                                            const answered = quizAnswered[`${lesson.id}-${currentStep}`];
                                            const isCorrect = option.correct;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => !answered && handleQuizAnswer(`${lesson.id}-${currentStep}`, isCorrect)}
                                                    disabled={answered}
                                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                        answered && isCorrect
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                                            : answered && !isCorrect && quizAnswered[`${lesson.id}-${currentStep}`]
                                                            ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs">
                                                            {answered && isCorrect ? <Check size={14} /> : String.fromCharCode(65 + i)}
                                                        </span>
                                                        <span className="font-arabic">{isAr ? option.textAr : option.text}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {quizAnswered[`${lesson.id}-${currentStep}`] && (
                                        <p className={`mt-3 text-sm font-medium ${quizCorrect[`${lesson.id}-${currentStep}`] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {quizCorrect[`${lesson.id}-${currentStep}`] ? t('learn.quiz_correct') : t('learn.quiz_wrong')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
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
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    {t('learn.next')}
                                    {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setSelectedLesson(null); setCurrentStep(0); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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
                <Link href="/learn" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
                    {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {t('learn.back_to_topics')}
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('learn.new_convert')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {t('learn.new_convert_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newConvertLessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 text-left"
                        >
                            <div className="text-3xl mb-3">{lesson.icon}</div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 font-arabic">{isAr ? lesson.titleAr : lesson.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{lesson.steps.length} {t('learn.step')}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
