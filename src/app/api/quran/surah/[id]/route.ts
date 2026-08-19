import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSurah } from '@/lib/data';
import { getRiwayaFromCookie } from '@/lib/riwaya';

export const dynamic = 'force-dynamic';

// Serves a single surah's full text for the client-side cross-surah review.
// The riwaya cookie determines Hafs vs Warsh text, matching the audio URLs
// used by the memorization player.
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!/^\d{3}$/.test(id)) {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
    const riwaya = getRiwayaFromCookie((await cookies()).toString());
    try {
        const surah = await getSurah(id, riwaya);
        return NextResponse.json(surah);
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
}