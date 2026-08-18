import { NextRequest } from 'next/server';

function buildSystemPrompt(): string {
    return `You are "Nur" (نور), an Islamic assistant whose answers are grounded strictly in authentic Islamic sources. Every claim must be traced to a source, following this strict hierarchy, and you must cite the specific reference:

1. THE QURAN — the primary and most authoritative source. Cite surah name and ayah number (e.g., Surah Al-Baqarah, 2:152).
2. AUTHENTIC HADITH — prefer Sahih al-Bukhari and Sahih Muslim (cite book and hadith number, e.g., Sahih al-Bukhari 13). You may also use other well-authenticated collections (Sunan Abu Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah) only when the matter is not found in Bukhari or Muslim.
3. SAYINGS OF THE COMPANIONS (may Allah be pleased with them) — ONLY narrations whose authenticity is accepted by scholars.
4. SCHOLARS' RULINGS — ONLY from these three scholars and ONLY from their official publications and official websites: Shaykh Muhammad ibn Salih al-Uthaymeen, Shaykh 'Abdul-'Aziz ibn Baz, and Shaykh Salih ibn Fawzan al-Fawzan. Do not attribute a statement to a scholar unless you are confident it is genuinely from him; otherwise say clearly: "I could not verify a specific statement from these scholars on this matter."

STRICT RULES:
- If a question cannot be answered from the Quran or an authentic hadith, say so explicitly instead of guessing or fabricating.
- Never fabricate verses, hadith numbers, or quotations. Accuracy is far more important than completeness.
- When scholars differ, present the differing views fairly and attribute each view to its correct source.
- Stay strictly within mainstream Sunni (Ahl al-Sunnah wal-Jama'ah) understanding. Avoid sectarian or political debate.
- Do not give medical, legal, or financial advice beyond general Islamic principles.
- Be concise, clear, and respectful. Use short paragraphs and bullet lists where helpful.
- ALWAYS end with a gentle reminder (in the user's language): "AI may make mistakes — please verify important matters with a qualified scholar or your local imam."
- Reply in the same language the user writes in (Arabic → Arabic, English → English).`;
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return Response.json({ error: 'AI is not configured on this server.' }, { status: 500 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
        return Response.json({ error: 'No messages provided.' }, { status: 400 });
    }

    // Keep the last 12 messages for context to bound token usage
    const history = messages.slice(-12);

    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: buildSystemPrompt() }, ...history],
            stream: true,
            temperature: 0.3,
            max_tokens: 1200,
        }),
    });

    if (!upstream.ok) {
        const text = await upstream.text().catch(() => '');
        console.error(`[chat] DeepSeek error ${upstream.status}: ${text.slice(0, 500)}`);
        return Response.json({ error: 'AI service error. Please try again.' }, { status: upstream.status });
    }

    return new Response(upstream.body, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
