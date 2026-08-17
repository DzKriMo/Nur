import { Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 dark:text-emerald-400">
                    <Heart size={40} />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 font-serif">About Nur</h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Nur is a comprehensive Islamic application designed to provide easy access to the Quran, Hadith, and Adhkar in a beautiful, modern interface. Our goal is to connect users with the sources of Islam using the latest technology.
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 mb-8">
                    <p className="font-arabic text-xl md:text-2xl text-emerald-800 dark:text-emerald-400 mb-4 leading-loose">
                        هذا التطبيق صدقه جاريه على روح الوالد
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 italic">
                        "When a person dies, his deeds come to an end except for three: Sadaqah Jariyah (a continuous charity), or knowledge from which benefit is gained, or a righteous child who prays for him."
                    </p>
                </div>

                <p className="text-sm text-slate-400">
                    Built with ❤️ for the Ummah.
                </p>
            </div>
        </div>
    );
}
