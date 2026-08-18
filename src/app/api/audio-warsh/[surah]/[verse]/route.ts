import { NextRequest } from 'next/server';
import fs from 'fs';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const AUDIO_ROOT = '/var/www/nur/audio-warsh/out';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ surah: string; verse: string }> }
) {
    const { surah, verse } = await params;
    if (!/^\d{3}$/.test(surah) || !/^\d{3}$/.test(verse)) {
        return new Response('Bad request', { status: 400 });
    }

    const file = `${AUDIO_ROOT}/${surah}/${verse}.mp3`;
    let stat: fs.Stats;
    try {
        stat = fs.statSync(file);
    } catch {
        return new Response('Not found', { status: 404 });
    }

    const base = {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
    };

    const range = request.headers.get('range');
    if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        let start = match && match[1] ? parseInt(match[1], 10) : 0;
        let end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;
        start = Math.max(0, Math.min(start, stat.size - 1));
        end = Math.max(start, Math.min(end, stat.size - 1));
        const stream = Readable.toWeb(fs.createReadStream(file, { start, end })) as ReadableStream;
        return new Response(stream, {
            status: 206,
            headers: {
                ...base,
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Content-Length': String(end - start + 1),
            },
        });
    }

    const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
    return new Response(stream, {
        status: 200,
        headers: { ...base, 'Content-Length': String(stat.size) },
    });
}
