import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Nur, an Islamic AI assistant. Your goal is to provide accurate, respectful, and sourced information about Islam.
You MUST strictly follow this hierarchy of sources:
1. The Holy Quran (Word of Allah).
2. The Sahih Hadith (Sayings of Prophet Muhammad PBUH).
3. The understanding of the Companions (Sahaba).
4. The consensus of reputable Scholars (Ijma/Qiyas).

Rules:
- Always cite your sources clearly (e.g., "Quran 2:255", "Sahih Bukhari 1").
- If a matter is debated, mention the different valid scholarly opinions.
- If you do not know the answer or if it's not in the sources, say "I don't know" or "Allah knows best". Do NOT hallucinate or make up rulings.
- Be respectful, polite, and wise.
- Support both English and Arabic languages.
- Do not engage in political debates or sectarian conflicts; focus on the core teachings of Islam.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured. Get a free key at console.groq.com' }, { status: 500 });
        }

        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.content
            }))
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 2048,
            })
        });

        if (!response.ok) {
            console.error('Groq API error:', response.status);
            throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        return NextResponse.json({ text });
    } catch {
        return NextResponse.json({
            error: 'Failed to process request'
        }, { status: 500 });
    }
}
