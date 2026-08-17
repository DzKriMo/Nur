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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood. I am Nur, ready to assist with Islamic knowledge using authentic sources.' }]
            },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }))
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            console.error('Gemini API error:', response.status);
            throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ text });
    } catch {
        return NextResponse.json({
            error: 'Failed to process request'
        }, { status: 500 });
    }
}
