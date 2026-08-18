'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { newConvertLessons } from '@/data/learn/newConvert';
import Quiz from '@/components/learn/Quiz';

export default function NewMuslimPage() {
    const { t, dir, language } = useLanguage();
    const { learnProgress, markLearnCompleted } = useBookmarks();
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
    const [showCompletion, setShowCompletion] = useState(false);

    const isAr = language === 'ar';
    const lesson = newConvertLessons.find(l => l.id === selectedLesson);
    const step = lesson?.steps[currentStep];
    const hasQuiz = !!step?.quiz;

    const handleQuizAnswer = (correct: boolean) => {
        if (correct) {
            setQuizResults(prev => ({ ...prev, [currentStep]: true }));
        }
    };

    const resetView = () => {
        setSelectedLesson(null);
        setCurrentStep(0);
        setQuizResults({});
        setShowCompletion(false);
    };

    const finishLesson = () => {
        if (!lesson) return;
        const quizzes = lesson.steps.filter(s => s.quiz).length;
        const passedCount = lesson.steps.reduce((acc, s, i) => (s.quiz && quizResults[i] ? acc + 1 : acc), 0);
        const allPassed = quizzes === 0 || passedCount === quizzes;

        if (allPassed) {
            markLearnCompleted(lesson.id, quizzes === 0 ? 100 : Math.round((passedCount / quizzes) * 100));
        }
        setShowCompletion(true);
    };

    if (lesson && step) {
        const stepTitle = isAr ? step.titleAr : step.title;
        const stepContent = isAr ? step.contentAr : step.content;
        const lessonTitle = isAr ? lesson.titleAr : lesson.title;
        const quizzes = lesson.steps.filter(s => s.quiz).length;
        const passedCount = lesson.steps.reduce((acc, s, i) => (s.quiz && quizResults[i] ? acc + 1 : acc), 0);

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 md:pt-24 px-4 pb-16">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={resetView}
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
                            {quizzes > 0 && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-1">
                                        {lesson.steps.map((s, i) => (
                                            <span
                                                key={i}
                                                className={`w-6 h-1.5 rounded-full ${s.quiz ? (quizResults[i] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600') : 'bg-slate-200 dark:bg-slate-700'}`}
                                            />
                                        ))}
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ms-2">
                                            {passedCount}/{quizzes} {t('learn.quiz')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-arabic">{stepTitle}</h2>
                            <div className={`text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-arabic ${isAr ? 'text-right' : ''}`}>
                                {stepContent}
                            </div>

                            {hasQuiz && (
                                <Quiz key={currentStep} quiz={step.quiz!} onAnswer={handleQuizAnswer} />
                            )}

                            {showCompletion && (
                                <div className={`mt-6 p-4 rounded-xl border text-sm font-arabic ${
                                    passedCount === quizzes
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                                }`}>
                                    {passedCount === quizzes ? `🎉 ${t('learn.quiz_passed')}` : t('learn.quiz_failed')}
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
                                    onClick={finishLesson}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    <Check size={18} />
                                    {t('learn.finish_quiz')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const completedCount = newConvertLessons.filter(l => learnProgress[l.id]?.completed).length;

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
                    {completedCount > 0 && (
                        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300">
                            <Star size={15} className="fill-amber-400 text-amber-400" />
                            {completedCount} / {newConvertLessons.length} {t('learn.lessons_completed')}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newConvertLessons.map((lesson) => {
                        const done = learnProgress[lesson.id]?.completed;
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson.id)}
                                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 text-left relative"
                            >
                                {done && (
                                    <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                        <Check size={13} strokeWidth={3} />
                                    </span>
                                )}
                                <div className="text-3xl mb-3">{lesson.icon}</div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 font-arabic">{isAr ? lesson.titleAr : lesson.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {lesson.steps.length} {t('learn.step')} • {lesson.steps.filter(s => s.quiz).length} {t('learn.quiz')}
                                </p>
                                {done && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                                        {t('learn.completed')} • {t('learn.score')}: {learnProgress[lesson.id].score}%
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}