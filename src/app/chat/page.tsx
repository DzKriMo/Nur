'use client';

import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
    return (
        <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-8rem)] md:pt-16">
            <ChatInterface />
        </div>
    );
}