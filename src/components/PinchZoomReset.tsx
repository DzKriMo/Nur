'use client';

import { useEffect } from 'react';

// Lets users pinch-zoom (accessibility) but snaps the page back to scale 1
// once the gesture is released, so the layout never stays broken/zoomed.
const RESET_DURATION_MS = 350;
const NORMAL_CONTENT = 'width=device-width, initial-scale=1, viewport-fit=cover';
const SNAP_CONTENT = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

export default function PinchZoomReset() {
    useEffect(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        if (!meta) return;
        const original = meta.getAttribute('content') ?? NORMAL_CONTENT;

        let touchCount = 0;
        let pinched = false;
        let restoreTimer: ReturnType<typeof setTimeout> | null = null;

        const snapToNormal = () => {
            if (window.visualViewport && window.visualViewport.scale <= 1.01) return;
            meta.setAttribute('content', SNAP_CONTENT);
            if (restoreTimer) clearTimeout(restoreTimer);
            restoreTimer = setTimeout(() => {
                meta.setAttribute('content', original);
                restoreTimer = null;
            }, RESET_DURATION_MS);
        };

        const onTouchStart = (e: TouchEvent) => {
            touchCount = e.touches.length;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length >= 2) pinched = true;
            touchCount = e.touches.length;
        };
        const onTouchEnd = (e: TouchEvent) => {
            touchCount = e.touches.length;
            if (touchCount === 0 && pinched) {
                pinched = false;
                snapToNormal();
            }
        };
        const onGestureEnd = () => {
            if (pinched) {
                pinched = false;
                snapToNormal();
            }
        };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('touchcancel', onTouchEnd, { passive: true });
        window.addEventListener('gestureend', onGestureEnd);

        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
            window.removeEventListener('gestureend', onGestureEnd);
            if (restoreTimer) clearTimeout(restoreTimer);
        };
    }, []);

    return null;
}