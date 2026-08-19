'use client';

// Shared persistent HTML5 audio player with Media Session support.
//
// A single <audio> element is reused across every track change. Once the user
// starts playback from a tap, the browser keeps that element's media session
// alive, so the SAME element may keep playing — and advance to the next verse
// via its `ended` event — even when the tab is backgrounded or the phone is
// locked. Creating a fresh Howl/audio element per verse does not work there,
// because calling play() without a user gesture is blocked in the background.

export interface TrackHandlers {
    onEnd?: () => void;
    onError?: () => void;
}

export interface TrackMetadata {
    title: string;
    artist: string;
    album?: string;
    artwork?: { src: string; sizes: string; type: string }[];
}

let audio: HTMLAudioElement | null = null;
let handlers: TrackHandlers | null = null;

const DEFAULT_ARTWORK = [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
];

function getAudio(): HTMLAudioElement {
    if (!audio) {
        audio = new Audio();
        audio.preload = 'auto';
        audio.addEventListener('ended', () => handlers?.onEnd?.());
        audio.addEventListener('error', () => handlers?.onError?.());
    }
    return audio;
}

export function playTrack(src: string, next: TrackHandlers): void {
    handlers = next;
    const el = getAudio();
    el.src = src;
    el.play().catch(() => handlers?.onError?.());
}

export function stopTrack(): void {
    handlers = null;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
}

export function isTrackPlaying(): boolean {
    return !!audio && !audio.paused && !audio.ended && audio.currentTime > 0;
}

/** Warm the HTTP cache with the next verse so the background transition is seamless. */
export function preloadTrack(src: string): void {
    try {
        const el = new Audio();
        el.preload = 'auto';
        el.src = src;
        el.load();
    } catch {
        /* optional */
    }
}

export function setTrackMetadata(meta: TrackMetadata): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: meta.title,
            artist: meta.artist,
            album: meta.album,
            artwork: meta.artwork && meta.artwork.length > 0 ? meta.artwork : DEFAULT_ARTWORK,
        });
    } catch {
        /* unsupported */
    }
}

export function setTrackPlaybackState(state: 'none' | 'paused' | 'playing'): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
        navigator.mediaSession.playbackState = state;
    } catch {
        /* unsupported */
    }
}

export function setTrackActionHandler(
    action: 'play' | 'pause' | 'previoustrack' | 'nexttrack',
    handler: (() => void) | null
): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
        navigator.mediaSession.setActionHandler(action, handler);
    } catch {
        /* action not supported by this platform */
    }
}