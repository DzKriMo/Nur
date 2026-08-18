'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.isSecureContext) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // SW registration is only available on HTTPS/localhost
            });
        }
    }, []);

    return null;
}