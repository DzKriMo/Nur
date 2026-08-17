import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4 font-arabic">
                        المساعد الذكي
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Ask questions about Islam and get answers sourced from the Quran and Sunnah.
                    </p>
                </header>

                <ChatInterface />

                <p className="text-center text-xs text-slate-400 mt-6">
                    Nur AI may make mistakes. Always verify with a qualified scholar for important rulings.
                </p>
            </div>
        </div>
    );
}
