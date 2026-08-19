'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface QuizData {
    question: string;
    questionAr: string;
    options: { text: string; textAr: string; correct: boolean }[];
}

interface QuizProps {
    quiz: QuizData;
    onAnswer: (correct: boolean) => void;
}

export default function Quiz({ quiz, onAnswer }: QuizProps) {
    const { t, language } = useLanguage();
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);

    const isAr = language === 'ar';

    const choose = (index: number) => {
        if (answered) return;
        const option = quiz.options[index];
        setSelected(index);
        setAnswered(true);
        onAnswer(option.correct);
    };

    const retry = () => {
        setSelected(null);
        setAnswered(false);
    };

    const selectedCorrect = selected !== null && quiz.options[selected].correct;

    return (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3">{t('learn.quiz')}</h3>
            <p className="text-amber-900 dark:text-amber-200 mb-3 font-arabic">
                {isAr ? quiz.questionAr : quiz.question}
            </p>
            <div className="space-y-2">
                {quiz.options.map((option, i) => {
                    const isCorrect = option.correct;
                    const isSelected = selected === i;
                    return (
                        <button
                            key={i}
                            onClick={() => choose(i)}
                            disabled={answered}
                            className={cn(
                                "w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-2",
                                answered && isCorrect
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                    : answered && isSelected && !isCorrect
                                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-night-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600'
                            )}
                        >
                            <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs flex-shrink-0">
                                {answered && isCorrect ? <Check size={14} /> : answered && isSelected && !isCorrect ? <X size={14} /> : String.fromCharCode(65 + i)}
                            </span>
                            <span className="font-arabic">{isAr ? option.textAr : option.text}</span>
                        </button>
                    );
                })}
            </div>
            {answered && (
                <div className="mt-3 flex items-center justify-between">
                    <p className={cn("text-sm font-medium", selectedCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                        {selectedCorrect ? t('learn.quiz_correct') : t('learn.quiz_wrong')}
                    </p>
                    {!selectedCorrect && (
                        <button
                            onClick={retry}
                            className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                        >
                            {t('learn.take_quiz')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}