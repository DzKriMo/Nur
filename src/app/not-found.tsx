import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center">
                <div className="font-arabic text-8xl font-bold text-emerald-600/20 dark:text-emerald-400/10 mb-4">
                    ٤٠٤
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                    Page Not Found
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    The page you are looking for does not exist.
                </p>
                <Link
                    href="/"
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all hover:shadow-lg inline-block"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
